# Landing Page as Home - Troubleshooting Guide

## 🏠 Issue: Dashboard Shows Instead of Landing Page

### Why This Happens

Your browser has **authentication tokens stored in localStorage** from a previous login session. The app reads these tokens on startup and considers you "authenticated," even if you haven't logged in during this session.

### How Authentication Persistence Works

```typescript
// In auth.store.ts (lines 38-41)
export const useAuthStore = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
  // ...
}));
```

**This means:**
- ✅ Login tokens persist across browser refreshes
- ✅ Users stay logged in even after closing the browser
- ❌ You see dashboard when visiting `/` if tokens exist

---

## ✅ Solutions

### **Option 1: Clear Browser Data (Quick Test)**

**Method A: Browser Console**
1. Press `F12` to open Developer Tools
2. Go to **Console** tab
3. Run this command:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

**Method B: Application Tab**
1. Press `F12` to open Developer Tools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Find **Local Storage** → `http://localhost:3000`
4. Click **Clear All**
5. Refresh the page (`F5`)

---

### **Option 2: Use the Logout Button**

Now your landing page has a **Logout button** that appears when you're authenticated:

**Desktop:**
```
Navbar: [Features] [Modules] [Pricing] [Dashboard] [🔓 Logout]
```

**Mobile Menu:**
```
Features
Modules
Pricing
─────────
Dashboard
🔓 Logout
```

Click "Logout" and the landing page will refresh showing the public view.

---

### **Option 3: Use Incognito/Private Mode**

- **Chrome**: `Ctrl + Shift + N`
- **Firefox**: `Ctrl + Shift + P`
- **Edge**: `Ctrl + Shift + N`

This gives you a clean session with no stored data.

---

## 🎯 Updated Landing Page Features

### **Smart Navigation Based on Auth Status**

#### **When NOT Logged In:**
```
[Features] [Modules] [Pricing] [Sign In] [Start Free Trial]
```

#### **When Logged In:**
```
[Features] [Modules] [Pricing] [Dashboard] [🔓 Logout]
```

### **User Flow:**

```
┌─────────────────────────────────────────┐
│  Visit http://localhost:3000/           │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │           │
    No Tokens    Has Tokens
         │           │
         ▼           ▼
    Landing     Landing Page
    Page        (with Logout)
    (Public)        │
         │          │
         │     Click Logout
         │          │
         │          ▼
         │    Tokens Cleared
         │          │
         └──────────┴──────► Landing Page
                              (Public View)
```

---

## 🔧 What Was Changed

### **File: `LandingPage.tsx`**

**Added Auth Store:**
```typescript
import { useAuthStore } from "@/core/auth";

const { isAuthenticated, logout } = useAuthStore();
```

**Added Logout Handler:**
```typescript
const handleLogout = () => {
  logout(); // Clears localStorage
  navigate("/");
  window.location.reload(); // Force fresh state
};
```

**Conditional Navigation Buttons:**
```typescript
{isAuthenticated ? (
  <>
    <button onClick={() => navigate("/dashboard")}>
      Dashboard
    </button>
    <button onClick={handleLogout}>
      🔓 Logout
    </button>
  </>
) : (
  <>
    <button onClick={() => navigate("/login")}>
      Sign In
    </button>
    <button onClick={() => navigate("/trial")}>
      Start Free Trial
    </button>
  </>
)}
```

---

## 📋 Testing Checklist

### **Test 1: Public View**
- [ ] Clear localStorage
- [ ] Visit `http://localhost:3000/`
- [ ] See: Landing page with "Sign In" and "Start Free Trial"
- [ ] Navigation shows public buttons

### **Test 2: Authenticated View**
- [ ] Login via `/login`
- [ ] Visit `http://localhost:3000/`
- [ ] See: Landing page with "Dashboard" and "Logout"
- [ ] Click "Dashboard" → goes to `/dashboard`
- [ ] Click "Logout" → clears tokens, refreshes page

### **Test 3: Persistence**
- [ ] Login via `/login`
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Visit `http://localhost:3000/`
- [ ] Still see authenticated buttons (tokens persist)

---

## 🔍 Check Your Auth Status

Run this in browser console to see your current auth state:

```javascript
// Check if you have tokens
console.log('User:', localStorage.getItem('user'));
console.log('Access Token:', localStorage.getItem('access_token'));
console.log('Refresh Token:', localStorage.getItem('refresh_token'));

// If you see data, you're "logged in"
// To clear:
localStorage.clear();
location.reload();
```

---

## 💡 Pro Tips

### **1. Test Both States Easily**

Keep two browser windows open:
- **Normal Window**: Logged in (see authenticated view)
- **Incognito Window**: Logged out (see public view)

### **2. Development Mode**

If you want to **always** see the landing page (even when logged in), you can temporarily comment out the auth check:

```typescript
// Temporarily in Router.tsx
<Route path="/" element={<LandingPage />} />
// Instead of checking isAuthenticated
```

### **3. Clear Specific Keys Only**

If you want to logout but keep other localStorage data:

```javascript
localStorage.removeItem('user');
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
location.reload();
```

---

## 📞 Common Questions

### **Q: Why do I still see dashboard after clearing localStorage?**
A: Make sure to refresh the page (`F5`) or reload (`Ctrl+R`) after clearing.

### **Q: Can I prevent token persistence?**
A: Yes, but this would logout users every time they close the browser. Not recommended for UX.

### **Q: How do I test the public landing page?**
A: Use Incognito mode or clear localStorage before each test.

### **Q: The logout button doesn't appear?**
A: Check browser console for errors. Make sure you imported `useAuthStore` and `LogOut` icon.

---

## ✅ Summary

**Problem**: Landing page shows dashboard because of stored auth tokens.

**Root Cause**: `localStorage` persists authentication across page refreshes.

**Solution**: 
1. ✅ Clear localStorage manually for testing
2. ✅ Use new Logout button on landing page
3. ✅ Use Incognito mode for clean testing

**Result**: Landing page now works for both authenticated and unauthenticated users, with appropriate buttons for each state.

---

**Status**: ✅ Fixed
**Last Updated**: February 13, 2026
