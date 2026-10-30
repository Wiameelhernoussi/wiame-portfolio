import os
import uuid
import shutil
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pathlib import Path
from app.core.config import settings


class BaseStorageService(ABC):
    """
    Abstract file storage provider.
    Allows seamless switching between local disk storage (development)
    and cloud providers like Cloudinary (production).
    """

    @abstractmethod
    def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
        folder: str = "general"
    ) -> Dict[str, Any]:
        """
        Uploads a file and returns metadata dictionary including public access URL.
        """
        pass

    @abstractmethod
    def delete_file(self, identifier: str) -> bool:
        """
        Deletes a file by its path or public ID.
        """
        pass


class LocalStorageService(BaseStorageService):
    """
    Local filesystem storage provider for development.
    """

    def __init__(self, base_dir: str = settings.UPLOAD_DIR):
        self.base_dir = Path(base_dir)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
        folder: str = "general"
    ) -> Dict[str, Any]:
        ext = Path(filename).suffix.lower()
        unique_name = f"{uuid.uuid4().hex}{ext}"
        target_dir = self.base_dir / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        file_path = target_dir / unique_name

        with open(file_path, "wb") as f:
            f.write(file_bytes)

        # Public relative URL served via FastAPI static files route
        public_url = f"/uploads/{folder}/{unique_name}"
        return {
            "url": public_url,
            "filename": filename,
            "stored_filename": unique_name,
            "path": str(file_path),
            "size": len(file_bytes),
            "content_type": content_type,
            "provider": "local"
        }

    def delete_file(self, identifier: str) -> bool:
        # identifier can be a relative url like /uploads/projects/xyz.png or absolute path
        clean_path = identifier.replace("/uploads/", "")
        file_path = self.base_dir / clean_path
        if file_path.exists() and file_path.is_file():
            try:
                os.remove(file_path)
                return True
            except OSError:
                return False
        return False


class CloudinaryStorageService(BaseStorageService):
    """
    Cloudinary storage provider for production.
    Supports images, PDFs, and generates CDN URLs.
    """

    def __init__(self):
        try:
            import cloudinary
            import cloudinary.uploader
            self.cloudinary = cloudinary
            self.uploader = cloudinary.uploader
            self.cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True
            )
        except ImportError:
            raise RuntimeError("Cloudinary SDK is required when STORAGE_PROVIDER=cloudinary")

    def upload_file(
        self,
        file_bytes: bytes,
        filename: str,
        content_type: str,
        folder: str = "wiame_portfolio"
    ) -> Dict[str, Any]:
        resource_type = "raw" if content_type == "application/pdf" else "auto"
        public_id_base = Path(filename).stem
        sanitized_public_id = f"{folder}/{public_id_base}_{uuid.uuid4().hex[:8]}"

        result = self.uploader.upload(
            file_bytes,
            public_id=sanitized_public_id,
            resource_type=resource_type,
            folder=folder,
            overwrite=True
        )

        return {
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "size": result.get("bytes", len(file_bytes)),
            "content_type": content_type,
            "provider": "cloudinary"
        }

    def delete_file(self, identifier: str) -> bool:
        try:
            result = self.uploader.destroy(identifier)
            return result.get("result") == "ok"
        except Exception:
            return False


def get_storage_service() -> BaseStorageService:
    provider = settings.STORAGE_PROVIDER.lower()
    if provider == "cloudinary":
        if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY:
            # Fall back to local with a warning if credentials missing
            return LocalStorageService()
        return CloudinaryStorageService()
    return LocalStorageService()
