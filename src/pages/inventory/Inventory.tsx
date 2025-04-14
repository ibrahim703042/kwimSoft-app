import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Inventory, Product, useInventory, useProducts, useAdjustStock, useProductInventory } from '@/lib/api-hooks';
import { Package, Search, PlusCircle, ArrowUpDown, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type InventoryItemWithProduct = Inventory & {
  product?: Product;
};

const InventoryPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);

  const { toast } = useToast();
  const { data: inventoryData, isLoading } = useInventory(page, limit);
  const { data: productsData } = useProducts();
  const { data: selectedProductInventory } = useProductInventory(selectedProductId);
  const { mutate: adjustStock, isPending } = useAdjustStock();

  // Combine inventory with product data
  const inventoryWithProducts: InventoryItemWithProduct[] = React.useMemo(() => {
    if (!inventoryData?.inventory || !productsData?.products) return [];
    
    return inventoryData.inventory.map((item: Inventory) => {
      const product = productsData.products.find((p: Product) => p.id === item.product_id);
      return { ...item, product };
    });
  }, [inventoryData, productsData]);

  // Filter inventory items
  const filteredInventory = React.useMemo(() => {
    return inventoryWithProducts.filter(item => {
      const matchesSearch = 
        !searchTerm || 
        (item.product && item.product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.product && item.product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesStatus = true;
      if (filterStatus === 'out') {
        matchesStatus = item.quantity <= 0;
      } else if (filterStatus === 'low') {
        matchesStatus = item.quantity > 0 && item.quantity < 20;
      } else if (filterStatus === 'in') {
        matchesStatus = item.quantity >= 20;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [inventoryWithProducts, searchTerm, filterStatus]);

  const getStatusBadge = (quantity: number) => {
    if (quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity < 20) {
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  const handleAdjustInventory = (productId: number) => {
    setSelectedProductId(productId);
    setAdjustmentAmount(0);
    setAdjustDialogOpen(true);
  };

  const submitAdjustment = () => {
    if (!selectedProductId) return;
    
    adjustStock(
      { 
        product_id: selectedProductId, 
        adjustment: adjustmentAmount, 
        tenant_id: 'default'
      },
      {
        onSuccess: () => {
          toast({
            title: "Inventory Updated",
            description: `Product stock has been adjusted by ${adjustmentAmount}`,
          });
          setAdjustDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: `Failed to adjust inventory: ${error.message}`,
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <>
      {/* <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Inventory Management</h1>
        <p className="text-gray-600">Track and manage your product inventory</p>
      </div> */}

      <Card className="shadow-md">
        <CardHeader className="border-b border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Inventory Items</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-9 w-full sm:w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Loading inventory data...
                    </TableCell>
                  </TableRow>
                ) : filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium">{item.product?.name || 'Unknown Product'}</div>
                            <div className="text-sm text-gray-500">
                              {item.product?.category_id ? `Category ID: ${item.product.category_id}` : 'No Category'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.product?.sku || 'N/A'}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{getStatusBadge(item.quantity)}</TableCell>
                      <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAdjustInventory(item.product_id)}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-1" />
                            Adjust
                          </Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {inventoryData && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, inventoryData.total)} of {inventoryData.total} items
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= inventoryData.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
        <DialogContent >
          <DialogHeader className={undefined}>
            <DialogTitle>Adjust Inventory</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <div className="font-medium">
                {selectedProductInventory?.inventory?.product_id 
                  ? productsData?.products?.find(p => p.id === selectedProductInventory.inventory.product_id)?.name 
                  : 'Loading...'}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Current Quantity</Label>
              <div className="font-medium">
                {selectedProductInventory?.inventory?.quantity ?? 'Loading...'}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjustment">Adjustment</Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdjustmentAmount(prev => prev - 1)}
                >
                  -
                </Button>
                <Input
                  id="adjustment"
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(parseInt(e.target.value, 10) || 0)}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAdjustmentAmount(prev => prev + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            {adjustmentAmount < 0 && selectedProductInventory?.inventory?.quantity < Math.abs(adjustmentAmount) && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Not enough stock for this reduction
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitAdjustment} 
              disabled={isPending || (adjustmentAmount < 0 && selectedProductInventory?.inventory?.quantity < Math.abs(adjustmentAmount))}
            >
              {isPending ? 'Updating...' : 'Update Inventory'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryPage;
