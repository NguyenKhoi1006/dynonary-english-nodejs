from typing import Dict, Any, List, Optional
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc
from app.features.gamification.constants import SKILL_TREE_VERSION, SKILL_UNITS, XP_PER_LESSON_COMPLETE

SKILL_TREE_COL = "skill_tree_progress"
USERS_COL = "users"
LESSONS_PER_NODE = 4


async def get_skill_tree(uid: str) -> Dict[str, Any]:
    db = get_firestore_db()

    # Get user's progress
    doc = db.collection(SKILL_TREE_COL).document(uid).get()
    user_progress = doc.to_dict() if doc.exists else {}
    nodes_progress = user_progress.get("nodes", {})

    # Build full tree with status calculation
    nodes_out = []
    for unit in SKILL_UNITS:
        unit_id = unit["id"]
        dep_ids = unit.get("dependencies", [])
        prog = nodes_progress.get(unit_id, {})

        # Determine status
        status = _calc_status(unit_id, dep_ids, nodes_progress)

        lessons_completed = prog.get("lessonsCompleted", 0) if isinstance(prog, dict) else 0
        total_lessons = prog.get("totalLessons", LESSONS_PER_NODE) if isinstance(prog, dict) else LESSONS_PER_NODE
        progress_pct = min(100, int((lessons_completed / total_lessons) * 100)) if total_lessons > 0 else 0

        if status == "completed":
            progress_pct = 100
            lessons_completed = total_lessons

        nodes_out.append({
            "id": unit_id,
            "title": unit["title"],
            "description": unit["description"],
            "position": unit["position"],
            "dependencies": dep_ids,
            "status": status,
            "progress": progress_pct,
            "totalLessons": total_lessons,
            "lessonsCompleted": lessons_completed,
        })

    nodes_out.sort(key=lambda n: (n["position"]["row"], n["position"]["col"]))

    return {
        "version": SKILL_TREE_VERSION,
        "nodes": nodes_out,
    }


def _calc_status(unit_id: str, dependencies: List[str], progress: Dict) -> str:
    """Calculate node status based on dependency completion."""
    prog = progress.get(unit_id, {})
    if isinstance(prog, dict):
        if prog.get("status") == "completed":
            return "completed"
        if prog.get("lessonsCompleted", 0) and prog.get("lessonsCompleted", 0) > 0:
            return "in_progress"

    # Check dependencies
    for dep_id in dependencies:
        dep_prog = progress.get(dep_id, {})
        if isinstance(dep_prog, dict):
            if dep_prog.get("status") != "completed":
                return "locked"
        else:
            return "locked"

    if not dependencies:
        # Root nodes (no deps) are available if not started
        return "available"

    return "available"


async def complete_skill_lesson(uid: str, node_id: str) -> Dict[str, Any]:
    db = get_firestore_db()

    # Get current progress
    doc = db.collection(SKILL_TREE_COL).document(uid).get()
    data = doc.to_dict() if doc.exists else {}
    nodes = data.get("nodes", {})

    node_prog = nodes.get(node_id, {"lessonsCompleted": 0, "totalLessons": LESSONS_PER_NODE})
    if isinstance(node_prog, dict):
        lessons_completed = node_prog.get("lessonsCompleted", 0) + 1
        total_lessons = node_prog.get("totalLessons", LESSONS_PER_NODE)
    else:
        lessons_completed = 1
        total_lessons = LESSONS_PER_NODE

    xp_earned = XP_PER_LESSON_COMPLETE
    status = "in_progress"

    if lessons_completed >= total_lessons:
        lessons_completed = total_lessons
        status = "completed"
        xp_earned += 50  # completion bonus

    nodes[node_id] = {
        "status": status,
        "lessonsCompleted": lessons_completed,
        "totalLessons": total_lessons,
        "startedAt": SERVER_TIMESTAMP,
        "completedAt": SERVER_TIMESTAMP if status == "completed" else None,
    }

    # Save progress
    db.collection(SKILL_TREE_COL).document(uid).set({
        "nodes": nodes,
        "updatedAt": SERVER_TIMESTAMP,
    }, merge=True)

    # Award XP to user
    user_doc = db.collection(USERS_COL).document(uid).get()
    if user_doc.exists:
        curr_xp = user_doc.to_dict().get("xp", 0)
        db.collection(USERS_COL).document(uid).update({
            "xp": curr_xp + xp_earned,
        })

    progress_pct = int((lessons_completed / total_lessons) * 100)

    return {
        "nodeId": node_id,
        "status": status,
        "progress": progress_pct,
        "xpEarned": xp_earned,
    }


async def get_available_nodes(uid: str) -> Dict[str, Any]:
    """Return IDs of nodes whose dependencies are met and status is available."""
    tree = await get_skill_tree(uid)
    available = [
        n["id"] for n in tree["nodes"]
        if n["status"] == "available"
    ]
    return {"nodeIds": available}
