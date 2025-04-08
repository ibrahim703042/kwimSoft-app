import React, { useState, useMemo } from 'react';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/store/useUserStore';

export default function OrganizationPage() {
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: '',
    search: ''
  });
  const { plan } = useUserStore();
  const isPremium = plan === 'premium';

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-6">
        <Input
          placeholder="Search..."
          className="max-w-sm"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <Select
          value={filters.department}
          onValueChange={(value) => handleFilterChange('department', value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>
        {isPremium && (
          <Select
            value={filters.role}
            onValueChange={(value) => handleFilterChange('role', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      {/* Rest of your organization page content */}
    </div>
  );
}