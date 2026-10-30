from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.api.deps import get_current_admin_user
from app.models.user import AdminUser
from app.services.storage import get_storage_service
from app.services.image_processor import (
    optimize_image_to_webp,
    generate_thumbnail,
    crop_portrait_center,
    ImageProcessingError
)

router = APIRouter()

ALLOWED_MIME_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "application/pdf": ".pdf"
}

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("")
async def upload_file(
    file: UploadFile = File(...),
    folder: str = Form("general"),
    crop_portrait: bool = Form(False),
    current_user: AdminUser = Depends(get_current_admin_user)
):
    """
    Secure file upload endpoint.
    - Validates MIME type and file size.
    - Automatically converts images to modern WebP format and generates thumbnails.
    - Dispatches to configured storage provider (Local in development, Cloudinary in production).
    """
    content_type = file.content_type
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{content_type}' is not permitted. Allowed types: JPG, PNG, WebP, PDF"
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 10 MB maximum limit"
        )

    storage = get_storage_service()
    original_stem = Path(file.filename).stem

    # If PDF, upload directly
    if content_type == "application/pdf":
        result = storage.upload_file(
            file_bytes=file_bytes,
            filename=file.filename,
            content_type=content_type,
            folder=folder
        )
        return {
            "url": result.get("url"),
            "thumbnail_url": None,
            "filename": file.filename,
            "size": result.get("size", len(file_bytes)),
            "content_type": content_type,
            "provider": result.get("provider")
        }

    # If Image, process with Pillow: optimize to WebP and generate thumbnail
    try:
        if crop_portrait:
            optimized_bytes = crop_portrait_center(file_bytes, aspect_ratio=4.0/5.0, target_width=800)
        else:
            optimized_bytes = optimize_image_to_webp(file_bytes, max_dimension=1920, quality=85)

        thumb_bytes = generate_thumbnail(file_bytes, size=(400, 400), quality=80)

        # Upload main optimized WebP image
        main_filename = f"{original_stem}.webp"
        main_upload = storage.upload_file(
            file_bytes=optimized_bytes,
            filename=main_filename,
            content_type="image/webp",
            folder=folder
        )

        # Upload thumbnail
        thumb_filename = f"{original_stem}_thumb.webp"
        thumb_upload = storage.upload_file(
            file_bytes=thumb_bytes,
            filename=thumb_filename,
            content_type="image/webp",
            folder=f"{folder}/thumbs"
        )

        return {
            "url": main_upload.get("url"),
            "thumbnail_url": thumb_upload.get("url"),
            "filename": main_filename,
            "size": len(optimized_bytes),
            "content_type": "image/webp",
            "provider": main_upload.get("provider")
        }

    except ImageProcessingError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Image processing error: {str(e)}"
        )
