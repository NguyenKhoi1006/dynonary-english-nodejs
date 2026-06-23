from typing import Optional, Dict, Any, List, Tuple
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

TESTS_COL = "tests"


async def list_tests(
    level: str = "",
    type_filter: str = "",
    page: int = 1,
    pageSize: int = 20,
) -> Tuple[List[Dict[str, Any]], int]:
    db = get_firestore_db()
    all_docs = list(db.collection(TESTS_COL).stream())

    tests = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id

        # Only return published tests for learners
        if not data.get("published"):
            continue
        if level and data.get("level") != level:
            continue
        if type_filter and data.get("type") != type_filter:
            continue

        # Strip correctAnswer from questions for learner view
        for q in data.get("questions", []):
            q.pop("correctAnswer", None)

        tests.append(data)

    total = len(tests)
    start = (page - 1) * pageSize
    end = start + pageSize
    return tests[start:end], total
