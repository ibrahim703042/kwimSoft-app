import React from "react";

interface StatCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="kwim-surface p-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="bg-muted rounded-full p-3">
          <img src={icon} alt={`${title} icon`} className="w-8 h-8" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
