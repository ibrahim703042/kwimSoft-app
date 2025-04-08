
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";

export default function Inventory() {
  const { plan } = useUserStore();
  const isPremium = plan === 'premium';
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className={`p-6 ${!isPremium && 'opacity-75'}`}>
          <h3 className="font-semibold mb-2">Stock Management</h3>
          {isPremium ? (
            <div className="space-y-4">
              <button className="bg-primary text-white px-4 py-2 rounded">
                Manage Stock
              </button>
            </div>
          ) : (
            <div className="text-muted-foreground">
              ⭐ Premium feature
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
