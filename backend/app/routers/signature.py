from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from typing import Optional
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import pkcs12
from cryptography.hazmat.backends import default_backend
import hashlib
from datetime import datetime

from app.database import get_db
from app.models import User, Document, Signature
from app.auth import get_current_active_user

router = APIRouter()


@router.post("/sign")
async def sign_document(
    document_id: int = Form(...),
    certificate: UploadFile = File(...),
    password: str = Form(...),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Подписание документа электронной подписью"""
    
    # Проверка документа
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.sender_company_id == current_user.company_id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")
    
    # Проверка типа файла сертификата
    if not (certificate.filename.endswith(".p12") or certificate.filename.endswith(".pfx")):
        raise HTTPException(status_code=400, detail="Недопустимый тип сертификата. Требуется PKCS#12 (.p12, .pfx)")
    
    try:
        # Чтение PKCS#12 сертификата
        cert_data = await certificate.read()
        
        # Загрузка сертификата
        private_key, certificate_obj, additional_certificates = pkcs12.load_key_and_certificates(
            cert_data,
            password.encode(),
            backend=default_backend()
        )
        
        if not private_key or not certificate_obj:
            raise HTTPException(status_code=400, detail="Неверный пароль или повреждённый сертификат")
        
        # Проверка срока действия сертификата
        now = datetime.now()
        if certificate_obj.not_valid_before > now or certificate_obj.not_valid_after < now:
            raise HTTPException(status_code=400, detail="Сертификат истёк или ещё не действителен")
        
        # Получение данных документа для подписи
        # TODO: Загрузить файл документа и вычислить хэш
        document_content = b""  # Здесь должен быть контент документа
        
        # Генерация хэша документа
        document_hash = hashlib.sha256(document_content).hexdigest()
        
        # Подписание хэша (упрощённая версия)
        # В реальности здесь должна быть полная логика подписания по ГОСТ
        # signature_data = private_key.sign(document_hash.encode(), padding=..., algorithm=...)
        signature_data = b"mock_signature"  # TODO: Реальная подпись
        
        # Сохранение подписи в БД
        signature = Signature(
            document_id=document_id,
            signer_id=current_user.id,
            certificate_serial=certificate_obj.serial_number.to_bytes(20, 'big').hex(),
            signature_hash=document_hash,
            signature_data=signature_data.hex(),
            is_valid=True,
        )
        
        db.add(signature)
        
        # Обновление статуса документа
        from app.models import DocumentStatus
        if document.status != DocumentStatus.SIGNED:
            document.status = DocumentStatus.SIGNED
        
        db.commit()
        db.refresh(signature)
        
        return {
            "message": "Документ успешно подписан",
            "signature_id": signature.id,
            "document_hash": document_hash,
            "certificate_subject": certificate_obj.subject.rfc4514_string(),
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Ошибка обработки сертификата: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка подписания документа: {str(e)}")


@router.get("/verify/{signature_id}")
async def verify_signature(
    signature_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Проверка валидности подписи"""
    
    signature = db.query(Signature).filter(
        Signature.id == signature_id
    ).first()
    
    if not signature:
        raise HTTPException(status_code=404, detail="Подпись не найдена")
    
    # TODO: Реальная проверка подписи по ГОСТ
    # Проверка цепочки сертификатов, CRL, OCSP и т.д.
    
    return {
        "signature_id": signature.id,
        "is_valid": signature.is_valid,
        "signed_at": signature.signed_at,
        "certificate_serial": signature.certificate_serial,
    }



