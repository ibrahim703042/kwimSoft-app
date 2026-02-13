# Landing Page Implementation - Odoo-Style Multi-Tenant Architecture

This implementation provides a complete landing page system similar to Odoo, where:
1. Users first see a public landing page
2. They can create an enterprise/organization
3. Each enterprise gets its own subdomain (e.g., `acme.yourapp.com`)
4. Users access their specific instance via their subdomain

## 🎯 Features

- ✅ Beautiful landing page with hero section, features, and benefits
- ✅ Enterprise creation flow with subdomain selection
- ✅ Real-time subdomain availability checking
- ✅ Automatic subdomain routing
- ✅ Multi-tenant architecture support
- ✅ Development mode support (localhost)
- ✅ Form validation with Zod
- ✅ Responsive design with Tailwind CSS
- ✅ Dark mode support

## 📁 Files Created

### Frontend Components
1. **`src/pages/landing/LandingPage.tsx`** - Main public landing page
2. **`src/pages/landing/CreateEnterprise.tsx`** - Enterprise creation form
3. **`src/utils/subdomain.ts`** - Subdomain detection and management utilities

### Updated Files
1. **`src/app/Router.tsx`** - Updated to handle landing page routes
2. **`src/app/AppShell.tsx`** - Updated to show landing page on main domain

### Documentation
1. **`BACKEND_API_GUIDE.md`** - Complete backend implementation guide
2. **`LANDING_PAGE_IMPLEMENTATION.md`** - This file

## 🚀 How It Works

### 1. Domain Detection

The system automatically detects whether the user is on:
- **Main domain** (e.g., `yourapp.com`) → Shows landing page
- **Subdomain** (e.g., `acme.yourapp.com`) → Shows app login/dashboard

```typescript
// src/utils/subdomain.ts
export function getSubdomainInfo(): SubdomainInfo {
  const hostname = window.location.hostname;
  
  // For localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const devSubdomain = localStorage.getItem('dev_subdomain');
    return {
      isSubdomain: !!devSubdomain,
      subdomain: devSubdomain,
      baseDomain: hostname,
    };
  }

  // Production subdomain detection
  const parts = hostname.split('.');
  if (parts.length > 2 && parts[0] !== 'www') {
    return {
      isSubdomain: true,
      subdomain: parts[0],
      baseDomain: parts.slice(1).join('.'),
    };
  }

  return {
    isSubdomain: false,
    subdomain: null,
    baseDomain: hostname,
  };
}
```

### 2. Routing Logic

```typescript
// src/app/Router.tsx
export function AppRouter() {
  const showLanding = isLandingPage();

  // Main domain - show landing page
  if (showLanding) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-enterprise" element={<CreateEnterprise />} />
      </Routes>
    );
  }

  // Subdomain - show app routes
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* ... other app routes */}
    </Routes>
  );
}
```

### 3. Enterprise Creation Flow

1. User visits `yourapp.com`
2. Clicks "Create Enterprise"
3. Fills out form with:
   - Enterprise name
   - Desired subdomain
   - Admin details
4. System checks subdomain availability in real-time
5. On submit, backend creates:
   - Enterprise record
   - Admin user account
   - Default settings
6. User is redirected to `subdomain.yourapp.com/login`

## 🛠️ Setup Instructions

### Frontend Setup

1. **Install dependencies** (already done if you have the project):
```bash
npm install
```

2. **Update environment variables** (`.env`):
```env
VITE_API_HOST=http://yourapp.com:3000
```

3. **Run development server**:
```bash
npm run dev
```

### Backend Setup

Follow the complete guide in `BACKEND_API_GUIDE.md` to implement:
- Enterprise creation API
- Subdomain validation
- Multi-tenant database structure
- Authentication with enterprise context

### Local Development with Subdomains

#### Option 1: Using hosts file (Recommended)

1. Edit your hosts file:
   - **Mac/Linux**: `/etc/hosts`
   - **Windows**: `C:\Windows\System32\drivers\etc\hosts`

2. Add entries:
```
127.0.0.1 yourapp.local
127.0.0.1 acme.yourapp.local
127.0.0.1 demo.yourapp.local
```

3. Access:
   - Landing: `http://yourapp.local:5173`
   - Tenant: `http://acme.yourapp.local:5173`

#### Option 2: Using localStorage (Simpler)

The system automatically uses `localStorage` for development:
- When you create an enterprise on localhost, it stores the subdomain
- The app detects this and behaves as if you're on a subdomain
- No hosts file editing needed!

## 📱 User Flow

### New Enterprise Creation

```
1. User visits yourapp.com
   ↓
2. Clicks "Start Free Trial" or "Create Enterprise"
   ↓
3. Fills out enterprise creation form
   - Enterprise name: "Acme Corporation"
   - Subdomain: "acme" (checks availability)
   - Admin name: "John Doe"
   - Admin email: "john@acme.com"
   - Password: ********
   ↓
4. Submits form
   ↓
5. Backend creates enterprise + admin user
   ↓
6. Redirects to acme.yourapp.com/login?new=true
   ↓
7. User logs in with credentials
   ↓
8. Accesses their dedicated workspace
```

### Existing User Login

```
1. User visits acme.yourapp.com
   ↓
2. Sees login page (not landing page)
   ↓
3. Enters credentials
   ↓
4. Accesses their workspace
```

## 🎨 Customization

### Branding

Update `src/pages/landing/LandingPage.tsx`:

```typescript
// Change logo and app name
<Building2 className="h-8 w-8 text-blue-600" />
<span className="text-2xl font-bold">YourApp</span>

// Update hero text
<h1 className="text-5xl md:text-6xl font-bold">
  Your Custom Headline
</h1>
```

### Features Section

Add/modify features in the landing page:

```typescript
<FeatureCard
  icon={<YourIcon className="h-12 w-12 text-blue-600" />}
  title="Your Feature"
  description="Feature description"
/>
```

### Subdomain Format

Modify validation in `src/pages/landing/CreateEnterprise.tsx`:

```typescript
subdomain: z.string()
  .min(3, 'Subdomain must be at least 3 characters')
  .max(20, 'Subdomain must be less than 20 characters')
  .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens')
```

## 🔒 Security Considerations

### Frontend
- ✅ Form validation with Zod
- ✅ Password confirmation
- ✅ Real-time subdomain availability check
- ✅ XSS protection (React default)

### Backend (See BACKEND_API_GUIDE.md)
- ⚠️ Implement rate limiting for enterprise creation
- ⚠️ Email verification for admin accounts
- ⚠️ Strong password requirements
- ⚠️ Subdomain blacklist (admin, api, www, etc.)
- ⚠️ CORS configuration for subdomains
- ⚠️ Data isolation per enterprise

## 🌐 Production Deployment

### DNS Configuration

1. **Add wildcard DNS record**:
```
Type: A
Name: *
Value: Your-Server-IP
TTL: 3600
```

2. **Add main domain record**:
```
Type: A
Name: @
Value: Your-Server-IP
TTL: 3600
```

### SSL Certificate

Get a wildcard SSL certificate:
```bash
# Using Let's Encrypt with Certbot
certbot certonly --manual --preferred-challenges=dns \
  -d yourapp.com -d *.yourapp.com
```

### Nginx Configuration

```nginx
# Main domain (landing page)
server {
    listen 80;
    server_name yourapp.com;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Wildcard subdomain (app instances)
server {
    listen 80;
    server_name *.yourapp.com;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Database Considerations

### Multi-Tenant Strategies

#### 1. Shared Database with Tenant ID (Recommended)
- All enterprises share same database
- Every table has `enterprise_id` column
- Queries always filter by `enterprise_id`
- Most cost-effective
- Easier to maintain

#### 2. Separate Database per Tenant
- Each enterprise gets own database
- Complete data isolation
- More complex to manage
- Higher costs
- Better for compliance

#### 3. Hybrid Approach
- Shared database for small tenants
- Separate databases for enterprise clients
- Flexible but complex

## 🧪 Testing

### Test Scenarios

1. **Landing Page**
   - [ ] Landing page loads on main domain
   - [ ] All links work correctly
   - [ ] Responsive design works
   - [ ] Dark mode toggles properly

2. **Enterprise Creation**
   - [ ] Form validation works
   - [ ] Subdomain availability check works
   - [ ] Password confirmation validates
   - [ ] Success redirects to subdomain

3. **Subdomain Routing**
   - [ ] Subdomain shows login page (not landing)
   - [ ] Login works on subdomain
   - [ ] User can access their workspace
   - [ ] Data is isolated per enterprise

4. **Edge Cases**
   - [ ] Invalid subdomain characters rejected
   - [ ] Duplicate subdomain prevented
   - [ ] Reserved subdomains blocked (admin, api, www)
   - [ ] Long subdomains handled

## 🐛 Troubleshooting

### Issue: Subdomain not detected on localhost

**Solution**: The system uses localStorage for development. Create an enterprise and it will automatically store the subdomain.

### Issue: CORS errors on subdomain

**Solution**: Configure backend CORS to allow all subdomains:
```javascript
app.use(cors({
  origin: /\.yourapp\.com$/,
  credentials: true
}));
```

### Issue: Redirect loop after enterprise creation

**Solution**: Check that backend returns correct subdomain in response and frontend properly stores it.

### Issue: Can't access subdomain in production

**Solution**: 
1. Verify wildcard DNS record is set
2. Check SSL certificate covers wildcard
3. Verify Nginx/Apache configuration

## 📚 Additional Resources

- [Odoo Multi-Tenancy](https://www.odoo.com/)
- [Subdomain Routing Best Practices](https://example.com)
- [Multi-Tenant Architecture Patterns](https://example.com)

## 🎉 Next Steps

1. ✅ Frontend landing page - DONE
2. ⏳ Implement backend APIs (see BACKEND_API_GUIDE.md)
3. ⏳ Set up database schema
4. ⏳ Configure DNS and SSL
5. ⏳ Add email verification
6. ⏳ Implement billing/subscriptions
7. ⏳ Create admin dashboard
8. ⏳ Add analytics and monitoring

## 💡 Tips

- Start with localhost development using the localStorage approach
- Test thoroughly before deploying to production
- Implement proper error handling and user feedback
- Consider adding a trial period mechanism
- Add analytics to track enterprise creation funnel
- Implement email notifications for new signups
- Create an admin panel to manage enterprises

---

**Need Help?** Check the BACKEND_API_GUIDE.md for complete backend implementation details.
