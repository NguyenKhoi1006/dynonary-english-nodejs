import re
import random
import string
from typing import Optional


def create_username(email: str, uid: str) -> str:
    """Create a username from email and Firebase UID."""
    prefix = email.split("@")[0]
    suffix = uid[:6]
    username = f"{prefix}-{suffix}".lower()
    # Remove special characters
    username = re.sub(r"[^a-z0-9-]", "", username)
    return username[:50]


def generate_verify_code(length: int = 6) -> str:
    """Generate a numeric verification code."""
    return "".join(random.choices(string.digits, k=length))


def normalize_email(email: str) -> str:
    """Normalize email to lowercase."""
    return email.strip().lower()


def sanitize_string(value: Optional[str]) -> str:
    """Sanitize a string, removing excessive whitespace."""
    if not value:
        return ""
    return " ".join(value.split())


def parse_list(value: str) -> list:
    """Parse comma-separated string to list."""
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]
