from typing import Optional, Dict, Any, List, Tuple
from google.cloud.firestore import SERVER_TIMESTAMP
from app.firebase import get_firestore_db
from app.shared.firestore_helpers import serialize_doc

PLACEMENT_COL = "placement_tests"
TESTS_COL = "tests"
ATTEMPTS_COL = "user_placement_attempts"
USERS_COL = "users"

LEVEL_ORDER = {"A1": 1, "A2": 2, "B1": 3, "B2": 4, "C1": 5, "C2": 6}
LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]
SECTIONS = ["grammar", "vocabulary", "reading", "listening"]

# Cambridge CEFR overall score → level mapping
# Based on standard Cambridge placement test score bands
CEFR_SCORE_BANDS = [
    (0, 15, "A1"),
    (16, 30, "A2"),
    (31, 50, "B1"),
    (51, 70, "B2"),
    (71, 88, "C1"),
    (89, 100, "C2"),
]

# Cambridge "Can Do" descriptors for each CEFR level
CEFR_DESCRIPTORS = {
    "A1": (
        "You can understand and use familiar everyday expressions and very basic phrases. "
        "You can introduce yourself and others, and can ask and answer simple questions "
        "about personal details such as where you live, people you know, and things you have."
    ),
    "A2": (
        "You can understand sentences and frequently used expressions related to areas of "
        "most immediate relevance (e.g. basic personal and family information, shopping, "
        "local geography, employment). You can communicate in simple routine tasks."
    ),
    "B1": (
        "You can understand the main points of clear standard input on familiar matters "
        "regularly encountered in work, school, leisure, etc. You can deal with most "
        "situations likely to arise while travelling. You can produce simple connected text "
        "on topics that are familiar or of personal interest."
    ),
    "B2": (
        "You can understand the main ideas of complex text on both concrete and abstract "
        "topics. You can interact with a degree of fluency and spontaneity that makes "
        "regular interaction with native speakers quite possible. You can produce clear, "
        "detailed text on a wide range of subjects."
    ),
    "C1": (
        "You can understand a wide range of demanding, longer texts, and recognise implicit "
        "meaning. You can express ideas fluently and spontaneously without much obvious "
        "searching for expressions. You can use language flexibly and effectively for "
        "social, academic, and professional purposes."
    ),
    "C2": (
        "You can understand with ease virtually everything heard or read. You can summarise "
        "information from different spoken and written sources, reconstructing arguments and "
        "accounts in a coherent presentation. You can express yourself spontaneously, very "
        "fluently and precisely, differentiating finer shades of meaning."
    ),
}

# Vietnamese translations of CEFR descriptors for learner display
CEFR_DESCRIPTORS_VI = {
    "A1": (
        "Bạn có thể hiểu và sử dụng các biểu đạt quen thuộc hàng ngày và các cụm từ cơ bản. "
        "Bạn có thể tự giới thiệu và giới thiệu người khác, hỏi và trả lời các câu hỏi đơn giản "
        "về thông tin cá nhân như nơi ở, người quen và đồ đạc."
    ),
    "A2": (
        "Bạn có thể hiểu câu và các biểu đạt thường dùng liên quan đến các lĩnh vực gần gũi "
        "(thông tin gia đình, mua sắm, địa lý địa phương, việc làm). Bạn có thể giao tiếp "
        "trong các nhiệm vụ đơn giản hàng ngày."
    ),
    "B1": (
        "Bạn có thể hiểu ý chính của văn bản rõ ràng về các chủ đề quen thuộc trong công việc, "
        "học tập, giải trí. Bạn có thể xử lý hầu hết các tình huống có thể xảy ra khi đi du lịch. "
        "Bạn có thể viết văn bản đơn giản về các chủ đề quen thuộc."
    ),
    "B2": (
        "Bạn có thể hiểu ý chính của văn bản phức tạp về cả chủ đề cụ thể và trừu tượng. "
        "Bạn có thể tương tác với người bản ngữ một cách trôi chảy và tự nhiên. "
        "Bạn có thể viết văn bản chi tiết, rõ ràng về nhiều chủ đề."
    ),
    "C1": (
        "Bạn có thể hiểu nhiều loại văn bản dài, khó và nhận biết ý nghĩa tiềm ẩn. "
        "Bạn có thể diễn đạt ý tưởng trôi chảy và tự nhiên. Bạn có thể sử dụng ngôn ngữ "
        "linh hoạt và hiệu quả cho mục đích xã hội, học thuật và chuyên nghiệp."
    ),
    "C2": (
        "Bạn có thể hiểu hầu hết mọi thứ đã đọc hoặc nghe một cách dễ dàng. "
        "Bạn có thể tóm tắt thông tin từ nhiều nguồn khác nhau, tái tạo lập luận và trình bày "
        "một cách mạch lạc. Bạn có thể diễn đạt tự nhiên, rất trôi chảy và chính xác."
    ),
}


def _score_to_cefr_band(percentage: float) -> str:
    """Map overall percentage to CEFR level using Cambridge-aligned score bands."""
    for low, high, level in CEFR_SCORE_BANDS:
        if low <= percentage <= high:
            return level
    return "A1"


def _determine_level(
    per_level: Dict[str, Dict[str, int]],
    percentage: float,
    section_breakdown: Dict[str, Dict[str, Any]],
) -> str:
    """
    Determine CEFR level using a Cambridge-aligned approach:
    1. Primary: Find the highest level where user scores >= 70% on questions at that level.
    2. Secondary: Cross-check with overall Cambridge score band.
    3. Tertiary (section check): If reading/listening sections exist, weight them higher.
    
    Returns the most appropriate CEFR level.
    """
    # Primary: per-level accuracy
    per_level_level = "A1"
    for lvl in LEVELS:
        info = per_level[lvl]
        if info["total"] > 0 and (info["correct"] / info["total"]) >= 0.70:
            per_level_level = lvl

    # Secondary: overall score band
    band_level = _score_to_cefr_band(percentage)
    band_rank = LEVEL_ORDER.get(band_level, 1)
    per_level_rank = LEVEL_ORDER.get(per_level_level, 1)

    # Tertiary: check if reading/listening sections indicate higher ability
    has_reading = "reading" in section_breakdown and section_breakdown["reading"]["total"] > 0
    has_listening = "listening" in section_breakdown and section_breakdown["listening"]["total"] > 0
    
    reading_boost = 0
    if has_reading and section_breakdown["reading"]["percentage"] >= 75:
        reading_boost = 1
    if has_listening and section_breakdown["listening"]["percentage"] >= 75:
        reading_boost = max(reading_boost, 1)

    # Combine: take the higher of per-level and band, optionally boosted by reading/listening
    final_rank = max(per_level_rank, band_rank)
    if reading_boost > 0 and final_rank < 6:
        final_rank = min(final_rank + reading_boost, 6)

    # Validate: don't place higher than performance on questions at that level
    final_level = LEVELS[final_rank - 1]
    level_info = per_level.get(final_level, {"correct": 0, "total": 0})
    if level_info["total"] > 0 and (level_info["correct"] / level_info["total"]) < 0.40:
        # User performed poorly at the suggested level, step down
        for lvl in reversed(LEVELS):
            li = per_level.get(lvl, {"correct": 0, "total": 0})
            if li["total"] > 0 and (li["correct"] / li["total"]) >= 0.50:
                return lvl
        return "A1"

    return final_level


def _get_can_do(level: str, lang: str = "en") -> str:
    """Get Cambridge CEFR 'Can Do' descriptor for a level."""
    descriptors = CEFR_DESCRIPTORS if lang == "en" else CEFR_DESCRIPTORS_VI
    return descriptors.get(level, "")


def _get_section_scores(
    questions: List[Dict[str, Any]],
    answer_map: Dict[str, int],
) -> Tuple[Dict[str, Dict[str, Any]], Dict[str, Dict[str, int]]]:
    """Calculate per-section and per-level breakdowns."""
    per_level = {lvl: {"correct": 0, "total": 0} for lvl in LEVELS}
    per_section = {sec: {"correct": 0, "total": 0} for sec in SECTIONS}

    for q in questions:
        qid = q.get("id", "")
        selected = answer_map.get(qid, -1)
        is_correct = selected == q.get("correctAnswer", -1)

        q_level = q.get("level", "A1")
        if q_level in per_level:
            per_level[q_level]["total"] += 1
            if is_correct:
                per_level[q_level]["correct"] += 1

        q_type = q.get("type", "grammar")
        if q_type in per_section:
            per_section[q_type]["total"] += 1
            if is_correct:
                per_section[q_type]["correct"] += 1

    return per_level, per_section


async def get_placement_test(type: str = "initial") -> Optional[Dict[str, Any]]:
    """Get the latest placement test. Checks placement_tests first, then falls back to tests collection."""
    db = get_firestore_db()

    # 1. Try placement_tests collection
    all_docs = list(db.collection(PLACEMENT_COL).where("type", "==", type).stream())
    if all_docs:
        doc = max(all_docs, key=lambda d: d.create_time or 0)
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        return data

    # 2. Fallback: admin-created tests (published, assessment/level_up/placement type)
    test_docs = list(db.collection(TESTS_COL).stream())
    matching = []
    for doc in test_docs:
        data = serialize_doc(doc.to_dict())
        if not data.get("published"):
            continue
        if data.get("type") not in ("assessment", "level_up", "placement"):
            continue
        data["id"] = doc.id
        ts = doc.create_time or 0
        if hasattr(ts, "timestamp"):
            ts = ts.timestamp()
        matching.append((data, ts))

    if matching:
        matching.sort(key=lambda x: x[1], reverse=True)
        return matching[0][0]

    return None


async def submit_placement(
    test_id: str, uid: str, answers: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Grade a placement test submission using Cambridge-aligned scoring.

    Scoring methodology:
    - Per-level accuracy: finds highest CEFR level where >=70% questions correct
    - Overall score band: maps total percentage to Cambridge score bands
    - Section breakdown: evaluates grammar, vocabulary, reading, listening separately
    - Final level combines all signals with Cambridge 'Can Do' descriptors
    """
    db = get_firestore_db()

    # Try placement_tests first, then admin tests
    test_doc = db.collection(PLACEMENT_COL).document(test_id).get()
    if not test_doc.exists:
        test_doc = db.collection(TESTS_COL).document(test_id).get()

    if not test_doc.exists:
        return {"error": "Test not found"}

    test_data = test_doc.to_dict()
    questions = test_data.get("questions", [])

    # Build answer map
    answer_map = {a["questionId"]: a["selectedIndex"] for a in answers}

    # Calculate per-level and per-section breakdowns
    per_level, per_section = _get_section_scores(questions, answer_map)

    # Grade
    correct_count = per_level["A1"]["correct"] + per_level["A2"]["correct"] + per_level["B1"]["correct"] + per_level["B2"]["correct"] + per_level["C1"]["correct"] + per_level["C2"]["correct"]
    total = len(questions)
    percentage = round((correct_count / total) * 100, 1) if total > 0 else 0

    # Build section breakdown for response
    section_breakdown = {}
    for sec in SECTIONS:
        info = per_section[sec]
        sec_total = info["total"]
        if sec_total > 0:
            sec_pct = round((info["correct"] / sec_total) * 100, 1)
        else:
            sec_pct = 0.0
        section_breakdown[sec] = {
            "correct": info["correct"],
            "total": sec_total,
            "percentage": sec_pct,
        }

    # Determine CEFR level using Cambridge-aligned algorithm
    result_level = _determine_level(per_level, percentage, section_breakdown)
    can_do = _get_can_do(result_level, "en")
    can_do_vi = _get_can_do(result_level, "vi")

    # Pass threshold: Cambridge recommends 70% overall OR reaching at least A2
    passed = percentage >= 70.0 or LEVEL_ORDER.get(result_level, 0) >= 2

    # Build per-question details
    details = []
    for q in questions:
        qid = q.get("id", "")
        selected = answer_map.get(qid, -1)
        is_correct = selected == q.get("correctAnswer", -1)
        details.append({
            "questionId": qid,
            "selectedIndex": selected,
            "isCorrect": is_correct,
        })

    # Save attempt
    attempt_ref = db.collection(ATTEMPTS_COL).document()
    attempt_data = {
        "userId": uid,
        "testId": test_id,
        "type": test_data.get("type", "initial"),
        "score": correct_count,
        "totalQuestions": total,
        "percentage": percentage,
        "resultLevel": result_level,
        "passed": passed,
        "answers": details,
        "sectionBreakdown": section_breakdown,
        "canDo": can_do,
        "canDoVi": can_do_vi,
        "startedAt": SERVER_TIMESTAMP,
        "completedAt": SERVER_TIMESTAMP,
    }
    attempt_ref.set(attempt_data)

    # Update user level if passed and it's higher than current
    if passed:
        user_ref = db.collection(USERS_COL).document(uid)
        user_doc = user_ref.get()
        if user_doc.exists:
            current_level = user_doc.to_dict().get("level")
            current_rank = LEVEL_ORDER.get(current_level, 0) if current_level else 0
            new_rank = LEVEL_ORDER.get(result_level, 0)
            if new_rank > current_rank:
                user_ref.update({
                    "level": result_level,
                    "levelAssignedAt": SERVER_TIMESTAMP,
                })

    return {
        "score": correct_count,
        "totalQuestions": total,
        "percentage": percentage,
        "resultLevel": result_level,
        "passed": passed,
        "details": details,
        "sectionBreakdown": section_breakdown,
        "canDo": can_do,
        "canDoVi": can_do_vi,
        "attemptId": attempt_ref.id,
    }


async def get_attempt_history(uid: str) -> List[Dict[str, Any]]:
    db = get_firestore_db()
    all_docs = list(
        db.collection(ATTEMPTS_COL)
        .where("userId", "==", uid)
        .stream()
    )
    attempts = []
    for doc in all_docs:
        data = serialize_doc(doc.to_dict())
        data["id"] = doc.id
        attempts.append(data)

    attempts.sort(key=lambda a: a.get("completedAt", "") or "", reverse=True)
    return attempts
