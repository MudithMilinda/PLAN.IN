import {
  Calendar,
  Loader2,
  MapPin,
  Trash2,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { MutableRefObject } from "react";
import { BackendEvent, SyncMessage } from "@/types/calendar";
import { toNoon } from "@/utils/calendarHelpers";
import { MiniCalendar } from "./MiniCalendar";

interface CalendarSidebarProps {
  syncMessage: SyncMessage | null;
  googleConnected: boolean;
  googleLoading: boolean;
  loadingEvents: boolean;
  backendEvents: BackendEvent[];
  deletingId: string | null;
  currentDate: Date;
  miniDays: { date: number; isCurrentMonth: boolean; fullDate: Date }[];
  dayRefs: MutableRefObject<Record<string, HTMLDivElement | null>>;
  onGoogleConnect: () => void;
  onGoogleDisconnect: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateClick: (date: Date) => void;
  onDeleteEvent: (id: string) => void;
  onNavigateEventDate: (d: Date) => void;
}

export function CalendarSidebar({
  syncMessage,
  googleConnected,
  googleLoading,
  loadingEvents,
  backendEvents,
  deletingId,
  currentDate,
  miniDays,
  dayRefs,
  onGoogleConnect,
  onGoogleDisconnect,
  onPrevMonth,
  onNextMonth,
  onDateClick,
  onDeleteEvent,
  onNavigateEventDate,
}: CalendarSidebarProps) {
  return (
    <div className="flex w-64 flex-col gap-3 bg-[#0b1d33] p-4">
      {syncMessage && (
        <div
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-medium ${syncMessage.type === "success" ? "bg-green-800 text-green-100" : "bg-red-800 text-red-100"}`}
        >
          {syncMessage.type === "success" ? (
            <Wifi className="mt-0.5 h-3 w-3 shrink-0" />
          ) : (
            <WifiOff className="mt-0.5 h-3 w-3 shrink-0" />
          )}
          {syncMessage.text}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {googleConnected ? (
          <>
            <div className="flex items-center gap-2 rounded-xl border border-green-600/40 bg-green-800/40 px-3 py-2 text-xs font-medium text-green-300">
              <Calendar className="h-3.5 w-3.5" />
              Google Calendar connected
            </div>
            <button
              onClick={onGoogleDisconnect}
              className="flex items-center gap-2 rounded-xl border border-red-600/40 bg-red-800/40 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-700/40"
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={onGoogleConnect}
            disabled={googleLoading}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-sm transition-all hover:bg-gray-100 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
            )}
            Connect Google Calendar
          </button>
        )}
      </div>

      <MiniCalendar
        currentDate={currentDate}
        miniDays={miniDays}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onDateClick={onDateClick}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="mb-2 text-xs font-semibold text-[#9ec9e6]">
          MY EVENTS 📅
        </div>
        {loadingEvents ? (
          <div className="flex items-center gap-2 text-sm text-[#9ec9e6]">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : backendEvents.length > 0 ? (
          <div className="space-y-2">
            {backendEvents.map((event) => (
              <div
                key={event.id}
                className="group relative flex cursor-pointer flex-col gap-1 rounded-lg bg-[#15314d]/50 px-3 py-2 transition hover:bg-[#1c3a59]"
              >
                <div
                  onClick={() => {
                    const d = toNoon(new Date(event.event_date));
                    onNavigateEventDate(d);
                    setTimeout(() => {
                      dayRefs.current[d.toDateString()]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }, 100);
                  }}
                  className="flex items-start justify-between gap-1"
                >
                  <span className="text-sm font-bold text-white transition-all group-hover:bg-gradient-to-r group-hover:from-[#7eb6de] group-hover:to-[#9bccea] group-hover:bg-clip-text group-hover:text-transparent">
                    {event.event_name}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    {event.google_event_id && (
                      <span title="Synced to Google Calendar">
                        <Calendar className="h-3 w-3 text-green-400" />
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEvent(event.id);
                      }}
                      disabled={deletingId === event.id}
                      title="Delete event"
                      className="rounded p-0.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-600/40"
                    >
                      {deletingId === event.id ? (
                        <Loader2 className="h-3 w-3 animate-spin text-red-400" />
                      ) : (
                        <Trash2 className="h-3 w-3 text-red-400" />
                      )}
                    </button>
                  </div>
                </div>
                <span className="text-xs text-[#9ec9e6]">
                  {new Date(event.event_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {event.location && (
                  <span className="flex items-center gap-1 text-xs text-[#84b8dd]">
                    <MapPin className="h-3 w-3" />
                    {(() => {
                      try {
                        const parsed = JSON.parse(event.location);
                        return parsed.venue ?? event.location;
                      } catch {
                        return event.location;
                      }
                    })()}
                  </span>
                )}
                {event.event_theme && (
                  <span className="flex items-center gap-1 text-xs text-[#84b8dd]">
                    <Users className="h-3 w-3" />
                    {event.event_theme}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#84b8dd]">No events yet</p>
        )}
      </div>
    </div>
  );
}
