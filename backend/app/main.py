from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

from app.database import engine, Base
from app.routers import auth, companies, documents, partners, files, signature

load_dotenv()

# Создаём таблицы при запуске (в продакшене использовать миграции)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ЭДО Система API",
    description="API для системы электронного документооборота",
    version="1.0.0",
)

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(companies.router, prefix="/api/companies", tags=["companies"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(partners.router, prefix="/api/partners", tags=["partners"])
app.include_router(files.router, prefix="/api/files", tags=["files"])
app.include_router(signature.router, prefix="/api/signature", tags=["signature"])


@app.get("/")
async def root():
    return JSONResponse({
        "message": "ЭДО Система API",
        "version": "1.0.0",
        "status": "running"
    })


@app.get("/health")
async def health():
    return JSONResponse({"status": "healthy"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

