import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
  disabled?: boolean;
}

export function DatePicker({ date, setDate, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState<string>(
    format(date || new Date(), "HH:mm")
  );

  // Update the time when the date changes
  useEffect(() => {
    if (date) {
      setTime(format(date, "HH:mm"));
    }
  }, [date]);

  // Handle time change and update the date
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);

    if (date) {
      const [hours, minutes] = e.target.value.split(":");
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0); // Handle null/NaN by defaulting to 0
      setDate(newDate);
    }
  };

  // Handle date change and maintain the time
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const [hours, minutes] = time.split(":");
      newDate.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0, 0); // Handle null/NaN by defaulting to 0
      setDate(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP HH:mm") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
