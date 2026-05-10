"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { EventPopup } from "@/components/calendar/EventPopup";
import { useCalendarEvents } from "@/hooks/useCalendarEvents";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import type { CalendarEvent } from "@/types/calendar";
import { getDaysInMonth } from "@/utils/calendarHelpers";

export default function CalendarPage() {
  const { user } = useUser();
  const dayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Popup state
  const [popupEvent, setPopupEvent] = useState<CalendarEvent | null>(null);
  const [popupRect, setPopupRect] = useState<DOMRect | null>(null);

  const {
    currentDate,
    selectedDate,
    setCurrentDate,
    setSelectedDate,
    prevMonth,
    nextMonth,
    goToday,
    selectDate,
  } = useCalendarNavigation();
  const {
    backendEvents,
    loadingEvents,
    deletingId,
    syncMessage,
    setSyncMessage,
    refreshEvents,
    removeEvent,
    getEventsForDate,
  } = useCalendarEvents(user?.id);

  const {
    googleConnected,
    googleLoading,
    checkGoogleStatus,
    handleGoogleConnect,
    handleGoogleDisconnect,
  } = useGoogleCalendar(user?.id);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("google_connected");

    if (connected === "true") {
      setSyncMessage({
        type: "success",
        text: "✅ Google Calendar connected!",
      });
      setTimeout(() => setSyncMessage(null), 4000);
      window.history.replaceState({}, "", "/calendar");
    } else if (connected === "false") {
      setSyncMessage({
        type: "error",
        text: "Google Calendar connection failed. Try again.",
      });
      setTimeout(() => setSyncMessage(null), 5000);
      window.history.replaceState({}, "", "/calendar");
    }

    checkGoogleStatus();
  }, [checkGoogleStatus, setSyncMessage]);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);
  const miniDays = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  const closePopup = () => {
    setPopupEvent(null);
    setPopupRect(null);
  };

  const handleDateClick = (date: Date) => {
    closePopup();
    selectDate(date);
  };

  // Called from CalendarGrid/DayCell — receives the card's DOMRect
  const handleGridEventClick = (event: CalendarEvent, rect: DOMRect) => {
    // Toggle: clicking the same event closes the popup
    if (popupEvent?.id === event.id) {
      closePopup();
      return;
    }
    setPopupEvent(event);
    setPopupRect(rect);
  };

  // Delete button inside the popup
  const handlePopupDelete = async (id: string) => {
    await removeEvent(id);
    closePopup();
  };

  return (
    <SidebarDemo>
      <div className="flex h-auto min-h-screen flex-col bg-white lg:h-screen lg:flex-row">
        <CalendarSidebar
          syncMessage={syncMessage}
          googleConnected={googleConnected}
          googleLoading={googleLoading}
          loadingEvents={loadingEvents}
          backendEvents={backendEvents}
          deletingId={deletingId}
          currentDate={currentDate}
          miniDays={miniDays}
          dayRefs={dayRefs}
          onGoogleConnect={handleGoogleConnect}
          onGoogleDisconnect={() => handleGoogleDisconnect(setSyncMessage)}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onDateClick={handleDateClick}
          onDeleteEvent={removeEvent}
          onNavigateEventDate={(d) => {
            setCurrentDate(d);
            setSelectedDate(d);
          }}
        />

        <div className="flex min-h-[70vh] flex-1 flex-col bg-white">
          <CalendarHeader
            currentDate={currentDate}
            googleConnected={googleConnected}
            onToday={goToday}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
          />
          <CalendarGrid
            days={days}
            selectedDate={selectedDate}
            getEventsForDate={getEventsForDate}
            dayRefs={dayRefs}
            onDateClick={handleDateClick}
            onEventClick={handleGridEventClick}
          />
        </div>

        {/* Google Calendar style floating popup */}
        {popupEvent && popupRect && (
          <EventPopup
            event={popupEvent}
            anchorRect={popupRect}
            onClose={closePopup}
            onDelete={handlePopupDelete}
            deletingId={deletingId}
          />
        )}
      </div>
    </SidebarDemo>
  );
}
