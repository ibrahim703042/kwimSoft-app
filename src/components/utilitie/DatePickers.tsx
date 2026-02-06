import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface DatePickersProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  place?: string;
}

export function DatePickers({ value, onChange, place }: DatePickersProps) {
  const [date, setDate] = React.useState<Date | undefined | null>(value ?? null);

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate ?? null);
    onChange(selectedDate);
  };

  return (
    <Popover className="w-full">
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>{place}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
