# Quick Start Guide - Authentication & User Management

## Prerequisites
- Node.js 18+ installed
- MongoDB running locally or remotely
- PostgreSQL database setup (optional, for hybrid setup)

## Step 1: Configure Backend

### 1.1 Environment Variables
Ensure your `.env` file in `monorepo-app` has the correct settings:

```env
# Port Configuration
PORT_USER=9080

# Database
MONGODB_BASE_URI=mongodb://127.0.0.1:27017
MONGODB_DB_USER=USER-MANAGEMENT

# Swagger Path
SWAGGER_USER_PATH=api/user-management
```

### 1.2 Start Backend Services
```bash
cd monorepo-app
pnpm install  # If not already done
pnpm run start:dev
```

This will start all services including:
- ✅ User Service on `http://127.0.0.1:9080`
- API Gateway on `http://127.0.0.1:9089`
- Other services as configured

### 1.3 Verify Backend is Running
Open your browser and visit:
- Swagger UI: `http://127.0.0.1:9080/api/user-management/docs`

You should see the API documentation.

## Step 2: Create Test User (Optional)

If you need to create a test user, you can use the Swagger UI or create directly in MongoDB:

### Using MongoDB Shell:
```javascript
use USER-MANAGEMENT

// Create a test user
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash "Password123"
  firstName: "Admin",
  lastName: "User",
  roles: [],
  permissions: [],
  isActive: true,
  status: "ACTIVE",
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Or use the API to register:
```bash
curl -X POST http://127.0.0.1:9080/api/user-management/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Password123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

## Step 3: Start Frontend

### 3.1 Install Dependencies
```bash
cd kwimSoft-app
npm install  # All dependencies are already in package.json
```

### 3.2 Start Development Server
```bash
npm run dev
```

The app will start on `http://localhost:5173`

## Step 4: Login

1. Navigate to `http://localhost:5173`
2. You'll be automatically redirected to `/login` (not authenticated)
3. Enter your credentials:
   - **Username**: `admin` (or your test username)
   - **Password**: `Password123` (or your test password)
4. Click "Se connecter"

## Step 5: Explore Features

After successful login, you'll be redirected to the home page. Navigate to **User Management** to access:

### Groups Management
- Create, edit, delete groups
- View group members

### Roles Management  
- Create, edit, delete roles
- Assign permissions to roles
- Select multiple permissions using checkboxes

### Users Management
- Create new users
- Edit user information
- Assign roles to users
- Delete users
- View user status

### User Sessions
- View all active sessions
- See device type (mobile/desktop)
- View IP addresses
- Invalidate/logout specific sessions

## Common Issues & Solutions

### Issue 1: Cannot Connect to Backend
**Error**: Network Error or CORS error

**Solution**:
1. Verify backend is running: `http://127.0.0.1:9080/api/user-management/docs`
2. Check if MongoDB is running
3. Verify `.env` configuration

### Issue 2: Login Fails
**Error**: "Invalid credentials" or 401 Unauthorized

**Solution**:
1. Verify user exists in database
2. Check username/password are correct
3. Ensure user status is "ACTIVE"
4. Check backend logs for errors

### Issue 3: Token Refresh Fails
**Error**: Redirected to login after a while

**Solution**:
- This is normal behavior when refresh token expires
- Tokens expire after 15 minutes (access) and 7 days (refresh)
- Simply login again

### Issue 4: Pages Show "No Data"
**Error**: Tables are empty

**Solution**:
1. Create test data using Swagger UI
2. Check API endpoints are responding
3. Open browser DevTools to check API calls

## Testing the Implementation

### Test Login
```bash
curl -X POST http://127.0.0.1:9080/api/user-management/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Password123"
  }'
```

Expected response:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "uuid...",
  "expiresIn": 900,
  "tokenType": "Bearer",
  "user": {
    "_id": "...",
    "username": "admin",
    "email": "admin@example.com",
    "roles": [...],
    "permissions": [...]
  }
}
```

### Test Get Users
```bash
curl -X GET http://127.0.0.1:9080/api/user-management/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Changes auto-reload in browser
- Backend: Nest.js watches for changes and restarts

### Debugging
1. **Frontend**: Open Chrome DevTools → Network tab
2. **Backend**: Check terminal output for logs
3. **Database**: Use MongoDB Compass or mongo shell

### API Testing
Use the Swagger UI for easy API testing:
`http://127.0.0.1:9080/api/user-management/docs`

## Next Steps

1. **Customize**: Modify pages to match your design requirements
2. **Add Features**: Implement additional user management features
3. **Security**: Review and enhance security measures for production
4. **Testing**: Add unit and integration tests
5. **Deployment**: Prepare for production deployment

## Support

- Backend API Documentation: `http://127.0.0.1:9080/api/user-management/docs`
- Full Implementation Guide: `AUTHENTICATION_IMPLEMENTATION.md`
- Frontend Source: `kwimSoft-app/src/`
- Backend Source: `monorepo-app/apps/user-service/src/`

---

**Happy Coding!** 🚀
