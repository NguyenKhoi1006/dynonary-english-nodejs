"""Check what's available in the project."""
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request

# Load credentials
from app.config import settings

SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]
sa_creds = service_account.Credentials.from_service_account_file(
    settings.firebase_credentials_path, scopes=SCOPES
)
sa_creds.refresh(Request())
token = sa_creds.token

project_id = "dynoapp-7c57c"
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# List all Google Cloud services
print("=== Enabled Services ===")
r = requests.get(
    f"https://serviceusage.googleapis.com/v1/projects/{project_id}/services?filter=state:ENABLED",
    headers=headers,
)
data = r.json()
if "services" in data:
    for svc in data["services"]:
        name = svc["config"]["name"]
        print(f"  {name}")
else:
    print(f"  Error: {data.get('error', {}).get('message', r.text[:200])}")

# List Firestore databases
print("\n=== Firestore Databases ===")
r2 = requests.get(
    f"https://firestore.googleapis.com/v1/projects/{project_id}/databases",
    headers=headers,
)
print(f"  {r2.status_code}: {r2.text[:300]}")

# Try Datastore
print("\n=== Datastore ===")
r3 = requests.post(
    f"https://datastore.googleapis.com/v1/projects/{project_id}:lookup",
    headers=headers,
    json={"keys": [{"partitionId": {"projectId": project_id}}]},
)
print(f"  {r3.status_code}: {r3.text[:200]}")
