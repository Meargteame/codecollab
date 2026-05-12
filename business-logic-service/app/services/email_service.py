"""Email service — sends emails via SMTP"""

import smtplib
import structlog
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.config import get_settings

logger = structlog.get_logger()


class EmailService:
    """Sends emails using the configured SMTP server."""

    def __init__(self) -> None:
        self._settings = get_settings()

    def send(self, *, to: str, subject: str, body: str) -> None:
        """Send a plain-text email.

        Args:
            to: Recipient email address.
            subject: Email subject line.
            body: Plain-text email body.

        Raises:
            RuntimeError: If SMTP credentials are not configured.
            smtplib.SMTPException: On delivery failure.
        """
        s = self._settings
        if not s.smtp_user or not s.smtp_password:
            raise RuntimeError("SMTP credentials are not configured.")

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = s.smtp_from
        msg["To"] = to
        msg.attach(MIMEText(body, "plain"))

        if s.smtp_port == 465:
            # SSL connection
            with smtplib.SMTP_SSL(s.smtp_host, s.smtp_port) as server:
                server.login(s.smtp_user, s.smtp_password)
                server.sendmail(s.smtp_from, to, msg.as_string())
        else:
            # STARTTLS connection (port 587)
            with smtplib.SMTP(s.smtp_host, s.smtp_port) as server:
                server.ehlo()
                server.starttls()
                server.login(s.smtp_user, s.smtp_password)
                server.sendmail(s.smtp_from, to, msg.as_string())

        logger.info("email_sent", to=to, subject=subject)
