from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Firebase
    firebase_credentials_path: str = "serviceAccountKey.json"
    firebase_database_url: str = ""

    # Firebase Web API Key (for REST API calls — signInWithPassword, etc.)
    firebase_web_api_key: str = ""

    # Cloudinary
    cloudinary_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:8888"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
