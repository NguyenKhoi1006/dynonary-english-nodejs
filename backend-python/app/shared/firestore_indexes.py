"""Firestore composite index definitions for LMS module queries.

These indexes MUST be created in Firebase Console or via gcloud CLI.
Without them, queries combining where() and order_by() on different fields will fail.

Deploy via:
  gcloud firestore indexes composite create --collection-group=<collection> --project=<project-id> \\
    --field-config field-path=<field1>,order=ASCENDING \\
    --field-config field-path=<field2>,order=DESCENDING

Or manually create in Firebase Console > Firestore > Indexes.
"""

# ─── tutors collection ────────────────────────────────────────
#
# Query: list_tutors(subject, level, isAvailable=True, order_by rating DESC)
TUTORS_BY_SUBJECT_RATING = {
    "collection": "tutors",
    "fields": [
        {"fieldPath": "isAvailable", "order": "ASCENDING"},
        {"fieldPath": "subjects", "arrayConfig": "CONTAINS"},
        {"fieldPath": "level", "order": "ASCENDING"},
        {"fieldPath": "rating", "order": "DESCENDING"},
    ],
}

# Query: list_tutors(level, isAvailable=True, order_by rating DESC)
TUTORS_BY_LEVEL_RATING = {
    "collection": "tutors",
    "fields": [
        {"fieldPath": "isAvailable", "order": "ASCENDING"},
        {"fieldPath": "level", "order": "ASCENDING"},
        {"fieldPath": "rating", "order": "DESCENDING"},
    ],
}

# Query: list_tutors(isAvailable=True, order_by rating DESC)
TUTORS_BY_AVAILABLE_RATING = {
    "collection": "tutors",
    "fields": [
        {"fieldPath": "isAvailable", "order": "ASCENDING"},
        {"fieldPath": "rating", "order": "DESCENDING"},
    ],
}

# ─── courses collection ───────────────────────────────────────
#
# Query: list_courses(isPublished=True, subject, level, order_by createdDate DESC)
COURSES_BY_SUBJECT_DATE = {
    "collection": "courses",
    "fields": [
        {"fieldPath": "isPublished", "order": "ASCENDING"},
        {"fieldPath": "subject", "order": "ASCENDING"},
        {"fieldPath": "level", "order": "ASCENDING"},
        {"fieldPath": "createdDate", "order": "DESCENDING"},
    ],
}

# Query: list_courses(tutorId, isPublished=any, order_by createdDate DESC)
COURSES_BY_TUTOR_DATE = {
    "collection": "courses",
    "fields": [
        {"fieldPath": "tutorId", "order": "ASCENDING"},
        {"fieldPath": "createdDate", "order": "DESCENDING"},
    ],
}

# ─── bookings collection ──────────────────────────────────────
#
# Query: get_bookings_for_student(studentId, status, order_by date DESC)
BOOKINGS_BY_STUDENT_DATE = {
    "collection": "bookings",
    "fields": [
        {"fieldPath": "studentId", "order": "ASCENDING"},
        {"fieldPath": "date", "order": "DESCENDING"},
    ],
}

# Query: get_bookings_for_tutor(tutorId, status, order_by date DESC)
BOOKINGS_BY_TUTOR_DATE = {
    "collection": "bookings",
    "fields": [
        {"fieldPath": "tutorId", "order": "ASCENDING"},
        {"fieldPath": "date", "order": "DESCENDING"},
    ],
}

# ─── sessions collection ──────────────────────────────────────
#
# Query: get_sessions_for_user(userId, order_by date DESC)
SESSIONS_BY_USER_DATE = {
    "collection": "sessions",
    "fields": [
        {"fieldPath": "studentId", "order": "ASCENDING"},
        {"fieldPath": "date", "order": "DESCENDING"},
    ],
}

SESSIONS_BY_TUTOR_DATE = {
    "collection": "sessions",
    "fields": [
        {"fieldPath": "tutorId", "order": "ASCENDING"},
        {"fieldPath": "date", "order": "DESCENDING"},
    ],
}

# ─── messages collection ──────────────────────────────────────
#
# Query: get_conversations(userId, order_by createdDate DESC)
MESSAGES_BY_USER_DATE = {
    "collection": "messages",
    "fields": [
        {"fieldPath": "senderId", "order": "ASCENDING"},
        {"fieldPath": "createdDate", "order": "DESCENDING"},
    ],
}

# Export all index configs for reference
ALL_INDEXES = [
    TUTORS_BY_SUBJECT_RATING,
    TUTORS_BY_LEVEL_RATING,
    TUTORS_BY_AVAILABLE_RATING,
    COURSES_BY_SUBJECT_DATE,
    COURSES_BY_TUTOR_DATE,
    BOOKINGS_BY_STUDENT_DATE,
    BOOKINGS_BY_TUTOR_DATE,
    SESSIONS_BY_USER_DATE,
    SESSIONS_BY_TUTOR_DATE,
    MESSAGES_BY_USER_DATE,
]
