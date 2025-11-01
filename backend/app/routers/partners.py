from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Partner, User
from app.schemas import PartnerResponse, PartnerCreate
from app.auth import get_current_active_user

router = APIRouter()


@router.get("/", response_model=List[PartnerResponse])
async def get_partners(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    is_connected: Optional[bool] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получение списка контрагентов"""
    query = db.query(Partner).filter(Partner.company_id == current_user.company_id)
    
    if search:
        query = query.filter(
            Partner.partner_name.ilike(f"%{search}%") |
            Partner.partner_inn.ilike(f"%{search}%")
        )
    
    if is_connected is not None:
        query = query.filter(Partner.is_connected == is_connected)
    
    partners = query.order_by(Partner.created_at.desc()).offset(skip).limit(limit).all()
    return partners


@router.get("/{partner_id}", response_model=PartnerResponse)
async def get_partner(
    partner_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Получение контрагента по ID"""
    partner = db.query(Partner).filter(
        Partner.id == partner_id,
        Partner.company_id == current_user.company_id
    ).first()
    
    if not partner:
        raise HTTPException(status_code=404, detail="Контрагент не найден")
    
    return partner


@router.post("/", response_model=PartnerResponse)
async def create_partner(
    partner: PartnerCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Создание нового контрагента"""
    # Проверка на существующего контрагента
    existing = db.query(Partner).filter(
        Partner.company_id == current_user.company_id,
        Partner.partner_inn == partner.partner_inn
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Контрагент с таким ИНН уже существует")
    
    db_partner = Partner(
        **partner.dict(),
        company_id=current_user.company_id,
        is_connected=False,
    )
    db.add(db_partner)
    db.commit()
    db.refresh(db_partner)
    return db_partner


@router.delete("/{partner_id}")
async def delete_partner(
    partner_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Удаление контрагента"""
    partner = db.query(Partner).filter(
        Partner.id == partner_id,
        Partner.company_id == current_user.company_id
    ).first()
    
    if not partner:
        raise HTTPException(status_code=404, detail="Контрагент не найден")
    
    db.delete(partner)
    db.commit()
    return {"message": "Контрагент удалён"}



