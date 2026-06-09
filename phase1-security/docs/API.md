API Documentation
Base URL
http://localhost:3000/api

## Authentication Endpoints

### Register

POST /api/auth/register
**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

Login
POST /api/auth/login
Body:
{
"email": "john@example.com",
"password": "Password123"
}
Logout
POST /api/auth/logout
Refresh Token
POST /api/auth/refresh
CSRF Token
Get CSRF Token
GET /api/csrf-token
Response:
{
"csrfToken": "abc123..."
}
Include in header: X-CSRF-Token: abc123...

Protected Endpoints (Require Authentication)
Get Profile
GET /api/protected/profile
Authorization: Bearer <token>
Security Endpoints
Get CSP Policy
GET /api/security/csp-policy
Get Security Headers
GET /api/security/headers
Report CSP Violation
POST /api/security/csp-report
Health Check
GET /api/health

---

## File 36: `phase1-security/scripts/generate-certs.sh`

```bash
#!/bin/bash

echo "Generating self-signed SSL certificates..."

mkdir -p certs

openssl req -nodes -new -x509 \
  -keyout certs/key.pem \
  -out certs/cert.pem \
  -days 365 \
  -subj "/C=US/ST=State/L=City/O=Development/CN=localhost"

echo "Certificates generated in ./certs/"
echo "  - certs/cert.pem"
echo "  - certs/key.pem"
echo ""
echo "WARNING: These are self-signed certificates for development only!"
```
