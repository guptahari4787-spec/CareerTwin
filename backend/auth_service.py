import hashlib
import hmac
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserSession

# Security Parameters
PBKDF2_ITERATIONS = 260_000
SESSION_DURATION_DAYS = 7
COOKIE_NAME = "careertwin_session"

def hash_password(password: str) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with 260,000 iterations and random 32-char salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt.encode("utf-8"),
        PBKDF2_ITERATIONS
    )
    return f"pbkdf2:sha256:{PBKDF2_ITERATIONS}${salt}${key.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored PBKDF2 hash."""
    if not hashed_password:
        return False
        
    # Support backward-compatibility for seeded demo account
    if hashed_password == "demo_hash":
        if plain_password in ["CareerTwin2026!", "password123", "demo", "demo123", "hariom123"]:
            return True
        return False

    try:
        parts = hashed_password.split("$")
        if len(parts) != 3:
            return False
        header, salt, stored_hash = parts
        _, algorithm, iterations_str = header.split(":")
        iterations = int(iterations_str)

        computed_key = hashlib.pbkdf2_hmac(
            algorithm,
            plain_password.encode("utf-8"),
            salt.encode("utf-8"),
            iterations
        )
        return hmac.compare_digest(computed_key.hex(), stored_hash)
    except Exception:
        return False

def create_user_session(db: Session, user_id: int, days_valid: int = SESSION_DURATION_DAYS) -> str:
    """Generates a cryptographically secure session token and records it in the database."""
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=days_valid)
    
    session_record = UserSession(
        token=token,
        user_id=user_id,
        created_at=datetime.utcnow(),
        expires_at=expires_at
    )
    db.add(session_record)
    db.commit()
    return token

def delete_user_session(db: Session, token: str) -> bool:
    """Removes a session token upon logout."""
    if not token:
        return False
    sess = db.query(UserSession).filter(UserSession.token == token).first()
    if sess:
        db.delete(sess)
        db.commit()
        return True
    return False

def extract_token_from_request(request: Request) -> Optional[str]:
    """Extracts session token from Authorization header or HTTP-only cookie."""
    # 1. Check Authorization header: Bearer <token>
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        if token:
            return token

    # 2. Check Cookie
    cookie_token = request.cookies.get(COOKIE_NAME)
    if cookie_token:
        return cookie_token

    return None

def get_optional_current_user(request: Request, db: Session = Depends(get_db)) -> Optional[User]:
    """Returns the authenticated User if valid session exists, otherwise None."""
    token = extract_token_from_request(request)
    if not token:
        return None

    session_record = db.query(UserSession).filter(
        UserSession.token == token,
        UserSession.expires_at > datetime.utcnow()
    ).first()

    if not session_record:
        return None

    user = db.query(User).filter(User.id == session_record.user_id).first()
    return user

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Enforces authentication. Raises 401 if user is not authenticated or session expired."""
    user = get_optional_current_user(request, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please sign in to continue.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user
