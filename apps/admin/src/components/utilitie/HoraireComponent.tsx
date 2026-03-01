import { ReactNode } from "react";

interface HoraireComponentProps {
  items: {
    _id?: string | number;
    dayOfWeek?: string;
    departureTime?: string;
    arrivalTime?: string;
    [key: string]: unknown;
  };
  children?: ReactNode;
}

export default function HoraireComponent({ items, children }: HoraireComponentProps) {
  return (
    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="space-y-2">
        {items.departureTime && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Départ:</span>
            <span className="font-medium">{items.departureTime}</span>
          </div>
        )}
        {items.arrivalTime && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Arrivée:</span>
            <span className="font-medium">{items.arrivalTime}</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
