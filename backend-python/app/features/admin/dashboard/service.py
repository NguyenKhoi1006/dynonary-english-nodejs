from typing import Dict, Any
from app.firebase import get_firestore_db

USERS_COL = "users"
MATERIALS_COL = "learning_materials"
TESTS_COL = "tests"
ADMIN_LOGS_COL = "admin_logs"


async def get_stats() -> Dict[str, Any]:
    """Get dashboard statistics by counting documents."""
    db = get_firestore_db()

    # Count via stream (Firestore Spark plan limitation — no count() aggregation)
    users_all = list(db.collection(USERS_COL).stream())
    total_users = len(users_all)

    # Count by role
    admin_count = 0
    learner_count = 0
    premium_count = 0
    banned_count = 0

    for doc in users_all:
        data = doc.to_dict()
        role = data.get("role", "learner")
        if role == "admin":
            admin_count += 1
        else:
            learner_count += 1
        if data.get("membership") == "premium":
            premium_count += 1
        if data.get("status") == "banned":
            banned_count += 1

    # Count materials
    try:
        materials_all = list(db.collection(MATERIALS_COL).stream())
        total_materials = len(materials_all)
    except Exception:
        total_materials = 0

    # Count tests
    try:
        tests_all = list(db.collection(TESTS_COL).stream())
        total_tests = len(tests_all)
    except Exception:
        total_tests = 0

    # Count admin logs
    try:
        logs_all = list(db.collection(ADMIN_LOGS_COL).stream())
        total_logs = len(logs_all)
    except Exception:
        total_logs = 0

    return {
        "totalUsers": total_users,
        "adminCount": admin_count,
        "learnerCount": learner_count,
        "premiumCount": premium_count,
        "bannedCount": banned_count,
        "totalMaterials": total_materials,
        "totalTests": total_tests,
        "totalLogs": total_logs,
    }
