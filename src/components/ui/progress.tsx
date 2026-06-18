import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLProgressElement> {
  value?: number;
}

const Progress = React.forwardRef<HTMLProgressElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <progress
      ref={ref}
      value={Math.min(100, Math.max(0, value))}
      max={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-secondary [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-secondary [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary",
        className
      )}
      {...props}
    />
  )
);
Progress.displayName = "Progress";

export { Progress };
