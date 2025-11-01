from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
from pathlib import Path
from minio import Minio
from minio.error import S3Error
import hashlib
from datetime import datetime

from app.database import get_db
from app.models import User, Document
from app.auth import get_current_active_user
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# MinIO конфигурация
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "localhost:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "edo-documents")
MINIO_USE_SSL = os.getenv("MINIO_USE_SSL", "false").lower() == "true"

# Инициализация MinIO клиента
try:
    minio_client = Minio(
        MINIO_ENDPOINT,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=MINIO_USE_SSL
    )
    
    # Создание bucket если не существует
    if not minio_client.bucket_exists(MINIO_BUCKET):
        minio_client.make_bucket(MINIO_BUCKET)
        print(f"Bucket '{MINIO_BUCKET}' создан")
except Exception as e:
    print(f"Ошибка инициализации MinIO: {e}")
    minio_client = None

# Fallback: локальная директория для загрузки файлов
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    document_id: Optional[int] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Загрузка файла"""
    # Проверка типа файла
    allowed_extensions = {".pdf", ".docx", ".xlsx", ".png", ".jpg", ".jpeg"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Недопустимый тип файла")
    
    # Чтение содержимого файла
    content = await file.read()
    file_size = len(content)
    
    # Генерация хэша для проверки целостности
    file_hash = hashlib.sha256(content).hexdigest()
    
    # Генерация уникального пути
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = file.filename.replace(" ", "_")
    object_name = f"{current_user.company_id}/{timestamp}_{safe_filename}"
    
    file_path = None
    
    # Загрузка в MinIO если доступен
    if minio_client:
        try:
            from io import BytesIO
            minio_client.put_object(
                MINIO_BUCKET,
                object_name,
                BytesIO(content),
                file_size,
                content_type=file.content_type or "application/octet-stream"
            )
            file_path = f"{MINIO_BUCKET}/{object_name}"
        except S3Error as e:
            print(f"Ошибка загрузки в MinIO: {e}")
            # Fallback к локальному хранению
            file_path_local = UPLOAD_DIR / f"{current_user.company_id}_{timestamp}_{safe_filename}"
            with open(file_path_local, "wb") as buffer:
                buffer.write(content)
            file_path = str(file_path_local)
    else:
        # Локальное хранение
        file_path_local = UPLOAD_DIR / f"{current_user.company_id}_{timestamp}_{safe_filename}"
        with open(file_path_local, "wb") as buffer:
            buffer.write(content)
        file_path = str(file_path_local)
    
    # Если загружается документ, обновляем путь в БД
    if document_id:
        document = db.query(Document).filter(
            Document.id == document_id,
            Document.sender_company_id == current_user.company_id
        ).first()
        if document:
            document.original_file_path = file_path
            db.commit()
    
    return {
        "filename": file.filename,
        "path": file_path,
        "size": file_size,
        "hash": file_hash,
        "content_type": file.content_type
    }


@router.get("/download/{bucket}/{object_name:path}")
async def download_file(
    bucket: str,
    object_name: str,
    current_user: User = Depends(get_current_active_user)
):
    """Скачивание файла из MinIO или локального хранилища"""
    # Проверка что файл принадлежит компании пользователя
    if not object_name.startswith(f"{current_user.company_id}/"):
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    # Попытка скачать из MinIO
    if minio_client and bucket == MINIO_BUCKET:
        try:
            from io import BytesIO
            response = minio_client.get_object(bucket, object_name)
            content = response.read()
            response.close()
            response.release_conn()
            
            # Определение имени файла
            filename = object_name.split("/")[-1]
            
            return StreamingResponse(
                BytesIO(content),
                media_type="application/octet-stream",
                headers={
                    "Content-Disposition": f'attachment; filename="{filename}"'
                }
            )
        except S3Error as e:
            raise HTTPException(status_code=404, detail="Файл не найден в хранилище")
    
    # Fallback: локальное хранилище
    full_path = UPLOAD_DIR / object_name.split("/")[-1]
    
    if not full_path.exists():
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    return FileResponse(
        path=full_path,
        filename=full_path.name,
        media_type="application/octet-stream"
    )

