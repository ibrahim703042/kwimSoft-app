// components/cards/StatCard.tsx
import React from "react";

interface StatCardProps {
  icon: string;
  count: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, count, label }) => {
  return (
    <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm p-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
          <img src={icon} alt={`${label} icon`} className="w-9" />
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">{count}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
