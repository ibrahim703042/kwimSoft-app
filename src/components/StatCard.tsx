// components/cards/StatCard.tsx
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  bgColor = "bg-gray-100 dark:bg-gray-800" 
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1f3b] rounded-md shadow-sm p-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className={`${bgColor} rounded-full p-3 transition-colors`}>
          <img src={icon} alt={`${title} icon`} className="w-8 h-8" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">{value}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
