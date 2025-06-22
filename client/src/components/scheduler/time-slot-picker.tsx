import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  timeSlots: string[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotPicker({ 
  timeSlots, 
  selectedTime, 
  onTimeSelect 
}: TimeSlotPickerProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
      {timeSlots.map((slot, index) => (
        <button
          key={index}
          onClick={() => onTimeSelect(slot)}
          className={cn(
            "text-center border rounded-md py-2 cursor-pointer transition-colors",
            selectedTime === slot
              ? "border-green-medium bg-green-pale text-green-dark font-medium"
              : "border-neutral-silver hover:bg-green-pale hover:border-green-medium"
          )}
          aria-selected={selectedTime === slot}
        >
          <div className="text-sm">{slot}</div>
        </button>
      ))}
    </div>
  );
}
