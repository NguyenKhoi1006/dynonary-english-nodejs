"""Simple runner script - chạy từ thư mục backend-python/"""
import sys
import os

# Ensure the backend-python directory is in the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
