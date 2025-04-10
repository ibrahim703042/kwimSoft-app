import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

type ActivityType = 'order' | 'inventory' | 'warning' | 'customer' | 'system';

interface Activity {
  id: number;
  type: ActivityType;
  message: string;
  time: string;
  timestamp: Date;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'order':
      return 'shopping_cart';
    case 'inventory':
      return 'inventory';
    case 'warning':
      return 'warning';
    case 'customer':
      return 'person_add';
    case 'system':
      return 'settings';
    default:
      return 'notifications';
  }
};

const getActivityBgColor = (type: ActivityType) => {
  switch (type) {
    case 'order':
      return 'bg-blue-100';
    case 'inventory':
      return 'bg-green-100';
    case 'warning':
      return 'bg-yellow-100';
    case 'customer':
      return 'bg-purple-100';
    case 'system':
      return 'bg-gray-100';
    default:
      return 'bg-blue-100';
  }
};

const getActivityIconColor = (type: ActivityType) => {
  switch (type) {
    case 'order':
      return 'text-blue-600';
    case 'inventory':
      return 'text-green-600';
    case 'warning':
      return 'text-yellow-600';
    case 'customer':
      return 'text-purple-600';
    case 'system':
      return 'text-gray-600';
    default:
      return 'text-blue-600';
  }
};

const RecentActivity: React.FC = () => {
  // In real app, we would fetch from API
  // Currently mocking the data until API is available
  const activities: Activity[] = [
    {
      id: 1,
      type: 'order',
      message: 'New order #1234',
      time: '$129.00 - 12 minutes ago',
      timestamp: new Date(Date.now() - 12 * 60 * 1000)
    },
    {
      id: 2,
      type: 'inventory',
      message: 'Inventory updated',
      time: '30 minutes ago',
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 3,
      type: 'warning',
      message: 'Low stock alert: Wireless Headphones',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: 4,
      type: 'customer',
      message: 'New customer registered',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 5,
      type: 'order',
      message: 'New order #1233',
      time: '$79.00 - 3 hours ago',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
  ];

  return (
    <Card className="shadow-md">
      <CardHeader className="border-b border-gray-200 p-4">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="py-3 flex items-start">
              <div className={`${getActivityBgColor(activity.type)} p-2 rounded-full mr-3`}>
                <span className={`material-icons ${getActivityIconColor(activity.type)} text-sm`}>
                  {getActivityIcon(activity.type)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <Button variant="outline" className="w-full py-2">
            <span className="text-sm font-medium">View All Activity</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
