# Backend Service Integration

This guide shows how to connect your Vite/React module apps to the backend services.

## Backend Services

Based on your system status page, you have these services:

| Service | URL | Module App |
|---------|-----|------------|
| User Management | http://192.168.40.10:9080 | Admin |
| Transport | http://192.168.40.10:9084 | Transport (port 3001) |
| Product | http://192.168.40.10:9922 | Product (port 3005) |
| HR | http://192.168.40.11:9017 | HR (port 3002) |
| Stock/Inventory | http://192.168.40.10:9813 | Inventory (port 3009) |
| Gateway | http://192.168.40.10:9026 | - |
| Upload | http://192.168.40.10:9060 | - |

## API Client Setup

### 1. Create Service-Specific API Clients

Each module should have its own API client pointing to its backend service.

#### Example: Transport Module

`apps/transport/src/api/transportApi.ts`:

```typescript
import axios from 'axios';

const transportApi = axios.create({
  baseURL: 'http://192.168.40.10:9084/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
transportApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
transportApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default transportApi;
```

#### Example: HR Module

`apps/hr/src/api/hrApi.ts`:

```typescript
import axios from 'axios';

const hrApi = axios.create({
  baseURL: 'http://192.168.40.11:9017/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors (same as above)
hrApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default hrApi;
```

### 2. Environment Variables

Create `.env` files for each module:

#### `apps/transport/.env`

```env
VITE_API_BASE_URL=http://192.168.40.10:9084/api
VITE_GATEWAY_URL=http://192.168.40.10:9026/api
```

#### `apps/hr/.env`

```env
VITE_API_BASE_URL=http://192.168.40.11:9017/api
VITE_GATEWAY_URL=http://192.168.40.10:9026/api
```

#### `apps/product/.env`

```env
VITE_API_BASE_URL=http://192.168.40.10:9922/api
VITE_GATEWAY_URL=http://192.168.40.10:9026/api
```

### 3. Update API Client to Use Environment Variables

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

## Using the API Client

### 1. Create API Service Functions

`apps/transport/src/api/services/tripService.ts`:

```typescript
import transportApi from '../transportApi';

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  status: string;
}

export const tripService = {
  // Get all trips
  getTrips: async (): Promise<Trip[]> => {
    const response = await transportApi.get('/trips');
    return response.data;
  },

  // Get trip by ID
  getTripById: async (id: string): Promise<Trip> => {
    const response = await transportApi.get(`/trips/${id}`);
    return response.data;
  },

  // Create new trip
  createTrip: async (trip: Omit<Trip, 'id'>): Promise<Trip> => {
    const response = await transportApi.post('/trips', trip);
    return response.data;
  },

  // Update trip
  updateTrip: async (id: string, trip: Partial<Trip>): Promise<Trip> => {
    const response = await transportApi.put(`/trips/${id}`, trip);
    return response.data;
  },

  // Delete trip
  deleteTrip: async (id: string): Promise<void> => {
    await transportApi.delete(`/trips/${id}`);
  },
};
```

### 2. Use in Components with React Query

`apps/transport/src/pages/Trips.tsx`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '@/api/services/tripService';

export default function Trips() {
  const queryClient = useQueryClient();

  // Fetch trips
  const { data: trips, isLoading, error } = useQuery({
    queryKey: ['trips'],
    queryFn: tripService.getTrips,
  });

  // Create trip mutation
  const createMutation = useMutation({
    mutationFn: tripService.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading trips</div>;

  return (
    <div>
      <h1>Trips</h1>
      <button onClick={() => createMutation.mutate({
        origin: 'New York',
        destination: 'Boston',
        departureTime: new Date().toISOString(),
        status: 'scheduled',
      })}>
        Create Trip
      </button>
      
      <ul>
        {trips?.map(trip => (
          <li key={trip.id}>
            {trip.origin} → {trip.destination}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. Setup React Query Provider

`apps/transport/src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
```

## CORS Configuration

If you encounter CORS issues, you need to configure your backend services to allow requests from your Vite dev servers.

### Backend CORS Configuration (Example for Spring Boot)

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:3000",  // Admin
                        "http://localhost:3001",  // Transport
                        "http://localhost:3002",  // HR
                        "http://localhost:3003",  // Finance
                        "http://localhost:3004",  // CRM
                        "http://localhost:3005",  // Product
                        "http://localhost:3006",  // Sales
                        "http://localhost:3007",  // Procurement
                        "http://localhost:3008",  // Manufacturing
                        "http://localhost:3009",  // Inventory
                        "http://localhost:3010",  // Maintenance
                        "http://localhost:3011"   // Carwash
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Vite Proxy Configuration (Alternative)

If you can't modify backend CORS, use Vite's proxy:

`apps/transport/vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@kwim/shared-ui": path.resolve(__dirname, "../../packages/shared-ui/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://192.168.40.10:9084',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
```

Then use relative URLs in your API client:

```typescript
const transportApi = axios.create({
  baseURL: '/api',  // Will be proxied to http://192.168.40.10:9084/api
});
```

## Authentication Flow

### 1. Login Service

`packages/auth/src/authService.ts`:

```typescript
import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://192.168.40.10:8080/api',
});

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/login', credentials);
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};
```

### 2. Use in Module Apps

Each module app can use the shared auth service:

```typescript
import { authService } from '@kwim/auth';

// In your API client
const token = authService.getToken();
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## Service Health Check

Create a health check component to monitor backend services:

`apps/admin/src/components/ServiceStatus.tsx`:

```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const services = [
  { name: 'User Management', url: 'http://192.168.40.10:8080' },
  { name: 'Transport', url: 'http://192.168.40.10:9084' },
  { name: 'Product', url: 'http://192.168.40.10:9922' },
  { name: 'HR', url: 'http://192.168.40.11:9017' },
  { name: 'Stock/Inventory', url: 'http://192.168.40.10:9813' },
  { name: 'Gateway', url: 'http://192.168.40.10:9026' },
];

export default function ServiceStatus() {
  const checkService = async (url: string) => {
    try {
      await axios.get(`${url}/actuator/health`, { timeout: 5000 });
      return 'online';
    } catch {
      return 'offline';
    }
  };

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Service Status</h2>
      {services.map(service => (
        <ServiceStatusItem
          key={service.name}
          name={service.name}
          url={service.url}
          checkFn={checkService}
        />
      ))}
    </div>
  );
}

function ServiceStatusItem({ name, url, checkFn }: any) {
  const { data: status } = useQuery({
    queryKey: ['service-status', url],
    queryFn: () => checkFn(url),
    refetchInterval: 30000, // Check every 30 seconds
  });

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded">
      <span>{name}</span>
      <span className={`px-2 py-1 rounded text-sm ${
        status === 'online' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {status || 'checking...'}
      </span>
    </div>
  );
}
```

## Next Steps

1. **Create API clients** for each module
2. **Add environment variables** for service URLs
3. **Implement service functions** for each endpoint
4. **Use React Query** for data fetching
5. **Handle authentication** with shared auth service
6. **Configure CORS** on backend services
7. **Add error handling** and loading states
8. **Monitor service health** in admin dashboard

## Example: Complete Integration

See the example implementations in:
- `apps/transport/src/api/` - Transport API integration
- `apps/hr/src/api/` - HR API integration
- `apps/product/src/api/` - Product API integration

Each module follows the same pattern for consistency.
