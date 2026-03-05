import { Calendar } from "@/components/ui/calendar";
import { useDateStore } from "@/store/dateStore/useDateStore";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import styles from "./index.module.css";

export const DatePicker = () => {
  const { date, setDate } = useDateStore();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  let parsedDate: Date | undefined = undefined;
  const parts = date.split("/");

  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const tempDate = new Date(year, month - 1, day);

    if (!isNaN(tempDate.getTime()) && tempDate.getDate() === day) {
      parsedDate = tempDate;
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;

    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();

    setDate(`${d}/${m}/${y}`);
    setIsCalendarOpen(false);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="date" className={styles.label}>
        Date
      </label>
      <Input
        id="date"
        type="text"
        placeholder="DD/MM/YYYY"
        value={date}
        onChange={handleManualInput}
        maxLength={10}
        className={styles.input}
      />

      {/* Calendar Popup */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger className={styles.popOver} asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleCalendarSelect}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
