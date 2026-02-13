# Technology Stack

## Build System & Tooling

- **Build Tool**: Vite 5.4+
- **Package Manager**: npm
- **Language**: TypeScript 5.7+
- **Module System**: ES Modules

## Core Framework & Libraries

### Frontend Framework
- **React** 18.3+ with React DOM
- **React Router** 6.28+ for routing
- **Vite Plugin React** for Fast Refresh with Babel

### State Management
- **Zustand** 5.0+ (primary state management)
- **Redux Toolkit** 2.3+ with React Redux 9.1+
- **TanStack Query** 5.64+ for server state

### UI & Styling
- **Tailwind CSS** 3.4+ with autoprefixer
- **Material-UI (MUI)** 6.1+ with Emotion
- **Radix UI** components (dialogs, dropdowns, menus, etc.)
- **Lucide React** for icons
- **React Bootstrap Icons** 1.11+
- **next-themes** for theme management
- **Class Variance Authority** + clsx + tailwind-merge for conditional styling

### Forms & Validation
- **React Hook Form** 7.53+ with @hookform/resolvers
- **Formik** 2.4+ (legacy forms)
- **Zod** 3.23+ for schema validation
- **Yup** 1.6+ (legacy validation)

### Data Visualization & Maps
- **Highcharts** 11.4+ with React wrapper
- **Recharts** 2.15+
- **Mapbox GL** 3.10+ with React Map GL 7.1+
- **@mapbox/mapbox-gl-draw** for drawing tools
- **@mapbox/mapbox-gl-geocoder** for location search
- **React Google Maps API** 2.20+
- **React Konva** 19.0+ for canvas rendering
- **React SVG Pan Zoom** 3.13+

### Tables & Data Display
- **TanStack Table** 8.20+ (React Table 8)
- **React Table** 7.8+ (legacy)

### Utilities
- **Axios** 1.7+ for HTTP requests
- **i18next** 24.2+ with react-i18next for internationalization
- **date-fns** 3.6+ for date manipulation
- **jwt-decode** 4.0+ for JWT handling
- **SweetAlert2** 11.14+ for alerts/modals
- **React Spinners** 0.15+ for loading indicators
- **React Day Picker** 8.10+ for date selection

## Development Tools

- **ESLint** 9.13+ with React plugins
- **PostCSS** 8.4+
- **vite-plugin-svgr** for SVG imports as React components
- **vite-tsconfig-paths** for path alias resolution

## Path Aliases

The project uses TypeScript path aliases configured in `tsconfig.json`:

```typescript
"@/*" → "./src/*"
"@/app/*" → "./src/app/*"
"@/core/*" → "./src/core/*"
"@/modules/*" → "./src/modules/*"
"@/components/*" → "./src/components/*"
"@/hooks/*" → "./src/hooks/*"
"@/lib/*" → "./src/lib/*"
"@/assets/*" → "./src/assets/*"
"@/store/*" → "./src/store/*"
"@/styles/*" → "./src/styles/*"
"@/config" → "./src/config/index.ts"
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server on http://0.0.0.0:3000
```

### Build & Preview
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

## Server Configuration

- **Dev Server**: Runs on `0.0.0.0:3000` (accessible from network)
- **Hot Module Replacement**: Enabled via Vite
