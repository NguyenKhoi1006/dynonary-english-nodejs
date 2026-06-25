"""Seed a test admin user into Firestore.
Usage: python seed_admin.py <email> <password> [name]
"""
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)
sys.path.insert(0, os.path.dirname(script_dir))

import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.config import settings

if len(sys.argv) < 3:
    print("Usage: python seed_admin.py <email> <password> [name]")
    sys.exit(1)

email = sys.argv[1]
password = sys.argv[2]
name = sys.argv[3] if len(sys.argv) > 3 else "Admin"

cert_path = os.path.join(script_dir, settings.firebase_credentials_path)
cred = credentials.Certificate(cert_path)
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
print("Done. Login via the regular login page — role-based redirect will take you to /admin")
