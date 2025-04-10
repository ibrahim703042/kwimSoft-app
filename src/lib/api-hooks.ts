import { apiRequest } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Types
export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  category_id: number;
  tenant_id: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  tenant_id: string;
}

export interface Inventory {
  id: number;
  product_id: number;
  quantity: number;
  warehouse_id: number | null;
  tenant_id: string;
  updated_at: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  tenant_id: string;
}

export interface Order {
  id: number;
  user_id: number;
  status: string;
  total: number;
  payment_status: string;
  shipping_address: any;
  tenant_id: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  tenant_id: string;
  product?: Product;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  tenant_id: string;
  created_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: string;
  active: boolean;
  created_at: string;
}

export interface DashboardStats {
  orderStats: {
    total_orders: number;
    revenue: number;
    average_order_value: number;
    orders_by_status: {
      status: string;
      count: number;
    }[];
  };
  customerStats: {
    total_customers: number;
    new_customers: number;
    active_customers: number;
  };
  lowStockItems: {
    low_stock_items: Inventory[];
  };
}

// Hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['/api/dashboard'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/dashboard');
      return res.json();
    }
  });
};

export const useProducts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['/api/products', page, limit],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/products?page=${page}&limit=${limit}`);
      return res.json();
    }
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/products/${id}`);
      return res.json();
    },
    enabled: !!id
  });
};

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (data: Omit<Product, 'id' | 'created_at'>) => {
      const res = await apiRequest('POST', '/api/products', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    }
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/categories');
      return res.json();
    }
  });
};

export const useInventory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['/api/inventory', page, limit],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/inventory?page=${page}&limit=${limit}`);
      return res.json();
    }
  });
};

export const useProductInventory = (productId: number) => {
  return useQuery({
    queryKey: ['/api/inventory/product', productId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/inventory/product/${productId}`);
      return res.json();
    },
    enabled: !!productId
  });
};

export const useAdjustStock = () => {
  return useMutation({
    mutationFn: async (data: { product_id: number, adjustment: number, tenant_id: string }) => {
      const res = await apiRequest('POST', '/api/inventory/adjust', data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory/product', variables.product_id] });
    }
  });
};

export const useLowStockItems = (threshold = 10) => {
  return useQuery({
    queryKey: ['/api/inventory/low-stock', threshold],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/inventory/low-stock?threshold=${threshold}`);
      return res.json();
    }
  });
};

export const useOrders = (page = 1, limit = 10, status?: string) => {
  return useQuery({
    queryKey: ['/api/orders', page, limit, status],
    queryFn: async () => {
      let url = `/api/orders?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }
      const res = await apiRequest('GET', url);
      return res.json();
    }
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['/api/orders', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/orders/${id}`);
      return res.json();
    },
    enabled: !!id
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status, payment_status, tenant_id }: { id: number, status: string, payment_status: string, tenant_id: string }) => {
      const res = await apiRequest('POST', `/api/orders/${id}/status`, { status, payment_status, tenant_id });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', variables.id] });
    }
  });
};

export const useCustomers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['/api/customers', page, limit],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/customers?page=${page}&limit=${limit}`);
      return res.json();
    }
  });
};

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ['/api/customers', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/customers/${id}`);
      return res.json();
    },
    enabled: !!id
  });
};

export const useCreateCustomer = () => {
  return useMutation({
    mutationFn: async (data: { username: string, password: string, email: string, role: string, tenant_id: string }) => {
      const res = await apiRequest('POST', '/api/customers', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    }
  });
};

export const useTenants = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['/api/tenants', page, limit],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/tenants?page=${page}&limit=${limit}`);
      return res.json();
    }
  });
};

export const useTenant = (id: string) => {
  return useQuery({
    queryKey: ['/api/tenants', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/tenants/${id}`);
      return res.json();
    },
    enabled: !!id
  });
};

export const useCreateTenant = () => {
  return useMutation({
    mutationFn: async (data: { id: string, name: string, plan: string }) => {
      const res = await apiRequest('POST', '/api/tenants', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tenants'] });
    }
  });
};
