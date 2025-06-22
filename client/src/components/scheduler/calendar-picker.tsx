import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { isSameDay, isAfter, isBefore, startOfToday } from "date-fns";

interface CalendarPickerProps {
  availableDates: Date[];
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export default function CalendarPicker({ 
  availableDates, 
  selectedDate, 
  onDateChange 
}: CalendarPickerProps) {
  const today = startOfToday();
  
  // Function to determine if a day is unavailable
  const isDayUnavailable = (date: Date) => {
    // Disable dates in the past
    if (isBefore(date, today)) {
      return true;
    }
    
    // Disable dates that are not in the available dates list
    return !availableDates.some(availableDate => isSameDay(availableDate, date));
  };
  
  return (
    <div className="border border-neutral-silver rounded-md p-3 bg-white">
      <CalendarComponent
        mode="single"
        selected={selectedDate}
        onSelect={onDateChange}
        disabled={isDayUnavailable}
        className="rounded-md"
        classNames={{
          day_today: "bg-green-pale text-green-dark font-medium",
          day_selected: "bg-green-medium text-white hover:bg-green-dark hover:text-white focus:bg-green-dark focus:text-white",
          day_disabled: "text-neutral-silver bg-neutral-light opacity-50",
        }}
      />
    </div>
  );
}
