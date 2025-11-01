from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from app.models import DocumentStatus, DocumentType, UserRole


# Auth schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[int] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_name: str
    inn: str


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole


class UserCreate(UserBase):
    password: str
    company_id: int


class UserResponse(UserBase):
    id: int
    company_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# Company schemas
class CompanyBase(BaseModel):
    name: str
    inn: str
    ogrn: Optional[str] = None
    kpp: Optional[str] = None
    legal_address: Optional[str] = None
    actual_address: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = None
    ogrn: Optional[str] = None
    kpp: Optional[str] = None
    legal_address: Optional[str] = None
    actual_address: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    website: Optional[str] = None


class CompanyResponse(CompanyBase):
    id: int
    logo_path: Optional[str] = None
    stamp_path: Optional[str] = None
    letterhead_path: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Document schemas
class DocumentBase(BaseModel):
    number: str
    document_type: DocumentType
    amount: Optional[float] = None
    currency: str = "сом"
    nds: Optional[float] = None
    date: Optional[datetime] = None


class DocumentCreate(DocumentBase):
    receiver_company_id: Optional[int] = None


class DocumentUpdate(BaseModel):
    number: Optional[str] = None
    status: Optional[DocumentStatus] = None
    amount: Optional[float] = None
    nds: Optional[float] = None


class DocumentResponse(DocumentBase):
    id: int
    status: DocumentStatus
    sender_company_id: int
    receiver_company_id: Optional[int] = None
    original_file_path: Optional[str] = None
    signed_file_path: Optional[str] = None
    version: int
    parent_document_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Partner schemas
class PartnerBase(BaseModel):
    partner_name: str
    partner_inn: str
    partner_email: Optional[EmailStr] = None
    partner_phone: Optional[str] = None


class PartnerCreate(PartnerBase):
    pass


class PartnerResponse(PartnerBase):
    id: int
    company_id: int
    is_connected: bool
    invitation_sent_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Signature schemas
class SignatureResponse(BaseModel):
    id: int
    document_id: int
    signer_id: int
    signer_name: str
    certificate_serial: Optional[str] = None
    is_valid: bool
    signed_at: datetime

    class Config:
        from_attributes = True


# Comment schemas
class CommentCreate(BaseModel):
    text: str


class CommentResponse(BaseModel):
    id: int
    document_id: int
    user_id: int
    user_name: str
    text: str
    created_at: datetime

    class Config:
        from_attributes = True



