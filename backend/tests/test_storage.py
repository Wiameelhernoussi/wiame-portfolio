import os
import pytest
from app.services.storage import LocalStorageService, CloudinaryStorageService, get_storage_service


def test_local_storage_upload_and_delete(tmp_path):
    storage = LocalStorageService(base_dir=str(tmp_path))
    dummy_bytes = b"Sample image data for testing"
    filename = "test_image.png"

    result = storage.upload_file(
        file_bytes=dummy_bytes,
        filename=filename,
        content_type="image/png",
        folder="test_folder"
    )

    assert result["provider"] == "local"
    assert "test_folder" in result["url"]
    assert os.path.exists(result["path"])

    with open(result["path"], "rb") as f:
        assert f.read() == dummy_bytes

    # Test deletion
    deleted = storage.delete_file(result["url"])
    assert deleted is True
    assert not os.path.exists(result["path"])


def test_cloudinary_service_initialization():
    # Cloudinary adapter should instantiate cleanly without raising errors
    service = CloudinaryStorageService()
    assert hasattr(service, "upload_file")
    assert hasattr(service, "delete_file")
