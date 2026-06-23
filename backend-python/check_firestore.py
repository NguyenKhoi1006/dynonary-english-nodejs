"""Check Firestore connection and project setup."""
import os, json, sys
from app.config import settings

# 1. Check credentials file
path = settings.firebase_credentials_path
print(f"Credentials path: {path}")
print(f"File exists: {os.path.exists(path)}")

if os.path.exists(path):
    with open(path) as f:
        data = json.load(f)
    print(f"Project ID in key: {data.get('project_id')}")
    print(f"Client email: {data.get('client_email')}")

print(f"Configured project: dynoapp-7c57c")

# 2. Try to init Firebase and list collections
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(path)
firebase_admin.initialize_app(cred)
db = firestore.client(database_id="dynodata")

# Try to list any collection
try:
    collections = list(db.collections())
    print(f"Collections found: {[c.id for c in collections]}")
except Exception as e:
    print(f"Error listing collections: {e}")

# Try to set a test doc
try:
    doc_ref = db.collection("_test_connection").document("_check")
    doc_ref.set({"ok": True, "timestamp": firestore.SERVER_TIMESTAMP})
    print("Write test OK")
    # Clean up
    doc_ref.delete()
    print("Cleanup OK")
except Exception as e:
    print(f"Error writing: {e}")

print("Done")
