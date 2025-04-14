// File: app/inventory/page.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inventory, Product, useInventory, useProducts, useAdjustStock, useProductInventory } from '@/lib/api-hooks';
import { useToast } from '@/hooks/use-toast';
import { InventoryToolbar } from './inventoryToolbar';


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

  const inventoryWithProducts = React.useMemo(() => {
    if (!inventoryData?.inventory || !productsData?.products) return [];
    return inventoryData.inventory.map(item => {
      const product = productsData.products.find(p => p.id === item.product_id);
      return { ...item, product };
    });
  }, [inventoryData, productsData]);

  const filteredInventory = React.useMemo(() => {
    return inventoryWithProducts.filter(item => {
      const matchesSearch =
        !searchTerm ||
        (item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         item.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase()));

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
            title: 'Inventory Updated',
            description: `Product stock adjusted by ${adjustmentAmount}`,
          });
          setAdjustDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: 'Error',
            description: `Failed to adjust inventory: ${error.message}`,
            variant: 'destructive'
          });
        }
      }
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Inventory Management</h1>
        <p className="text-gray-600">Track and manage your product inventory</p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="border-b border-gray-200 p-4">
          <CardTitle>Inventory Items</CardTitle>
          <InventoryToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        </CardHeader>
        <CardContent className="p-0">
          <InventoryTable
            items={filteredInventory}
            onAdjust={handleAdjustInventory}
            isLoading={isLoading}
          />
          {inventoryData && (
            <PaginationControls
              page={page}
              limit={limit}
              total={inventoryData.total}
              onNext={() => setPage((p) => p + 1)}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            />
          )}
        </CardContent>
      </Card>

      <AdjustInventoryDialog
        open={adjustDialogOpen}
        onOpenChange={setAdjustDialogOpen}
        product={productsData?.products.find(p => p.id === selectedProductId)}
        quantity={selectedProductInventory?.inventory?.quantity}
        adjustmentAmount={adjustmentAmount}
        setAdjustmentAmount={setAdjustmentAmount}
        onSubmit={submitAdjustment}
        isPending={isPending}
      />
    </div>
  );
};

export default InventoryPage;
