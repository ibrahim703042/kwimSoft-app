import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  trend,
  prefix = "",
  suffix = "",
  iconBgColor = "bg-primary/10 text-primary",
  className,
  isLoading = false,
}) => {
  const trendColor =
    trend === 0
      ? "text-gray-500"
      : trend && trend > 0
      ? "text-green-600"
      : "text-red-600";

  const TrendIcon =
    trend === 0
      ? MoveHorizontal
      : trend && trend > 0
      ? TrendingUp
      : TrendingDown;

  return (
    <Card
      className={cn("shadow-sm hover:shadow-md transition-shadow", className)}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "rounded-xl p-3 flex items-center justify-center text-xl",
              iconBgColor
            )}
            aria-hidden="true"
          >
            {icon}
          </div>

          <div className="flex-1 text-right space-y-1">
            <p className="text-muted-foreground text-sm">{label}</p>

            {isLoading ? (
              <Skeleton className="h-6 w-24 ml-auto" />
            ) : (
              <p className="text-2xl font-bold tabular-nums">
                {prefix}
                {value}
                {suffix}
              </p>
            )}

            {typeof trend === "number" && !isNaN(trend) && (
              <div
                className={cn(
                  "flex items-center justify-end gap-1 text-xs",
                  trendColor
                )}
              >
                <TrendIcon size={14} strokeWidth={2} />
                <span className="font-medium">
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
