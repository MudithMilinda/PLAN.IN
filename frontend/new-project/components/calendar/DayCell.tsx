import { CalendarEvent } from '@/types/calendar';
import type { MouseEvent } from 'react';
import { isToday, sameDay } from '@/utils/calendarHelpers';
import { EventCard } from './EventCard';

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
      className={`border-r border-b border-gray-200 p-2 min-h-32 cursor-pointer hover:bg-gray-50 transition-colors
        ${selected ? 'bg-indigo-50 border-2 border-indigo-400' : 'bg-white'}
        ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}`}
    >
      <div
        className={`text-sm font-medium mb-1 ${
          todayDate
            ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto'
            : ''
        }`}
      >
        {date}
      </div>
      <div className="space-y-1">
        {dayEvents.map((event) => (
          <EventCard key={event.id} event={event} onClick={(ev, e) => handleEventClick(ev, e)} />
        ))}
      </div>
    </div>
  );
}