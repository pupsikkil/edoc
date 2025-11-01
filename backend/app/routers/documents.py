from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import Document, User, Company, DocumentStatus
from app.schemas import DocumentResponse, DocumentCreate, DocumentUpdate
from app.auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[DocumentResponse])
async def get_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[DocumentStatus] = None,
    document_type: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получение списка документов"""
    query = db.query(Document).filter(
        Document.sender_company_id == current_user.company_id
    )
    
    if status:
        query = query.filter(Document.status == status)
    if document_type:
        query = query.filter(Document.document_type == document_type)
    
    documents = query.order_by(Document.created_at.desc()).offset(skip).limit(limit).all()
    return documents


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получение документа по ID"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.sender_company_id == current_user.company_id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")
    
    return document


@router.post("/", response_model=DocumentResponse)
async def create_document(
    document: DocumentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Создание нового документа"""
    db_document = Document(
        **document.dict(),
        sender_company_id=current_user.company_id,
        status=DocumentStatus.DRAFT,
        version=1,
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: int,
    document_update: DocumentUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Обновление документа"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.sender_company_id == current_user.company_id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")
    
    update_data = document_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(document, field, value)
    
    db.commit()
    db.refresh(document)
    return document


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Удаление документа"""
    document = db.query(Document).filter(
        Document.id == document_id,
        Document.sender_company_id == current_user.company_id
    ).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Документ не найден")
    
    db.delete(document)
    db.commit()
    return {"message": "Документ удалён"}



