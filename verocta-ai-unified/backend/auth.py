import os
import bcrypt
from datetime import datetime, timedelta
from flask import jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from functools import wraps

# Simple in-memory user store (replace with database in production)
users_db = {
    "admin@verocta.ai": {
        "id": 1,
        "email": "admin@verocta.ai",
        "password": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()),
        "role": "admin",
        "created_at": datetime.now(),
        "company": "Verocta AI",
        "is_active": True
    }
}

def init_auth(app):
    """Initialize JWT authentication"""
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'verocta-jwt-secret-2024')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)
    jwt = JWTManager(app)
    return jwt

def validate_user(email, password):
    """Validate user credentials"""
    user = users_db.get(email)
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return user
    return None

def create_user(email, password, company=None, role="user"):
    """Create new user account"""
    if email in users_db:
        return None
    
    user_id = len(users_db) + 1
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    user = {
        "id": user_id,
        "email": email,
        "password": hashed_password,
        "role": role,
        "created_at": datetime.now(),
        "company": company or "Default Company",
        "is_active": True
    }
    
    users_db[email] = user
    return user

def get_user_by_email(email):
    """Get user by email"""
    return users_db.get(email)

def get_user_by_id(user_id):
    """Get user by ID"""
    for user in users_db.values():
        if user['id'] == user_id:
            return user
    return None

def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_email = get_jwt_identity()
        user = get_user_by_email(current_user_email)
        
        if not user or user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get current authenticated user"""
    current_user_email = get_jwt_identity()
    return get_user_by_email(current_user_email)