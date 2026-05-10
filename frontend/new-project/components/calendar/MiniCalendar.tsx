import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarDay } from "@/types/calendar";
import { isToday, MONTH_NAMES } from "@/utils/calendarHelpers";

interface MiniCalendarProps {
  currentDate: Date;
  miniDays: CalendarDay[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date) => void;
}

export function MiniCalendar({
  currentDate,
  miniDays,
  onPrevMonth,
  onNextMonth,
  onDateClick,
}: MiniCalendarProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#d9ecf9]">
          {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPrevMonth}
            className="rounded p-1 hover:bg-[#1c3a59]"
          >
            <ChevronLeft className="h-4 w-4 text-[#bfdcf0]" />
          </button>
          <button
            onClick={onNextMonth}
            className="rounded p-1 hover:bg-[#1c3a59]"
          >
            <ChevronRight className="h-4 w-4 text-[#bfdcf0]" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="py-1 text-center font-medium text-[#9ec9e6]">
            {d}
          </div>
        ))}
        {miniDays.map((day, i) => (
          <div
            key={i}
            onClick={() => onDateClick(day.fullDate)}
            className={`cursor-pointer rounded-full py-1 text-center text-xs ${day.isCurrentMonth ? "text-[#d9ecf9]" : "text-[#6ea8d1]"} ${isToday(day.fullDate) ? "bg-[#3a7eb2] font-bold text-white" : "hover:bg-[#1c3a59]"}`}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
}
