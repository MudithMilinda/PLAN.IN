import { CalendarEvent } from "@/types/calendar";
import type { MouseEvent } from "react";
import { isToday, sameDay } from "@/utils/calendarHelpers";
import { EventCard } from "./EventCard";

interface DayCellProps {
  date: number;
  fullDate: Date;
  isCurrentMonth: boolean;
  selectedDate: Date | null;
  dayEvents: CalendarEvent[];
  dayRef?: (el: HTMLDivElement | null) => void;
  onDateClick: (date: Date) => void;
  // Updated: passes event + the card's bounding rect so EventPopup can position itself
  onEventClick: (event: CalendarEvent, rect: DOMRect) => void;
}

export function DayCell({
  date,
  fullDate,
  isCurrentMonth,
  selectedDate,
  dayEvents,
  dayRef,
  onDateClick,
  onEventClick,
}: DayCellProps) {
  const todayDate = isToday(fullDate);
  const selected = selectedDate && sameDay(fullDate, selectedDate);

  const handleEventClick = (event: CalendarEvent, e: MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onEventClick(event, rect);
  };

  return (
    <div
      ref={dayRef}
      onClick={() => onDateClick(fullDate)}
      className={`min-h-24 cursor-pointer border-r border-b border-gray-200 p-1.5 transition-colors hover:bg-gray-50 sm:min-h-28 sm:p-2 md:min-h-32 ${selected ? "border-2 border-[#5d98c6] bg-[#e7f2fa]" : "bg-white"} ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}`}
    >
      <div
        className={`mb-1 text-xs font-medium sm:text-sm ${
          todayDate
            ? "mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#2f6ea8] text-white"
            : ""
        }`}
      >
        {date}
      </div>
      <div className="space-y-1">
        {dayEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={(ev, e) => handleEventClick(ev, e)}
          />
        ))}
      </div>
    </div>
  );
}
