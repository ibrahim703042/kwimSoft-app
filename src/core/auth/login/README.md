# Authentication Module - Login & Password Management

This directory contains all authentication-related pages for the application.

## Components

### 1. Login.tsx
Main login page for user authentication.

**Features:**
- Email and password validation
- JWT token handling
- User session management
- Redirect to dashboard on success
- Link to forgot password page

**Route:** `/login`

---

### 2. ForgotPassword.tsx
Complete forgot password flow with OTP email verification.

**Features:**
- **Step 1: Email Input**
  - User enters their email address
  - System sends 6-digit OTP code via email
  
- **Step 2: OTP Verification**
  - User enters the OTP code received
  - Option to resend OTP if not received
  - Option to change email address
  
- **Step 3: Password Reset**
  - User creates a new password
  - Password confirmation validation
  - Redirect to login on success

**Route:** `/forgot-password`

**API Endpoints Required:**
- `POST /forgot-password` - Send OTP to email
- `POST /verify-otp` - Verify OTP code
- `POST /reset-password` - Reset password

**Security Features:**
- OTP expiration (10 minutes recommended)
- Rate limiting on OTP requests
- Password strength validation
- Secure password hashing

---

### 3. UpdatePassword.tsx
Password update page for logged-in users.

**Features:**
- Current password verification
- New password validation
- Password confirmation
- Session management after update

**Route:** `/update-password`

**Usage:**
- Used when user needs to change password while logged in
- Can be used for forced password resets

---

### 4. Effacer.tsx
Account deletion or data clearing page.

**Features:**
- User account management
- Data clearing functionality
- Security verification

**Route:** `/effacer` (or as configured)

---

## Styling

All authentication pages use the shared CSS file:
```
src/styles/modules/login.css
```

**Design Features:**
- Split-screen layout
- Background image on left
- Form on right
- Responsive design
- Material-UI components

---

## Assets Used

### Images
- `waangulogo.png` - Application logo
- `busbge.jpg` - Background image

**Path:** `src/assets/img/img/`

---

## Dependencies

### UI Libraries
- `@mui/material` - Material-UI components (FilledInput, FormControl, InputLabel)
- `@/components/ui/button` - Custom button component

### Form Management
- `formik` - Form state management
- `yup` - Form validation

### HTTP Client
- `axios` - API requests

### Routing
- `react-router-dom` - Navigation

### Notifications
- `sweetalert2` - Success/error alerts

### Authentication
- `jwt-decode` - JWT token decoding

---

## Configuration

### API Routes
All API routes are configured in `src/config/index.ts`:

```typescript
import { API_ROUTE_PASSWORD } from "@/config/index";
```

**Available endpoints:**
- `API_ROUTE_PASSWORD` - Password management endpoints

---

## State Management

### User Store
Location: `src/store/useUserStore.tsx`

**Interface:**
```typescript
interface User {
  tokenDecode: string | null;
  token: string;
  requiresPasswordReset: boolean;
  userID: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}
```

**Usage:**
```typescript
import useUserStore from "@/store/useUserStore";

const { user, setUser, logout } = useUserStore();
```

---

## Flow Diagrams

### Login Flow
```
User enters credentials
    ↓
Validate form
    ↓
Send POST to /login
    ↓
Receive JWT token
    ↓
Store in localStorage
    ↓
Redirect to dashboard
```

### Forgot Password Flow
```
User enters email
    ↓
Send POST to /forgot-password
    ↓
OTP sent to email
    ↓
User enters OTP
    ↓
Send POST to /verify-otp
    ↓
OTP verified
    ↓
User enters new password
    ↓
Send POST to /reset-password
    ↓
Password reset
    ↓
Redirect to login
```

---

## Error Handling

All pages implement comprehensive error handling:

1. **Form Validation Errors**
   - Displayed inline below fields
   - Red text styling
   - Clear error messages

2. **API Errors**
   - SweetAlert2 popups
   - User-friendly messages
   - Fallback error messages

3. **Network Errors**
   - Graceful degradation
   - Retry mechanisms
   - Clear user feedback

---

## Security Best Practices

1. **Password Requirements**
   - Minimum 6 characters
   - Validation on frontend and backend

2. **Token Management**
   - JWT stored in localStorage
   - Automatic token refresh
   - Secure transmission

3. **OTP Security**
   - Time-limited codes (10 minutes)
   - Single-use codes
   - Rate limiting

4. **Session Management**
   - Automatic logout on password change
   - Clear session data
   - Secure redirects

---

## Testing

### Manual Testing Checklist

**Login:**
- [ ] Valid credentials work
- [ ] Invalid credentials show error
- [ ] Empty fields show validation errors
- [ ] Forgot password link works

**Forgot Password:**
- [ ] Valid email sends OTP
- [ ] Invalid email shows error
- [ ] OTP verification works
- [ ] Resend OTP works
- [ ] Password reset works
- [ ] Redirect to login works

**Update Password:**
- [ ] Current password verification
- [ ] New password validation
- [ ] Password confirmation works
- [ ] Session cleared after update

---

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check asset paths (should be `../../../assets/img/img/`)
   - Verify images exist in assets folder

2. **API errors**
   - Check API_ROUTE_PASSWORD configuration
   - Verify backend endpoints are running
   - Check CORS settings

3. **Styling issues**
   - Verify CSS import path
   - Check if login.css exists
   - Clear browser cache

4. **Navigation issues**
   - Check route configuration in Router.tsx
   - Verify all routes are registered

---

## Future Enhancements

- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] Remember me functionality
- [ ] Password strength meter
- [ ] Account lockout after failed attempts
- [ ] Email verification on signup
- [ ] SMS OTP option

---

## Contributing

When adding new authentication features:

1. Follow existing code patterns
2. Add proper TypeScript types
3. Implement error handling
4. Add validation
5. Update this README
6. Test thoroughly

---

## Support

For issues or questions:
- Check the troubleshooting section
- Review the API documentation
- Contact the development team
