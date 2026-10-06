"""
OTP Generation, Cryptographic Storage, and Rate Limiting Service
"""
import time
from typing import Dict, Any, Tuple
from app.core.security import generate_numeric_otp, hash_otp, verify_otp_hash

# Local memory cache for dev when Redis is not running
_in_memory_otp_cache: Dict[str, Dict[str, Any]] = {}

class OTPService:
    @staticmethod
    def create_and_store_otp(destination: str, channel: str = "EMAIL") -> Tuple[str, int]:
        """Generates OTP, stores SHA-256 hash with 300s expiration, returns (plain_otp, expires_in)"""
        otp = generate_numeric_otp(6)
        hashed = hash_otp(otp)
        expires_at = time.time() + 300 # 5 minutes

        _in_memory_otp_cache[destination] = {
            "hash": hashed,
            "expires_at": expires_at,
            "attempts": 0,
            "channel": channel,
            "last_sent": time.time()
        }
        return otp, 300

    @staticmethod
    def verify_otp(destination: str, candidate_otp: str) -> Tuple[bool, str]:
        """Validates OTP, enforces attempt limit, prevents replay attacks"""
        record = _in_memory_otp_cache.get(destination)
        if not record:
            return False, "OTP expired or not requested. Please request a new OTP."

        if time.time() > record["expires_at"]:
            _in_memory_otp_cache.pop(destination, None)
            return False, "OTP has expired. Please request a new OTP."

        if record["attempts"] >= 5:
            _in_memory_otp_cache.pop(destination, None)
            return False, "Maximum verification attempts exceeded. Please request a new OTP."

        record["attempts"] += 1

        if verify_otp_hash(candidate_otp, record["hash"]):
            # Invalidate immediately to prevent replay
            _in_memory_otp_cache.pop(destination, None)
            return True, "Verification successful"

        return False, "Invalid OTP code. Please check and try again."
