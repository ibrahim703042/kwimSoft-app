
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  value, 
  label, 
  trend, 
  prefix = "", 
  suffix = "" 
}) => {
  return (
    <div className="bg-white dark:bg-[#1a1f3b] rounded-lg shadow-sm p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="bg-primary/10 dark:bg-primary/20 rounded-full p-3 text-primary">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold">
            {prefix}{value}{suffix}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          {trend && (
            <div className={`flex items-center justify-end gap-1 text-sm ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
