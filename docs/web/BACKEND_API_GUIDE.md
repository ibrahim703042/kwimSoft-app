# Backend API Implementation Guide

This guide explains the backend APIs you need to implement to support the multi-tenant landing page functionality.

## Required API Endpoints

### 1. Check Subdomain Availability

**Endpoint:** `GET /api/enterprises/check-subdomain/:subdomain`

**Purpose:** Check if a subdomain is available for registration

**Response:**
```json
{
  "available": true,
  "subdomain": "acme"
}
```

**Example Implementation (Node.js/Express):**
```javascript
app.get('/api/enterprises/check-subdomain/:subdomain', async (req, res) => {
  const { subdomain } = req.params;
  
  // Check if subdomain exists in database
  const exists = await Enterprise.findOne({ subdomain });
  
  res.json({
    available: !exists,
    subdomain
  });
});
```

---

### 2. Create Enterprise

**Endpoint:** `POST /api/enterprises/create`

**Purpose:** Create a new enterprise/tenant with admin user

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "subdomain": "acme",
  "admin": {
    "name": "John Doe",
    "email": "john@acme.com",
    "password": "securepassword123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "enterprise": {
    "id": "ent_123456",
    "name": "Acme Corporation",
    "subdomain": "acme",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "admin": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john@acme.com"
  }
}
```

**Example Implementation (Node.js/Express):**
```javascript
app.post('/api/enterprises/create', async (req, res) => {
  try {
    const { name, subdomain, admin } = req.body;
    
    // Validate subdomain availability
    const exists = await Enterprise.findOne({ subdomain });
    if (exists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Subdomain already taken' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    
    // Create enterprise
    const enterprise = await Enterprise.create({
      name,
      subdomain,
      createdAt: new Date()
    });
    
    // Create admin user
    const adminUser = await User.create({
      name: admin.name,
      email: admin.email,
      password: hashedPassword,
      enterpriseId: enterprise.id,
      role: 'admin'
    });
    
    // Initialize default settings, permissions, etc.
    await initializeEnterpriseDefaults(enterprise.id);
    
    res.json({
      success: true,
      enterprise: {
        id: enterprise.id,
        name: enterprise.name,
        subdomain: enterprise.subdomain,
        createdAt: enterprise.createdAt
      },
      admin: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email
      }
    });
  } catch (error) {
    console.error('Error creating enterprise:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create enterprise' 
    });
  }
});
```

---

### 3. Get Enterprise by Subdomain

**Endpoint:** `GET /api/enterprises/by-subdomain/:subdomain`

**Purpose:** Get enterprise information for a specific subdomain (used during login)

**Response:**
```json
{
  "id": "ent_123456",
  "name": "Acme Corporation",
  "subdomain": "acme",
  "settings": {
    "logo": "https://...",
    "primaryColor": "#0066cc"
  }
}
```

---

### 4. Updated Login Endpoint

**Endpoint:** `POST /api/auth/login`

**Purpose:** Authenticate user within their enterprise context

**Request Body:**
```json
{
  "email": "john@acme.com",
  "password": "securepassword123",
  "subdomain": "acme"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_123456",
    "name": "John Doe",
    "email": "john@acme.com",
    "role": "admin"
  },
  "enterprise": {
    "id": "ent_123456",
    "name": "Acme Corporation",
    "subdomain": "acme"
  }
}
```

---

## Database Schema Examples

### Enterprise/Tenant Table
```sql
CREATE TABLE enterprises (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(50) UNIQUE NOT NULL,
  logo_url VARCHAR(500),
  primary_color VARCHAR(7),
  status ENUM('active', 'suspended', 'trial') DEFAULT 'trial',
  trial_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_subdomain (subdomain)
);
```

### Updated Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  enterprise_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (enterprise_id) REFERENCES enterprises(id) ON DELETE CASCADE,
  UNIQUE KEY unique_email_per_enterprise (enterprise_id, email),
  INDEX idx_enterprise (enterprise_id)
);
```

---

## Middleware for Subdomain Detection

Add middleware to detect and validate subdomain on each request:

```javascript
// Subdomain detection middleware
function detectSubdomain(req, res, next) {
  const hostname = req.hostname;
  const parts = hostname.split('.');
  
  // Extract subdomain (if exists)
  if (parts.length > 2 && parts[0] !== 'www') {
    req.subdomain = parts[0];
  } else {
    req.subdomain = null;
  }
  
  next();
}

// Enterprise validation middleware
async function validateEnterprise(req, res, next) {
  if (!req.subdomain) {
    return res.status(400).json({ 
      error: 'No enterprise subdomain provided' 
    });
  }
  
  const enterprise = await Enterprise.findOne({ 
    subdomain: req.subdomain 
  });
  
  if (!enterprise) {
    return res.status(404).json({ 
      error: 'Enterprise not found' 
    });
  }
  
  if (enterprise.status === 'suspended') {
    return res.status(403).json({ 
      error: 'Enterprise account is suspended' 
    });
  }
  
  req.enterprise = enterprise;
  next();
}

// Apply middleware
app.use(detectSubdomain);

// Protected routes that require enterprise context
app.use('/api/protected/*', validateEnterprise);
```

---

## Environment Variables

Add these to your backend `.env`:

```env
# Base domain for subdomains
BASE_DOMAIN=yourapp.com

# JWT secret
JWT_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/yourapp

# Email service (for verification, password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

---

## Testing Locally

For local development with subdomains:

1. **Edit your hosts file** (`/etc/hosts` on Mac/Linux, `C:\Windows\System32\drivers\etc\hosts` on Windows):
```
127.0.0.1 yourapp.local
127.0.0.1 acme.yourapp.local
127.0.0.1 demo.yourapp.local
```

2. **Update frontend `.env`**:
```env
VITE_API_HOST=http://yourapp.local:3000
```

3. **Access your app**:
- Landing page: `http://yourapp.local:5173`
- Tenant app: `http://acme.yourapp.local:5173`

---

## Security Considerations

1. **Subdomain Validation**: Prevent subdomain squatting and reserved names
2. **Rate Limiting**: Limit enterprise creation attempts
3. **Email Verification**: Verify admin email before activation
4. **Password Requirements**: Enforce strong passwords
5. **CORS Configuration**: Properly configure CORS for subdomains
6. **Data Isolation**: Ensure queries are scoped to enterprise_id
7. **Trial Management**: Implement trial period tracking and enforcement

---

## Next Steps

1. Implement the backend APIs listed above
2. Set up database tables
3. Configure subdomain routing on your server (Nginx/Apache)
4. Set up SSL certificates for wildcard domain (*.yourapp.com)
5. Implement email verification flow
6. Add billing/subscription management
7. Create admin dashboard for enterprise management
