import pytest
from fastapi import HTTPException
from app.core.rate_limit import check_rate_limit


def test_database_backed_rate_limiter(db_session):
    client_key = "test_ip_192.168.1.1"

    # Should allow up to 3 attempts within 60 seconds
    for _ in range(3):
        check_rate_limit(db=db_session, key=client_key, max_attempts=3, window_seconds=60)

    # 4th attempt must raise HTTPException with 429 status code
    with pytest.raises(HTTPException) as exc_info:
        check_rate_limit(db=db_session, key=client_key, max_attempts=3, window_seconds=60)

    assert exc_info.value.status_code == 429
    assert "Too many requests" in exc_info.value.detail
