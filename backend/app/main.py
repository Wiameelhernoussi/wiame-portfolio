import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.v1.router import api_router
from app.api.v1.endpoints.seo import router as seo_router

app = FastAPI(
    title="Wiame El Hernoussi – Portfolio & Admin API",
    description="Production REST API for Wiame El Hernoussi's portfolio website and private admin CMS.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 1. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 2. Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# 3. Mount Static Uploads Folder
upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_path)), name="uploads")

# 4. Mount Workspace Assets Folder (if exists) so /assets/profile.png can be served directly
workspace_assets = Path("assets")
if workspace_assets.exists():
    app.mount("/assets", StaticFiles(directory=str(workspace_assets)), name="assets")

# 5. Include API Routers
app.include_router(api_router, prefix="/api/v1")
app.include_router(seo_router, tags=["SEO & Social Previews"])


# 6. Health Check
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "storage_provider": settings.STORAGE_PROVIDER
    }
