import io
from typing import Tuple, Optional
from PIL import Image, ImageOps


class ImageProcessingError(Exception):
    pass


def optimize_image_to_webp(
    image_bytes: bytes,
    max_dimension: int = 1920,
    quality: int = 85
) -> bytes:
    """
    Resizes image proportionally if larger than max_dimension,
    corrects orientation based on EXIF, and converts to modern WebP format.
    """
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            # Handle orientation from EXIF
            img = ImageOps.exif_transpose(img)

            # Convert RGBA/P to RGB if saving as JPEG, or keep RGBA for WebP transparency
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA")

            # Proportionally scale down if exceeding max_dimension
            img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

            output = io.BytesIO()
            img.save(output, format="WEBP", quality=quality, optimize=True)
            return output.getvalue()
    except Exception as e:
        raise ImageProcessingError(f"Failed to optimize image: {str(e)}")


def generate_thumbnail(
    image_bytes: bytes,
    size: Tuple[int, int] = (400, 400),
    quality: int = 80
) -> bytes:
    """
    Generates a crisp square or proportional thumbnail in WebP format.
    """
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img = ImageOps.exif_transpose(img)
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA")

            # Fit to exact thumbnail size using centered crop
            thumb = ImageOps.fit(img, size, Image.Resampling.LANCZOS)

            output = io.BytesIO()
            thumb.save(output, format="WEBP", quality=quality, optimize=True)
            return output.getvalue()
    except Exception as e:
        raise ImageProcessingError(f"Failed to generate thumbnail: {str(e)}")


def crop_portrait_center(
    image_bytes: bytes,
    aspect_ratio: float = 4.0 / 5.0,  # Portrait ratio
    target_width: int = 800,
    quality: int = 90
) -> bytes:
    """
    Crops image to a centered portrait aspect ratio for hero or profile display.
    """
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img = ImageOps.exif_transpose(img)
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA")

            target_height = int(target_width / aspect_ratio)
            cropped = ImageOps.fit(img, (target_width, target_height), Image.Resampling.LANCZOS)

            output = io.BytesIO()
            cropped.save(output, format="WEBP", quality=quality, optimize=True)
            return output.getvalue()
    except Exception as e:
        raise ImageProcessingError(f"Failed to crop portrait: {str(e)}")
