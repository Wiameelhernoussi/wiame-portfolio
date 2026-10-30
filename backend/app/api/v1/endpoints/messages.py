from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request, BackgroundTasks
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_admin_user, get_client_ip
from app.core.config import settings
from app.core.rate_limit import check_rate_limit
from app.models.message import ContactMessage
from app.models.user import AdminUser
from app.schemas.message import ContactMessageCreate, ContactMessageResponse
from app.services.email import send_contact_notification_email

router = APIRouter()


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def submit_contact_message(
    payload: ContactMessageCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Submit a contact message from the portfolio.
    Protected by honeypot anti-spam and multi-worker IP rate limiting.
    Dispatches asynchronous email notification in background.
    """
    client_ip = get_client_ip(request)

    # 1. Anti-spam honeypot verification
    # If the hidden honeypot field is filled by a bot, fake success without saving
    if payload.honeypot and payload.honeypot.strip():
        return {
            "success": True,
            "message": "Thank you for reaching out! Your message has been received."
        }

    # 2. Rate limiting (max 5 submissions per hour per IP)
    rate_limit_key = f"contact:{client_ip}"
    check_rate_limit(
        db=db,
        key=rate_limit_key,
        max_attempts=settings.RATE_LIMIT_CONTACT_MAX_ATTEMPTS,
        window_seconds=settings.RATE_LIMIT_CONTACT_WINDOW_SECONDS,
        error_message="You have sent several messages recently. Please wait a while before sending another."
    )

    # 3. Save message to database
    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email.strip(),
        subject=(payload.subject or "Portfolio Inquiry").strip(),
        message=payload.message.strip(),
        sender_ip=client_ip,
        is_read=False
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # 4. Dispatch email notification in background task
    background_tasks.add_task(
        send_contact_notification_email,
        name=msg.name,
        sender_email=msg.email,
        subject=msg.subject,
        message=msg.message
    )

    return {
        "success": True,
        "message": "Thank you for reaching out! Your message has been received."
    }


@router.get("/admin/all", response_model=List[ContactMessageResponse])
def get_messages_admin(
    unread_only: Optional[bool] = False,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    query = db.query(ContactMessage)
    if unread_only:
        query = query.filter(ContactMessage.is_read == False)
    return query.order_by(ContactMessage.created_at.desc()).all()


@router.put("/admin/{msg_id}/read", response_model=ContactMessageResponse)
def mark_message_as_read(
    msg_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/admin/{msg_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    msg_id: int,
    current_user: AdminUser = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
):
    msg = db.query(ContactMessage).filter(ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    db.delete(msg)
    db.commit()
    return None
