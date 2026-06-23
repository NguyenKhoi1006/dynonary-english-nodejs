"""Seed a test admin user into Firestore.
Usage: python seed_admin.py <email> <password> [name]
"""
import sys
import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.config import settings

if len(sys.argv) < 3:
    print("Usage: python seed_admin.py <email> <password> [name]")
    sys.exit(1)

email = sys.argv[1]
password = sys.argv[2]
name = sys.argv[3] if len(sys.argv) > 3 else "Admin"

# Init Firebase Admin
cred = credentials.Certificate(settings.firebase_credentials_path)
firebase_admin.initialize_app(cred)
db = firestore.client(database_id="dynodata")

try:
    # Check if user exists
    existing = auth.get_user_by_email(email)
    uid = existing.uid
    print(f"User already exists: {uid}")
except firebase_admin.auth.UserNotFoundError:
    # Create user
    user = auth.create_user(email=email, password=password, display_name=name)
    uid = user.uid
    print(f"Created Firebase Auth user: {uid}")

# Set admin role in Firestore
profile = {
    "email": email,
    "name": name,
    "username": name.lower().replace(" ", "."),
    "avt": "",
    "coin": 0,
    "favoriteList": [],
    "provider": "password",
    "role": "admin",
    "membership": "premium",
    "level": None,
    "status": "active",
    "xp": 0,
}

db.collection("users").document(uid).set(profile, merge=True)
print(f"Firestore profile created/updated for {email} with role=admin")
print("Done. You can now login at /admin/login")
