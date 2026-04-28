import os
import httpx

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
MAIL_FROM = os.getenv("MAIL_FROM", "onboarding@resend.dev")

def send_reset_code_email(to_email: str, code: str):
    if not RESEND_API_KEY:
        raise ValueError("RESEND_API_KEY байхгүй байна")

    response = httpx.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
        json={
            "from": MAIL_FROM,
            "to": [to_email],
            "subject": "Нууц үг сэргээх код",
            "text": f"Сайн байна уу?\n\nТаны нууц үг сэргээх код: {code}\n\nХэрэв та энэ хүсэлтийг илгээгээгүй бол үл тооно уу.",
        },
    )
    if response.status_code != 200:
        raise ValueError(f"Имэйл илгээхэд алдаа гарлаа: {response.text}")
