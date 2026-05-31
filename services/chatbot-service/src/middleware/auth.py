import os
import base64
import json
import time
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

class AuthUser:
    def __init__(self, sub: str, role: str, campus_id: str, program_id: str = None):
        self.id         = sub
        self.role       = role
        self.campus_id  = campus_id
        self.program_id = program_id

def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> AuthUser:
    token = credentials.credentials

    try:
        # Decode payload without signature verification
        # (Kong verified the signature before forwarding)
        parts   = token.split(".")
        padding = 4 - len(parts[1]) % 4
        payload_bytes = base64.urlsafe_b64decode(parts[1] + "=" * padding)
        payload = json.loads(payload_bytes.decode("utf-8"))

        # Check expiry
        if payload.get("exp", 0) * 1000 < time.time() * 1000:
            raise HTTPException(status_code=401, detail="Token expired")

        return AuthUser(
            sub        = payload.get("sub", ""),
            role       = payload.get("role", ""),
            campus_id  = payload.get("campus_id", ""),
            program_id = payload.get("program_id")
        )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")