import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


def send_contact_notification_email(name: str, sender_email: str, subject: str, message: str) -> bool:
    """
    Sends an email notification to the site owner when a new contact message is received.
    If SMTP is not configured, logs the message and returns gracefully without crashing.
    """
    recipient = settings.NOTIFICATION_EMAIL or settings.FIRST_SUPERUSER_EMAIL
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        print(f"[Email Notification Skipped] SMTP not configured. Message from {name} ({sender_email}): {subject}")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Portfolio Contact] {subject} - from {name}"
        msg["From"] = settings.EMAILS_FROM_EMAIL or settings.SMTP_USER
        msg["To"] = recipient

        text_content = f"""New contact message received on your portfolio website:

Name: {name}
Email: {sender_email}
Subject: {subject}

Message:
{message}
"""
        html_content = f"""<html>
  <body style="font-family: sans-serif; color: #16193A; line-height: 1.6;">
    <h2 style="color: #2B3FA3;">New Contact Message from Portfolio</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> <a href="mailto:{sender_email}">{sender_email}</a></p>
    <p><strong>Subject:</strong> {subject}</p>
    <hr style="border: 0; border-top: 1px solid #DADDEB; margin: 20px 0;" />
    <p><strong>Message:</strong></p>
    <div style="background: #F5F6FB; padding: 16px; border-radius: 8px; white-space: pre-wrap;">{message}</div>
  </body>
</html>"""

        msg.attach(MIMEText(text_content, "plain"))
        msg.attach(MIMEText(html_content, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(msg["From"], [recipient], msg.as_string())

        return True
    except Exception as e:
        print(f"[Email Notification Error] Failed to dispatch SMTP email: {e}")
        return False
