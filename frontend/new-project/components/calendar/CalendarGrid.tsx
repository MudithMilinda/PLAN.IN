import { CalendarDay, CalendarEvent } from "@/types/calendar";
import type { MutableRefObject } from "react";
import { DAYS_OF_WEEK } from "@/utils/calendarHelpers";
import { DayCell } from "./DayCell";

interface CalendarGridProps {
  days: CalendarDay[];
  selectedDate: Date | null;
  getEventsForDate: (date: Date) => CalendarEvent[];
  dayRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
  onDateClick: (date: Date) => void;
  // Updated: receives rect instead of MouseEvent
  onEventClick: (event: CalendarEvent, rect: DOMRect) => void;
}

export function CalendarGrid({
  days,
  selectedDate,
  getEventsForDate,
  dayRefs,
  onDateClick,
  onEventClick,
}: CalendarGridProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid min-w-[700px] grid-cols-7 border-t border-l border-gray-200 md:min-w-0">
        {DAYS_OF_WEEK.map((d, i) => (
          <div
            key={i}
            className="border-r border-b border-gray-200 bg-gray-50 p-1.5 text-center text-xs font-semibold text-gray-700 sm:p-2 sm:text-sm"
          >
            {d}
          </div>
        ))}
        {days.map((day, index) => (
          <DayCell
            key={index}
            date={day.date}
            fullDate={day.fullDate}
            isCurrentMonth={day.isCurrentMonth}
            selectedDate={selectedDate}
            dayEvents={getEventsForDate(day.fullDate)}
            dayRef={(el) => {
              dayRefs.current[day.fullDate.toDateString()] = el;
            }}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}
