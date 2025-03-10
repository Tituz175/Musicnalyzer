import os

class Config:
    # General Configurations
    DEBUG = True  # Set to False in production
    SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
    
    # Database Configuration
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/music_db")
    
    # File Upload Configuration
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
    ALLOWED_EXTENSIONS = {"mp3", "wav", "flac"}  # Allowed file types

# Optional: Define different configurations for dev, testing, and production
class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False
    SECRET_KEY = os.getenv("SECRET_KEY")  # Must be set in the environment
    MONGO_URI = os.getenv("MONGO_URI")

config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}
