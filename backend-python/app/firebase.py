import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
from app.config import settings

_firebase_app = None
_firestore_db = None


def get_firebase_app():
    global _firebase_app
    if _firebase_app is None:
        cred = credentials.Certificate(settings.firebase_credentials_path)
        _firebase_app = firebase_admin.initialize_app(cred, {
            "storageBucket": "dynoapp-7c57c.appspot.com",
        })
    return _firebase_app


def get_firestore_db():
    global _firestore_db
    if _firestore_db is None:
        get_firebase_app()
        _firestore_db = firestore.client(database_id="dynodata")
    return _firestore_db


def get_firebase_auth():
    get_firebase_app()
    return auth


def get_firebase_storage():
    get_firebase_app()
    return storage
