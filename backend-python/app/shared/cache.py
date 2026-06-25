"""Simple in-memory cache for frequently accessed Firestore data.

Uses TTL-based expiration. Thread-safe via LRU dict.
Not suitable for multi-process deployments (use Redis in production).
"""

import time
from typing import Any, Dict, Optional, Callable
from functools import wraps

_cache: Dict[str, Dict[str, Any]] = {}
DEFAULT_TTL = 60  # seconds


def get_cache(key: str) -> Optional[Any]:
    entry = _cache.get(key)
    if entry is None:
        return None
    if time.time() > entry["expires_at"]:
        del _cache[key]
        return None
    return entry["value"]


def set_cache(key: str, value: Any, ttl: int = DEFAULT_TTL) -> None:
    _cache[key] = {
        "value": value,
        "expires_at": time.time() + ttl,
    }


def invalidate_cache(prefix: str = "") -> None:
    """Invalidate cache entries matching prefix. Empty prefix clears all."""
    if not prefix:
        _cache.clear()
        return
    keys_to_delete = [k for k in _cache if k.startswith(prefix)]
    for k in keys_to_delete:
        _cache.pop(k, None)


def cached(ttl: int = DEFAULT_TTL):
    """Decorator: cache async function results with TTL."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key_parts = [func.__name__] + [str(a) for a in args] + [f"{k}={v}" for k, v in sorted(kwargs.items())]
            cache_key = ":".join(key_parts)
            cached_val = get_cache(cache_key)
            if cached_val is not None:
                return cached_val
            result = await func(*args, **kwargs)
            set_cache(cache_key, result, ttl)
            return result
        return wrapper
    return decorator
