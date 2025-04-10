import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
  iconBgColor?: string; // Tailwind classes, e.g., "bg-green-100 text-green-600"
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  trend,
  prefix = "",
  suffix = "",
  iconBgColor = "bg-primary/10 text-primary",
  className,
}) => {
  return (
    <Card className={cn("shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className={cn("rounded-full p-3", iconBgColor)}>
            {icon}
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold">
              {prefix}{value}{suffix}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            {typeof trend === "number" && (
              <div className={cn(
                "flex items-center justify-end gap-1 text-sm mt-1",
                trend > 0 ? "text-green-500" : trend < 0 ? "text-red-500" : "text-gray-500"
              )}>
                {trend > 0 && <TrendingUp size={16} />}
                {trend < 0 && <TrendingDown size={16} />}
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
