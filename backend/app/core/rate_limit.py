from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.rate_limit import RateLimitEntry


def check_rate_limit(
    db: Session,
    key: str,
    max_attempts: int,
    window_seconds: int,
    error_message: str = "Too many requests. Please try again later."
):
    """
    Database-backed rate limiter that works seamlessly across multiple workers/processes.
    Prunes expired entries and checks rolling window count.
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(seconds=window_seconds)

    # 1. Clean up stale entries older than 2 hours to keep the table compact
    stale_cutoff = now - timedelta(hours=2)
    db.query(RateLimitEntry).filter(RateLimitEntry.timestamp < stale_cutoff).delete(synchronize_session=False)

    # 2. Count attempts within current rolling window
    current_attempts = (
        db.query(RateLimitEntry)
        .filter(RateLimitEntry.key == key, RateLimitEntry.timestamp >= cutoff)
        .count()
    )

    if current_attempts >= max_attempts:
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=error_message,
            headers={"Retry-After": str(window_seconds)},
        )

    # 3. Record this new attempt
    new_entry = RateLimitEntry(key=key, timestamp=now)
    db.add(new_entry)
    db.commit()
