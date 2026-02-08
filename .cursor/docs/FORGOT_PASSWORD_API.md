# Forgot Password API Documentation

This document describes the backend API endpoints required for the forgot password functionality with OTP email verification.

## Base URL
```
${API_ROUTE_PASSWORD}
```

## Endpoints

### 1. Request Password Reset (Send OTP)

**Endpoint:** `POST /forgot-password`

**Description:** Sends a 6-digit OTP code to the user's email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "message": "OTP sent successfully",
  "email": "user@example.com"
}
```

**Error Responses:**
- **Status Code:** 404 Not Found
  ```json
  {
    "message": "User not found"
  }
  ```
- **Status Code:** 500 Internal Server Error
  ```json
  {
    "message": "Failed to send email"
  }
  ```

**Implementation Notes:**
- Generate a random 6-digit OTP code
- Store the OTP in the database with an expiration time (e.g., 10 minutes)
- Send the OTP to the user's email
- The OTP should be stored with the user's email for verification

---

### 2. Verify OTP

**Endpoint:** `POST /verify-otp`

**Description:** Verifies the OTP code sent to the user's email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

**Error Responses:**
- **Status Code:** 400 Bad Request
  ```json
  {
    "message": "Invalid or expired OTP"
  }
  ```
- **Status Code:** 404 Not Found
  ```json
  {
    "message": "OTP not found"
  }
  ```

**Implementation Notes:**
- Check if the OTP exists for the given email
- Verify that the OTP matches and hasn't expired
- Mark the OTP as verified (optional, for security)
- Do not delete the OTP yet (needed for password reset)

---

### 3. Reset Password

**Endpoint:** `POST /reset-password`

**Description:** Resets the user's password after OTP verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "newPassword": "newSecurePassword123"
}
```

**Success Response:**
- **Status Code:** 200 OK
- **Body:**
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**
- **Status Code:** 400 Bad Request
  ```json
  {
    "message": "OTP not verified"
  }
  ```
- **Status Code:** 404 Not Found
  ```json
  {
    "message": "User not found"
  }
  ```
- **Status Code:** 500 Internal Server Error
  ```json
  {
    "message": "Failed to reset password"
  }
  ```

**Implementation Notes:**
- Verify that the OTP was verified for this email
- Hash the new password before storing
- Update the user's password in the database
- Delete the OTP record after successful password reset
- Optionally, send a confirmation email to the user

---

## Database Schema Suggestion

### OTP Table
```sql
CREATE TABLE password_reset_otps (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_expires_at (expires_at)
);
```

---

## Security Considerations

1. **OTP Expiration:** OTPs should expire after 10-15 minutes
2. **Rate Limiting:** Implement rate limiting on the forgot-password endpoint to prevent abuse
3. **Attempt Limits:** Limit the number of OTP verification attempts (e.g., 5 attempts)
4. **Email Verification:** Only send OTPs to verified email addresses
5. **Secure Storage:** Store OTPs securely (consider hashing)
6. **Cleanup:** Regularly clean up expired OTP records
7. **Logging:** Log all password reset attempts for security auditing

---

## Email Template Example

**Subject:** Password Reset - Your OTP Code

**Body:**
```
Hello,

You requested to reset your password. Your verification code is:

**123456**

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
Your App Team
```

---

## Frontend Flow

1. User enters email on `/forgot-password`
2. Backend sends OTP to email
3. User enters OTP code
4. Backend verifies OTP
5. User enters new password
6. Backend resets password
7. User is redirected to login page

---

## Testing

### Test Case 1: Valid Flow
1. Request OTP with valid email
2. Verify OTP with correct code
3. Reset password with new password
4. Login with new password

### Test Case 2: Invalid OTP
1. Request OTP with valid email
2. Verify OTP with incorrect code
3. Should receive error message

### Test Case 3: Expired OTP
1. Request OTP with valid email
2. Wait for OTP to expire
3. Verify OTP with correct code
4. Should receive error message

### Test Case 4: Resend OTP
1. Request OTP with valid email
2. Request OTP again (resend)
3. Verify with new OTP
4. Should work successfully
