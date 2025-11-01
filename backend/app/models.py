from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.database import Base


class DocumentStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    SIGNED = "signed"
    SENT = "sent"
    ARCHIVED = "archived"
    REJECTED = "rejected"


class DocumentType(str, enum.Enum):
    CONTRACT = "contract"
    ACT = "act"
    INVOICE = "invoice"
    INVOICE_TAX = "invoice_tax"
    OTHER = "other"


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    DIRECTOR = "director"
    ACCOUNTANT = "accountant"
    LAWYER = "lawyer"
    VIEWER = "viewer"


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    inn = Column(String(20), unique=True, nullable=False, index=True)
    ogrn = Column(String(20), unique=True, nullable=True)
    kpp = Column(String(20), nullable=True)
    legal_address = Column(String(500), nullable=True)
    actual_address = Column(String(500), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    website = Column(String(255), nullable=True)
    
    # Файлы
    logo_path = Column(String(500), nullable=True)
    stamp_path = Column(String(500), nullable=True)
    letterhead_path = Column(String(500), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    users = relationship("User", back_populates="company")
    documents_sent = relationship("Document", foreign_keys="Document.sender_company_id", back_populates="sender_company")
    documents_received = relationship("Document", foreign_keys="Document.receiver_company_id", back_populates="receiver_company")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.VIEWER)
    is_active = Column(Boolean, default=True)
    
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company", back_populates="users")
    signatures = relationship("Signature", back_populates="signer")


class Partner(Base):
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    
    partner_name = Column(String(255), nullable=False)
    partner_inn = Column(String(20), nullable=False, index=True)
    partner_email = Column(String(255), nullable=True)
    partner_phone = Column(String(50), nullable=True)
    
    # Статус роуминга
    is_connected = Column(Boolean, default=False)
    invitation_sent_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    company = relationship("Company")


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(100), nullable=False, index=True)
    document_type = Column(SQLEnum(DocumentType), nullable=False)
    status = Column(SQLEnum(DocumentStatus), default=DocumentStatus.DRAFT)
    
    sender_company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    receiver_company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    
    # Реквизиты
    date = Column(DateTime(timezone=True), server_default=func.now())
    amount = Column(Numeric(15, 2), nullable=True)
    currency = Column(String(10), default="сом")
    nds = Column(Numeric(15, 2), nullable=True)
    
    # Файлы
    original_file_path = Column(String(500), nullable=True)
    signed_file_path = Column(String(500), nullable=True)
    
    # Метаданные
    version = Column(Integer, default=1)
    parent_document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    sender_company = relationship("Company", foreign_keys=[sender_company_id], back_populates="documents_sent")
    receiver_company = relationship("Company", foreign_keys=[receiver_company_id], back_populates="documents_received")
    signatures = relationship("Signature", back_populates="document")
    versions = relationship("DocumentVersion", back_populates="document")
    comments = relationship("Comment", back_populates="document")


class DocumentVersion(Base):
    __tablename__ = "document_versions"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)
    hash = Column(String(64), nullable=True)  # SHA-256 hash
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="versions")


class Signature(Base):
    __tablename__ = "signatures"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    signer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Данные подписи
    certificate_serial = Column(String(255), nullable=True)
    signature_hash = Column(String(64), nullable=True)
    signature_data = Column(Text, nullable=True)  # Base64 подпись
    
    is_valid = Column(Boolean, default=False)
    signed_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="signatures")
    signer = relationship("User", back_populates="signatures")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    document = relationship("Document", back_populates="comments")



