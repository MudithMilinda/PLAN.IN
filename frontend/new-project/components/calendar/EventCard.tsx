import { Calendar, Edit2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { CALENDARS } from '@/utils/calendarHelpers';
import { CalendarEvent } from '@/types/calendar';

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const cal = CALENDARS.find((c) => c.id === event.calendar);
  const isContentPost = event.isContentPost;
  const eventClass = isContentPost ? 'bg-emerald-500 border-l-4 border-blue-500 text-white' : `${cal?.color || 'bg-indigo-600'} text-white`;

  return (
    <div
      onClick={(e) => onClick(event, e)}
      title={isContentPost ? `${event.title}\n${event.weekLabel} · ${event.weekTheme}\nClick to edit or delete` : `${event.title} • ${event.location} • ${event.category}`}
      className={`text-xs px-2 py-1 rounded-md font-medium shadow-sm truncate transition flex items-center gap-1 ${eventClass} hover:brightness-110 cursor-pointer`}
    >
      <span className="truncate">
        {event.allDay
          ? event.title.slice(0, 18) + (event.title.length > 18 ? '…' : '')
          : `${event.startTime} ${event.title.slice(0, 15)}${event.title.length > 15 ? '…' : ''}`}
      </span>
      {isContentPost && <Edit2 className="w-2.5 h-2.5 shrink-0 opacity-70" />}
      {!isContentPost && event.googleEventId && <Calendar className="w-2.5 h-2.5 shrink-0 opacity-80" />}
    </div>
  );
}
