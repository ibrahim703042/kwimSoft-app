# Troubleshooting Guide

Common issues and solutions for the KWIM monorepo.

## Vite Import Errors

### Error: Failed to resolve import "@kwim/shared-ui"

**Symptoms:**
```
Failed to resolve import "@kwim/shared-ui" from "src/components/sidebar/index.tsx"
```

**Solution:**

1. **Check Vite Config** - Ensure `apps/admin/vite.config.ts` has the alias:

```typescript
resolve: {
  alias: {
    "@kwim/shared-ui": path.resolve(__dirname, "../../packages/shared-ui/src"),
    // ... other aliases
  },
}
```

2. **Check TypeScript Config** - Ensure `apps/admin/tsconfig.app.json` has the path:

```json
{
  "compilerOptions": {
    "paths": {
      "@kwim/shared-ui": ["../../packages/shared-ui/src/index.ts"],
      "@kwim/shared-ui/*": ["../../packages/shared-ui/src/*"]
    }
  }
}
```

3. **Restart Dev Server** - Stop and restart the Vite dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart
pnpm dev:admin
```

### Error: Missing "." specifier in "@kwim/shared-ui" package

**Symptoms:**
```
Failed to resolve entry for package "@kwim/shared-ui". 
The package may have incorrect main/module/exports specified in its package.json
```

**Solution:**

Check `packages/shared-ui/package.json` has proper exports:

```json
{
  "name": "@kwim/shared-ui",
  "main": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./sidebar": "./src/sidebar/index.ts",
    "./navbar": "./src/navbar/index.ts"
  }
}
```

## Port Already in Use

### Error: Port 3000 is in use

**Symptoms:**
```
Port 3000 is in use, trying another one...
Port 3001 is in use, trying another one...
```

**Solution:**

1. **Kill the process** using the port:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

2. **Use a different port** - Update `package.json`:

```json
{
  "scripts": {
    "dev": "vite --port 3012"
  }
}
```

## Module Not Found

### Error: Cannot find module '@kwim/shared-ui'

**Solution:**

1. **Install dependencies:**

```bash
pnpm install
```

2. **Check workspace configuration** - Ensure `pnpm-workspace.yaml` includes:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

3. **Clear cache and reinstall:**

```bash
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## TypeScript Errors

### Error: Cannot find module '@kwim/shared-ui' or its corresponding type declarations

**Solution:**

1. **Check tsconfig paths** - Ensure paths are configured in `tsconfig.app.json`

2. **Restart TypeScript server** in VS Code:
   - Press `Ctrl+Shift+P`
   - Type "TypeScript: Restart TS Server"
   - Press Enter

3. **Check package.json** - Ensure dependency is listed:

```json
{
  "dependencies": {
    "@kwim/shared-ui": "workspace:*"
  }
}
```

## Build Errors

### Error: Build fails with module resolution errors

**Solution:**

1. **Type check first:**

```bash
pnpm type-check
```

2. **Fix TypeScript errors** before building

3. **Clear build cache:**

```bash
rm -rf .next
rm -rf dist
pnpm build
```

## Next.js Module Apps

### Error: Module not found in Next.js app

**Solution:**

1. **Check next.config.js** - Ensure transpilePackages includes shared-ui:

```javascript
const nextConfig = {
  transpilePackages: ['@kwim/shared-ui', '@kwim/auth', '@kwim/config'],
};
```

2. **Restart Next.js dev server:**

```bash
pnpm dev:transport
```

### Error: CSS not loading in Next.js app

**Solution:**

1. **Check tailwind.config.js** includes shared-ui:

```javascript
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

2. **Import globals.css** in layout.tsx:

```typescript
import "./globals.css";
```

## Shared Components Not Updating

### Changes to shared-ui not reflecting in apps

**Solution:**

Since we're importing directly from source (`src/index.ts`), changes should reflect immediately. If not:

1. **Restart dev server** for the app

2. **Clear Vite cache:**

```bash
rm -rf node_modules/.vite
pnpm dev:admin
```

3. **Check file paths** - Ensure imports are correct:

```typescript
// Correct
import { Sidebar } from "@kwim/shared-ui";

// Also correct (specific import)
import { Sidebar } from "@kwim/shared-ui/sidebar";
```

## React Hook Errors

### Error: Invalid hook call

**Symptoms:**
```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Solution:**

This usually happens when there are multiple React instances. Ensure:

1. **Single React version** - Check all packages use the same React version

2. **Proper peer dependencies** in shared-ui:

```json
{
  "peerDependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

3. **Don't bundle React** in shared packages

## Performance Issues

### Dev server is slow

**Solution:**

1. **Optimize Vite config:**

```typescript
export default defineConfig({
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
});
```

2. **Use SWC instead of Babel** (already configured in Next.js)

3. **Reduce file watching:**

```typescript
export default defineConfig({
  server: {
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
  },
});
```

## Deployment Issues

### Build succeeds but app doesn't work in production

**Solution:**

1. **Check environment variables:**

```bash
# Ensure all required env vars are set
VITE_API_HOST=...
NEXT_PUBLIC_API_URL=...
```

2. **Test production build locally:**

```bash
pnpm build:admin
pnpm preview
```

3. **Check basePath** in Next.js apps:

```javascript
// next.config.js
const nextConfig = {
  basePath: '/transport', // Must match deployment path
};
```

## Getting Help

If you're still stuck:

1. **Check the documentation:**
   - [MONOREPO_ARCHITECTURE.md](./MONOREPO_ARCHITECTURE.md)
   - [MODULE_APPS.md](./MODULE_APPS.md)
   - [CREATE_MODULE_APP.md](./CREATE_MODULE_APP.md)

2. **Review existing module apps** for working examples

3. **Check the shared-ui package** for component usage

4. **Look at the admin app** for Vite/React Router integration

5. **Look at transport app** for Next.js integration

## Common Commands

```bash
# Install dependencies
pnpm install

# Run admin app
pnpm dev:admin

# Run module app
pnpm dev:transport

# Type check
pnpm type-check

# Build all
pnpm build

# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Debug Mode

Enable verbose logging:

```bash
# Vite
DEBUG=vite:* pnpm dev:admin

# Next.js
NODE_OPTIONS='--inspect' pnpm dev:transport
```

## Still Having Issues?

1. Check if the issue is specific to one module or affects all
2. Try creating a fresh module app to isolate the problem
3. Compare working module with broken one
4. Check git history for recent changes
5. Review error stack traces carefully
