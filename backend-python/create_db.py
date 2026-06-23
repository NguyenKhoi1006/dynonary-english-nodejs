"""Force-create Firestore database in project dynoapp-7c57c."""
import requests
import json
import firebase_admin
from firebase_admin import credentials
from google.auth.transport.requests import Request
from google.oauth2 import service_account
from app.config import settings

# Load service account
cred = credentials.Certificate(settings.firebase_credentials_path)

# Get access token
SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]
sa_creds = service_account.Credentials.from_service_account_file(
    settings.firebase_credentials_path, scopes=SCOPES
)
auth_req = Request()
sa_creds.refresh(auth_req)
token = sa_creds.token

project_id = "dynoapp-7c57c"

# 1. Check if Firestore API is enabled
print("Checking services...")
svc_url = f"https://serviceusage.googleapis.com/v1/projects/{project_id}/services/firestore.googleapis.com"
r = requests.get(svc_url, headers={"Authorization": f"Bearer {token}"})
print(f"Firestore API state: {r.json().get('state', r.text)}")

# 2. Enable Firestore API if not enabled
if r.json().get("state") != "ENABLED":
    print("Enabling Firestore API...")
    enable_url = f"https://serviceusage.googleapis.com/v1/projects/{project_id}/services/firestore.googleapis.com:enable"
    r2 = requests.post(enable_url, headers={"Authorization": f"Bearer {token}"})
    print(f"Enable response: {r2.status_code} - {r2.text}")

# 3. Try to create the default database
print("\nCreating Firestore database...")
create_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases"
body = {
    "name": f"projects/{project_id}/databases/(default)",
    "locationId": "asia-southeast1",
    "type": "FIRESTORE_NATIVE",
}
r3 = requests.post(create_url, headers={
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json",
}, json=body)
print(f"Create DB response: {r3.status_code} - {r3.text}")
