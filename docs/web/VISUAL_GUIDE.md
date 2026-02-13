# 🎨 Visual Guide - Landing Page Flow

This guide shows you exactly what users will see and experience.

## 📱 User Interface Flow

### 1. Landing Page (yourapp.com)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] YourApp          Features  Pricing  About  Sign In  │
│                                          [Start Free Trial]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│              Manage Your Business                            │
│              All in One Place                                │
│                                                               │
│     The complete business management solution.               │
│     From CRM to inventory, accounting to HR.                 │
│                                                               │
│     [Start Free Trial →]  [Watch Demo]                       │
│                                                               │
│     No credit card required • 14-day free trial              │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│         Everything You Need to Succeed                       │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   [Icon]    │  │   [Icon]    │  │   [Icon]    │         │
│  │   Team      │  │  Enterprise │  │  Lightning  │         │
│  │Collaboration│  │   Security  │  │    Fast     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- Clean, modern header with navigation
- Bold hero section with clear value proposition
- Two prominent CTAs (Call-to-Action buttons)
- Trust indicators (no credit card, free trial)
- Feature cards showcasing benefits
- Responsive design for mobile/tablet

---

### 2. Create Enterprise Page (yourapp.com/create-enterprise)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Home                                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    [Building Icon]                           │
│                                                               │
│              Create Your Enterprise                          │
│     Set up your organization and get your own                │
│              dedicated workspace                             │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  Enterprise Name                                        │  │
│  │  [Acme Corporation________________]                    │  │
│  │                                                         │  │
│  │  Choose Your Subdomain                                  │  │
│  │  [acme_____________] .yourapp.com                      │  │
│  │  ✓ Subdomain is available                              │  │
│  │                                                         │  │
│  │  ─────────────────────────────────                     │  │
│  │  Administrator Account                                  │  │
│  │                                                         │  │
│  │  Full Name                                              │  │
│  │  [John Doe_________________]                           │  │
│  │                                                         │  │
│  │  Email Address                                          │  │
│  │  [john@acme.com____________]                           │  │
│  │                                                         │  │
│  │  Password                                               │  │
│  │  [••••••••_________________]                           │  │
│  │                                                         │  │
│  │  Confirm Password                                       │  │
│  │  [••••••••_________________]                           │  │
│  │                                                         │  │
│  │         [Create Enterprise]                             │  │
│  │                                                         │  │
│  │  By creating an enterprise, you agree to our            │  │
│  │  Terms of Service and Privacy Policy                    │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Real-time subdomain availability checking
- Visual feedback (✓ available, ✗ taken)
- Form validation with error messages
- Password strength requirements
- Clear visual hierarchy
- Loading states during submission

**Validation Examples:**

```
❌ Subdomain too short
   [ab] .yourapp.com
   ⚠️ Subdomain must be at least 3 characters

❌ Invalid characters
   [Acme_Corp] .yourapp.com
   ⚠️ Only lowercase letters, numbers, and hyphens

❌ Already taken
   [demo] .yourapp.com
   ✗ Subdomain is already taken

✅ Valid and available
   [acme] .yourapp.com
   ✓ Subdomain is available
```

---

### 3. Login Page (acme.yourapp.com/login)

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    [Building Icon] Acme Corporation          │
│                                                               │
│                      KWIM TRANS                              │
│                                                               │
│                    Se connecter                              │
│                                                               │
│                  acme.yourapp.com                            │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │  Nom d'utilisateur                                      │  │
│  │  [_____________________________]                       │  │
│  │                                                         │  │
│  │  Mot de passe                                           │  │
│  │  [_____________________________]                       │  │
│  │                                                         │  │
│  │                          Mot de passe oublié ?          │  │
│  │                                                         │  │
│  │         [Se connecter]                                  │  │
│  │                                                         │  │
│  │  ─────────────────────────────────────────────────     │  │
│  │                                                         │  │
│  │  Vous n'avez pas de compte ?                           │  │
│  │  Contactez votre administrateur pour obtenir un accès  │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Differences from Landing:**
- Shows enterprise name and icon
- Displays subdomain indicator
- No "Create Account" option (admin creates users)
- Enterprise-specific branding
- Background image maintained

---

### 4. Dashboard (acme.yourapp.com/)

```
┌─────────────────────────────────────────────────────────────┐
│ [☰] Sidebar                                    [🔍] [🌙] [👤]│
├──────────────┬──────────────────────────────────────────────┤
│              │  Dashboard > Home                             │
│  Dashboard   ├──────────────────────────────────────────────┤
│  Modules     │                                               │
│  Reports     │  Welcome to Acme Corporation!                │
│  Settings    │                                               │
│              │  [Statistics Cards]                           │
│  ─────────   │                                               │
│              │  [Charts and Graphs]                          │
│  Profile     │                                               │
│  Logout      │  [Recent Activity]                            │
│              │                                               │
│              │                                               │
└──────────────┴──────────────────────────────────────────────┘
```

**Key Features:**
- Full app interface with sidebar
- Enterprise-specific data
- User profile with enterprise context
- All data isolated to this enterprise

---

## 🔄 Complete User Journey

### New Enterprise Creation

```
Step 1: Discovery
┌─────────────────┐
│  User visits    │
│  yourapp.com    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sees landing   │
│  page with      │
│  features       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Clicks "Start  │
│  Free Trial"    │
└────────┬────────┘

Step 2: Registration
         │
         ▼
┌─────────────────┐
│  Fills out      │
│  enterprise     │
│  creation form  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Checks         │
│  subdomain      │
│  availability   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Submits form   │
│  (validated)    │
└────────┬────────┘

Step 3: Provisioning
         │
         ▼
┌─────────────────┐
│  Backend        │
│  creates:       │
│  - Enterprise   │
│  - Admin user   │
│  - Settings     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Redirects to   │
│  acme.yourapp   │
│  .com/login     │
└────────┬────────┘

Step 4: First Login
         │
         ▼
┌─────────────────┐
│  User logs in   │
│  with admin     │
│  credentials    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Accesses       │
│  dashboard      │
│  (isolated)     │
└─────────────────┘
```

### Existing User Login

```
┌─────────────────┐
│  User visits    │
│  acme.yourapp   │
│  .com           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  System detects │
│  subdomain      │
│  "acme"         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Shows login    │
│  page (not      │
│  landing)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User enters    │
│  credentials    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend        │
│  validates      │
│  with subdomain │
│  context        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User accesses  │
│  their          │
│  workspace      │
└─────────────────┘
```

---

## 🎨 Design Principles

### Landing Page
- **Clean & Modern**: Minimal clutter, focus on value
- **Clear CTAs**: Prominent action buttons
- **Trust Signals**: Free trial, no credit card
- **Responsive**: Works on all devices
- **Fast**: Optimized loading

### Enterprise Creation
- **Progressive Disclosure**: Show info as needed
- **Real-time Feedback**: Instant validation
- **Clear Progress**: User knows what to expect
- **Error Prevention**: Validate before submit
- **Success Clarity**: Clear next steps

### Login Page
- **Enterprise Context**: Show which org they're logging into
- **Familiar**: Similar to landing page style
- **Secure**: HTTPS, password masking
- **Helpful**: Forgot password link
- **Branded**: Enterprise-specific elements

---

## 📱 Responsive Design

### Desktop (1920px)
```
┌────────────────────────────────────────────────────────┐
│  Full width layout                                      │
│  3-column feature grid                                  │
│  Large hero text                                        │
└────────────────────────────────────────────────────────┘
```

### Tablet (768px)
```
┌──────────────────────────────┐
│  Adjusted layout              │
│  2-column feature grid        │
│  Medium hero text             │
└──────────────────────────────┘
```

### Mobile (375px)
```
┌──────────────┐
│  Stacked      │
│  layout       │
│  1-column     │
│  features     │
│  Smaller text │
└──────────────┘
```

---

## 🌓 Dark Mode

### Light Mode
- Background: White / Gray-50
- Text: Gray-900
- Primary: Blue-600
- Cards: White with subtle shadow

### Dark Mode
- Background: Gray-900
- Text: White / Gray-100
- Primary: Blue-500
- Cards: Gray-800 with border

**Toggle**: Available in navbar (moon/sun icon)

---

## ✨ Animations & Interactions

### Hover States
- Buttons: Slight scale + shadow
- Links: Underline + color change
- Cards: Lift effect (shadow)

### Loading States
- Form submission: Spinner + disabled state
- Subdomain check: Inline spinner
- Page transitions: Smooth fade

### Success States
- ✓ Green checkmark for available subdomain
- Success message after creation
- Smooth redirect

### Error States
- ✗ Red X for taken subdomain
- Inline error messages
- Form field highlighting

---

## 🎯 Key Interactions

### Subdomain Availability Check

```
User types: "a"
→ No check (too short)

User types: "ac"
→ No check (too short)

User types: "acm"
→ [Checking...] (debounced 500ms)
→ ✓ Available

User types: "acme"
→ [Checking...] (debounced 500ms)
→ ✗ Already taken

User types: "acme2"
→ [Checking...] (debounced 500ms)
→ ✓ Available
```

### Form Validation

```
On blur (field loses focus):
→ Validate individual field
→ Show error if invalid

On submit:
→ Validate all fields
→ Show all errors
→ Prevent submission if invalid
→ Submit if valid
```

### Password Confirmation

```
Password: "test123"
Confirm: "test123"
→ ✓ Passwords match

Password: "test123"
Confirm: "test456"
→ ✗ Passwords don't match
```

---

## 📊 Visual Feedback

### States

```
Default:    [Button]
Hover:      [Button] (slightly larger, shadow)
Active:     [Button] (pressed effect)
Loading:    [⟳ Loading...]
Disabled:   [Button] (grayed out)
Success:    [✓ Success]
Error:      [✗ Error]
```

### Form Fields

```
Default:    [____________]
Focus:      [____________] (blue border)
Valid:      [____________] (green border)
Invalid:    [____________] (red border)
            ⚠️ Error message
```

---

## 🎨 Color Palette

### Primary Colors
- Blue-600: `#2563eb` (Primary actions)
- Blue-500: `#3b82f6` (Hover states)
- Blue-400: `#60a5fa` (Links)

### Neutral Colors
- Gray-900: `#111827` (Dark text)
- Gray-800: `#1f2937` (Dark cards)
- Gray-50: `#f9fafb` (Light background)
- White: `#ffffff` (Light cards)

### Semantic Colors
- Green-500: `#22c55e` (Success)
- Red-500: `#ef4444` (Error)
- Yellow-500: `#eab308` (Warning)
- Blue-500: `#3b82f6` (Info)

---

## 📐 Typography

### Headings
- H1: 3rem (48px) - Hero headline
- H2: 2.25rem (36px) - Section titles
- H3: 1.5rem (24px) - Card titles
- H4: 1.25rem (20px) - Subsections

### Body
- Large: 1.25rem (20px) - Hero description
- Normal: 1rem (16px) - Body text
- Small: 0.875rem (14px) - Helper text
- Tiny: 0.75rem (12px) - Labels

### Font Weights
- Bold: 700 - Headlines
- Semibold: 600 - Subheadings
- Medium: 500 - Buttons
- Regular: 400 - Body text

---

## 🎬 Animation Timing

### Transitions
- Fast: 150ms - Hover effects
- Normal: 300ms - Page transitions
- Slow: 500ms - Complex animations

### Easing
- Ease-in-out: Smooth start and end
- Ease-out: Quick start, slow end
- Linear: Constant speed (spinners)

---

This visual guide helps you understand exactly what users will see and experience throughout the entire flow!
