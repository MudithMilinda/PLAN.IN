import { Calendar, Edit2 } from "lucide-react";
import type { MouseEvent } from "react";
import { CALENDARS } from "@/utils/calendarHelpers";
import { CalendarEvent } from "@/types/calendar";

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent, e: MouseEvent) => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const cal = CALENDARS.find((c) => c.id === event.calendar);
  const isContentPost = event.isContentPost;
  const eventClass = isContentPost
    ? "bg-emerald-500 border-l-4 border-blue-500 text-white"
    : `${cal?.color || "bg-[#2f6ea8]"} text-white`;

  return (
    <div
      onClick={(e) => onClick(event, e)}
      title={
        isContentPost
          ? `${event.title}\n${event.weekLabel} · ${event.weekTheme}\nClick to edit or delete`
          : `${event.title} • ${event.location} • ${event.category}`
      }
      className={`flex items-center gap-1 truncate rounded-md px-2 py-1 text-xs font-medium shadow-sm transition ${eventClass} cursor-pointer hover:brightness-110`}
    >
      <span className="truncate">
        {event.allDay
          ? event.title.slice(0, 18) + (event.title.length > 18 ? "…" : "")
          : `${event.startTime} ${event.title.slice(0, 15)}${event.title.length > 15 ? "…" : ""}`}
      </span>
      {isContentPost && <Edit2 className="h-2.5 w-2.5 shrink-0 opacity-70" />}
      {!isContentPost && event.googleEventId && (
        <Calendar className="h-2.5 w-2.5 shrink-0 opacity-80" />
      )}
    </div>
  );
}
