import io
from PIL import Image
from app.services.image_processor import (
    optimize_image_to_webp,
    generate_thumbnail,
    crop_portrait_center
)


def create_dummy_image_bytes(width=600, height=800, color="blue") -> bytes:
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_optimize_image_to_webp():
    raw_png = create_dummy_image_bytes(1000, 1000, "red")
    webp_bytes = optimize_image_to_webp(raw_png, max_dimension=800, quality=80)

    assert webp_bytes is not None
    assert len(webp_bytes) > 0

    with Image.open(io.BytesIO(webp_bytes)) as result_img:
        assert result_img.format == "WEBP"
        assert max(result_img.size) <= 800


def test_generate_thumbnail():
    raw_png = create_dummy_image_bytes(800, 600, "green")
    thumb_bytes = generate_thumbnail(raw_png, size=(200, 200), quality=75)

    with Image.open(io.BytesIO(thumb_bytes)) as result_img:
        assert result_img.format == "WEBP"
        assert result_img.size == (200, 200)


def test_crop_portrait_center():
    raw_png = create_dummy_image_bytes(1000, 1000, "purple")
    portrait_bytes = crop_portrait_center(raw_png, aspect_ratio=4.0 / 5.0, target_width=400)

    with Image.open(io.BytesIO(portrait_bytes)) as result_img:
        assert result_img.format == "WEBP"
        assert result_img.size == (400, 500)
