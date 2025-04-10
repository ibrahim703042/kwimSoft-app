import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Inventory, Product } from '@/lib/api-hooks';

type InventoryItemWithProduct = Inventory & {
  product?: Product;
};

const InventoryTable: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const limit = 4;

  const { data, isLoading } = useQuery({
    queryKey: ['/api/inventory', page, limit],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/inventory?page=${page}&limit=${limit}`);
      return res.json();
    }
  });

  const { data: productsData } = useQuery({
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/products');
      return res.json();
    }
  });

  // Combine inventory with product data
  const inventoryWithProducts: InventoryItemWithProduct[] = React.useMemo(() => {
    if (!data?.inventory || !productsData?.products) return [];
    
    return data.inventory.map((item: Inventory) => {
      const product = productsData.products.find((p: Product) => p.id === item.product_id);
      return { ...item, product };
    });
  }, [data, productsData]);

  const getStatusBadge = (quantity: number) => {
    if (quantity <= 0) {
      return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
    } else if (quantity < 20) {
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex items-center justify-between border-b border-gray-200 p-4">
        <CardTitle>Inventory Status</CardTitle>
        <Button variant="ghost" className="text-primary hover:text-primary-dark text-sm font-medium">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Loading inventory data...
                  </td>
                </tr>
              ) : inventoryWithProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                inventoryWithProducts.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
                          <span className="material-icons text-gray-400">shopping_basket</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product?.name || 'Unknown Product'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product?.category_id ? `Category ID: ${item.product.category_id}` : 'No Category'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product?.sku || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.quantity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button variant="ghost" className="text-primary hover:text-primary-dark mr-3">Edit</Button>
                      <Button variant="ghost" className="text-gray-500 hover:text-gray-700">View</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {data ? (
              `Showing ${(page - 1) * limit + 1} to ${
                Math.min(page * limit, data.total)
              } of ${data.total} results`
            ) : (
              'Loading...'
            )}
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 mr-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="px-2 py-1 rounded-md bg-primary text-white hover:bg-primary/90"
            >
              {page}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 ml-1"
              onClick={() => setPage(p => p + 1)}
              disabled={!data || page * limit >= data.total}
            >
              {page + 1}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2 py-1 ml-1"
              onClick={() => setPage(p => p + 2)}
              disabled={!data || (page + 1) * limit >= data.total}
            >
              {page + 2}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={!data || page * limit >= data.total}
              className="px-3 py-1 ml-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
