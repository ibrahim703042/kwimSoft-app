import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const NotificationDropdown: React.FC = () => {
  const [notificationCount] = useState(3);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative mr-4">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-medium">Low stock alert: Wireless Headphones</p>
            <p className="text-xs text-gray-500">5 minutes ago</p>
          </div>
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-medium">New order #1234</p>
            <p className="text-xs text-gray-500">1 hour ago</p>
          </div>
          <div className="p-3">
            <p className="text-sm font-medium">System update completed</p>
            <p className="text-xs text-gray-500">Yesterday</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center font-medium">
          View All Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
