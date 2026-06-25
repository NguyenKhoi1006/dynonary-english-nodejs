"""Migrate existing Firestore 'learner' roles to 'student'.
Usage: python seed_migrate_roles.py
"""
import os
import sys

# Ensure script dir is on path and resolve serviceAccountKey.json
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)
sys.path.insert(0, os.path.dirname(script_dir))

import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings

cert_path = os.path.join(script_dir, settings.firebase_credentials_path)
cred = credentials.Certificate(cert_path)
firebase_admin.initialize_app(cred)
db = firestore.client(database_id="dynodata")

users_ref = db.collection("users")
docs = users_ref.where("role", "==", "learner").stream()

count = 0
for doc in docs:
    doc_ref = users_ref.document(doc.id)
    doc_ref.update({"role": "student"})
    count += 1
    if count % 10 == 0:
        print(f"  Migrated {count}...")

print(f"Done. Updated {count} user(s) from 'learner' → 'student'.")
