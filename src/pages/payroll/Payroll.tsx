
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";

export default function Payroll() {
  const { plan } = useUserStore();
  const isPremium = plan === 'premium';

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payroll Management</h1>
        {!isPremium && (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Lite Plan
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Salary Processing</h3>
          {isPremium ? (
            <div className="space-y-4">
              <button className="bg-primary text-white px-4 py-2 rounded">
                Process Payroll
              </button>
            </div>
          ) : (
            <div className="text-muted-foreground">
              ⭐ Upgrade to Premium to access advanced payroll features
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
