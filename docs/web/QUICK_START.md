# Quick Start Guide - Landing Page Implementation

Get your Odoo-style landing page up and running in minutes!

## ✅ What's Been Done

All frontend code has been implemented:
- ✅ Landing page with hero, features, and benefits sections
- ✅ Enterprise creation form with validation
- ✅ Subdomain detection and routing
- ✅ Multi-tenant architecture support
- ✅ Development mode support for localhost

## 🚀 Quick Start (5 Minutes)

### 1. Test the Landing Page Locally

```bash
# Start your development server
npm run dev
```

Visit `http://localhost:5173` - you should see the new landing page!

### 2. Test Enterprise Creation Flow

1. Click "Start Free Trial" or "Create Enterprise"
2. Fill out the form (it will show validation errors if needed)
3. Note: The actual creation will fail until you implement the backend APIs

### 3. Simulate Subdomain Mode (Development)

Since you can't use real subdomains on localhost easily, the system uses localStorage:

```javascript
// Open browser console on localhost:5173
localStorage.setItem('dev_subdomain', 'acme');
// Reload the page
location.reload();
```

Now you'll see the login page instead of the landing page, simulating `acme.yourapp.com`!

To go back to landing page:
```javascript
localStorage.removeItem('dev_subdomain');
location.reload();
```

## 📋 Next Steps

### Immediate (Required for functionality)

1. **Implement Backend APIs** (See `BACKEND_API_GUIDE.md`)
   - [ ] `POST /api/enterprises/create` - Create new enterprise
   - [ ] `GET /api/enterprises/check-subdomain/:subdomain` - Check availability
   - [ ] `GET /api/enterprises/by-subdomain/:subdomain` - Get enterprise info
   - [ ] Update `POST /api/auth/login` - Add subdomain context

2. **Update Database Schema**
   - [ ] Add `enterprises` table
   - [ ] Add `enterprise_id` to `users` table
   - [ ] Add indexes for performance

### Short Term (For production)

3. **DNS & SSL Setup**
   - [ ] Add wildcard DNS record (`*.yourapp.com`)
   - [ ] Get wildcard SSL certificate
   - [ ] Configure web server (Nginx/Apache)

4. **Testing**
   - [ ] Test enterprise creation flow
   - [ ] Test subdomain routing
   - [ ] Test data isolation
   - [ ] Test edge cases

### Long Term (Enhancements)

5. **Additional Features**
   - [ ] Email verification for new enterprises
   - [ ] Trial period management
   - [ ] Billing/subscription system
   - [ ] Admin dashboard for managing enterprises
   - [ ] Custom domain support (e.g., `app.acme.com`)

## 🎯 File Structure

```
src/
├── pages/
│   └── landing/
│       ├── LandingPage.tsx          # Main landing page
│       └── CreateEnterprise.tsx     # Enterprise creation form
├── utils/
│   └── subdomain.ts                 # Subdomain utilities
├── app/
│   ├── Router.tsx                   # Updated with landing routes
│   └── AppShell.tsx                 # Updated to handle landing page
└── core/
    └── auth/
        └── login/
            └── LoginWithSubdomain.tsx  # Enhanced login (optional)

Documentation/
├── LANDING_PAGE_IMPLEMENTATION.md   # Complete guide
├── BACKEND_API_GUIDE.md            # Backend implementation
└── QUICK_START.md                  # This file
```

## 🔧 Configuration

### Environment Variables

Update your `.env` file:

```env
# Backend API URL
VITE_API_HOST=http://localhost:3000

# Or for production
# VITE_API_HOST=https://api.yourapp.com
```

### Customization

#### Change App Name
Edit `src/pages/landing/LandingPage.tsx`:
```typescript
<span className="text-2xl font-bold">YourAppName</span>
```

#### Change Colors
The landing page uses Tailwind CSS. Main colors:
- Primary: `blue-600`
- Background: `gray-50` / `gray-900` (dark mode)

#### Change Subdomain Format
Edit `src/pages/landing/CreateEnterprise.tsx`:
```typescript
.yourapp.com  // Change this to your domain
```

## 🧪 Testing Checklist

### Frontend Testing (No Backend Required)

- [ ] Landing page loads correctly
- [ ] Navigation links work
- [ ] "Create Enterprise" button navigates to form
- [ ] Form validation works (try submitting empty form)
- [ ] Subdomain validation works (try invalid characters)
- [ ] Password confirmation works
- [ ] Responsive design works (test mobile view)
- [ ] Dark mode works

### With Backend (After API Implementation)

- [ ] Subdomain availability check works
- [ ] Enterprise creation succeeds
- [ ] Redirects to subdomain after creation
- [ ] Login works on subdomain
- [ ] User can access their workspace
- [ ] Data is isolated per enterprise

## 🐛 Common Issues

### Issue: "Cannot read property 'subdomain' of undefined"
**Solution**: Make sure `src/utils/subdomain.ts` is imported correctly.

### Issue: Form submits but nothing happens
**Solution**: Backend APIs not implemented yet. Check browser console for errors.

### Issue: Subdomain not detected on localhost
**Solution**: Use the localStorage method described above for development.

### Issue: CORS errors
**Solution**: Configure your backend to allow requests from your frontend origin.

## 📞 Need Help?

1. Check `LANDING_PAGE_IMPLEMENTATION.md` for detailed documentation
2. Check `BACKEND_API_GUIDE.md` for backend implementation
3. Review the code comments in the source files
4. Test with browser DevTools console open to see errors

## 🎉 Success Criteria

You'll know it's working when:

1. ✅ Landing page shows on main domain
2. ✅ Enterprise creation form validates correctly
3. ✅ Backend creates enterprise successfully
4. ✅ User is redirected to subdomain
5. ✅ Login works on subdomain
6. ✅ User accesses their isolated workspace

## 📚 Additional Resources

- **Full Documentation**: `LANDING_PAGE_IMPLEMENTATION.md`
- **Backend Guide**: `BACKEND_API_GUIDE.md`
- **Odoo Reference**: https://www.odoo.com/

---

**Ready to go?** Start with implementing the backend APIs in `BACKEND_API_GUIDE.md`!
