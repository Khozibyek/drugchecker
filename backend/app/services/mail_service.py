import os
import smtplib
from pathlib import Path
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
MAIL_FROM = os.getenv("MAIL_FROM", SMTP_USER)

print("ENV PATH:", env_path)
print("SMTP_USER:", SMTP_USER)
print("SMTP_PASS:", SMTP_PASS)

def send_reset_code_email(to_email: str, code: str):
    if not SMTP_USER or not SMTP_PASS:
        raise ValueError("SMTP_USER эсвэл SMTP_PASS .env файлаас уншигдсангүй")

    msg = MIMEMultipart()
    msg["Subject"] = "Нууц үг сэргээх код"
    msg["From"] = MAIL_FROM
    msg["To"] = to_email

    body = f"""
Сайн байна уу?

Таны нууц үг сэргээх код: {code}

Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ имэйлийг үл тооно уу.
"""

    msg.attach(MIMEText(body, "plain", "utf-8"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(MAIL_FROM, to_email, msg.as_string())