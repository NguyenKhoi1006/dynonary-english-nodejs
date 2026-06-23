"""Utility to convert Firestore documents to JSON-safe dictionaries."""

from typing import Any, Dict, List
from datetime import datetime


def serialize_doc(doc_data: Dict[str, Any]) -> Dict[str, Any]:
    """Recursively convert Firestore document to JSON-safe dict.
    Handles Timestamps, NaN, Infinity, and other non-serializable types.
    """
    result = {}
    for key, value in doc_data.items():
        result[key] = _serialize_value(value)
    return result


def serialize_docs(docs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Serialize a list of Firestore documents."""
    return [serialize_doc(doc) for doc in docs]


def _serialize_value(value: Any) -> Any:
    """Recursively serialize a single value."""
    if value is None:
        return None

    # Handle Firestore Timestamp (google.cloud.firestore_v1.types.Timestamp)
    # It has seconds and nanoseconds attributes
    if hasattr(value, "seconds") and hasattr(value, "nanoseconds"):
        ts = datetime.fromtimestamp(value.seconds + value.nanoseconds / 1e9)
        return ts.isoformat()

    # Handle datetime objects
    if isinstance(value, datetime):
        return value.isoformat()

    # Handle dicts
    if isinstance(value, dict):
        return {k: _serialize_value(v) for k, v in value.items()}

    # Handle lists
    if isinstance(value, (list, tuple)):
        return [_serialize_value(item) for item in value]

    return value
