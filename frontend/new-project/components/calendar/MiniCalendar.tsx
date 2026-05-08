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
        <span className="text-sm font-semibold text-indigo-100">
          {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onPrevMonth}
            className="rounded p-1 hover:bg-indigo-800"
          >
            <ChevronLeft className="h-4 w-4 text-indigo-200" />
          </button>
          <button
            onClick={onNextMonth}
            className="rounded p-1 hover:bg-indigo-800"
          >
            <ChevronRight className="h-4 w-4 text-indigo-200" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="py-1 text-center font-medium text-indigo-300">
            {d}
          </div>
        ))}
        {miniDays.map((day, i) => (
          <div
            key={i}
            onClick={() => onDateClick(day.fullDate)}
            className={`cursor-pointer rounded-full py-1 text-center text-xs ${day.isCurrentMonth ? "text-indigo-100" : "text-indigo-500"} ${isToday(day.fullDate) ? "bg-indigo-500 font-bold text-white" : "hover:bg-indigo-800"}`}
          >
            {day.date}
          </div>
        ))}
      </div>
    </div>
  );
}
