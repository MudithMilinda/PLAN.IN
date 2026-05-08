import { type MouseEvent, useCallback, useState } from "react";
import {
  createEvent,
  deleteEvent,
  fetchContentPosts,
  fetchEvents,
  updateEvent,
} from "@/services/calendarApi";
import {
  BackendEvent,
  CalendarEvent,
  NewEventData,
  SyncMessage,
} from "@/types/calendar";
import { getOverlapEvent, sameDay } from "@/utils/calendarHelpers";

const EMPTY_EVENT: NewEventData = {
  title: "",
  startTime: "",
  endTime: "",
  allDay: false,
  calendar: "my-calendar",
  participants: "",
  location: "",
  description: "",
  category: "",
};

export function useCalendarEvents(userId?: string | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [backendEvents, setBackendEvents] = useState<BackendEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [newEvent, setNewEvent] = useState<NewEventData>(EMPTY_EVENT);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingEvent, setSavingEvent] = useState(false);
  const [overlapWarning, setOverlapWarning] = useState<CalendarEvent | null>(
    null,
  );
  const [syncMessage, setSyncMessage] = useState<SyncMessage | null>(null);

  const refreshEvents = useCallback(async () => {
    if (!userId) {
      setLoadingEvents(false);
      return;
    }

    try {
      const [eventsPayload, postsPayload] = await Promise.all([
        fetchEvents(userId),
        fetchContentPosts(userId),
      ]);
      if (eventsPayload.res.ok) {
        const mainEvents: CalendarEvent[] = (
          eventsPayload.data.events || []
        ).map((e) => ({
          id: e.id,
          title: e.event_name,
          date: new Date(e.event_date),
          startTime: "09:00",
          endTime: "10:00",
          allDay: true,
          calendar: "my-calendar",
          participants: "",
          location: e.location || "",
          description: "",
          category: e.event_theme || "",
          googleEventId: e.google_event_id,
          isContentPost: false,
        }));

        const contentPostEvents: CalendarEvent[] = postsPayload.res.ok
          ? (postsPayload.data.posts || []).map((post) => ({
              id: `content-${post.id}`,
              rawPostId: post.id,
              title: `${post.event_name || post.platform} — ${post.post_type}`,
              date: new Date(post.post_date),
              startTime: "09:00",
              endTime: "09:30",
              allDay: true,
              calendar: "important",
              participants: "",
              location: post.week_label || "",
              description: post.caption || post.content_description || "",
              category: `Weekly Content • ${post.week_theme || ""}`,
              googleEventId: post.google_event_id,
              isContentPost: true,
              platform: post.platform,
              postType: post.post_type,
              caption: post.caption,
              hashtags: post.hashtags,
              weekLabel: post.week_label,
              weekTheme: post.week_theme,
            }))
          : [];

        setBackendEvents(eventsPayload.data.events || []);
        setEvents([...mainEvents, ...contentPostEvents]);
      }
    } catch (err) {
      console.error("Fetch events error:", err);
    } finally {
      setLoadingEvents(false);
    }
  }, [userId]);

  const saveEvent = async (
    selectedDate: Date | null,
    googleConnected: boolean,
  ) => {
    if (!userId || !newEvent.title || !selectedDate) return false;

    if (!newEvent.allDay) {
      const overlap = getOverlapEvent(newEvent, selectedDate, events);
      if (overlap && overlap.id !== editingEventId) {
        setOverlapWarning(overlap);
        return false;
      }
    }

    setSavingEvent(true);
    setSyncMessage(null);

    try {
      const isEdit = !!editingEventId;
      const { res, data } = isEdit
        ? await updateEvent(userId, editingEventId, newEvent, selectedDate)
        : await createEvent(userId, newEvent, selectedDate);

      if (!res.ok) throw new Error(data.error || "Save failed");
      await refreshEvents();

      if (googleConnected && data.googleEventId) {
        const posts = data.calendarPostsSynced ?? 0;
        setSyncMessage({
          type: "success",
          text: `✓ Saved & synced to Google Calendar${posts > 0 ? ` + ${posts} content posts added` : ""}`,
        });
      } else if (isEdit && googleConnected) {
        setSyncMessage({ type: "success", text: "✓ Event updated" });
      } else {
        setSyncMessage({ type: "success", text: "✓ Event saved" });
      }
      setTimeout(() => setSyncMessage(null), 5000);

      setEditingEventId(null);
      setOverlapWarning(null);
      setNewEvent({ ...EMPTY_EVENT, calendar: "my-calendar" });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setSyncMessage({ type: "error", text: `Error: ${message}` });
      return false;
    } finally {
      setSavingEvent(false);
    }
  };

  const removeEvent = async (eventId: string) => {
    if (!userId) return;
    setDeletingId(eventId);
    try {
      const { res, data } = await deleteEvent(userId, eventId);
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setEvents((prev) =>
        prev.filter((e) => e.id !== eventId && e.id !== `content-${eventId}`),
      );
      setBackendEvents((prev) => prev.filter((e) => e.id !== eventId));
      setSyncMessage({
        type: "success",
        text: data.googleDeleted
          ? "🗑️ Deleted from app & Google Calendar"
          : "🗑️ Event deleted",
      });
      setTimeout(() => setSyncMessage(null), 4000);
      setEditingEventId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setSyncMessage({ type: "error", text: `Delete failed: ${message}` });
    } finally {
      setDeletingId(null);
    }
  };

  const startEditEvent = (event: CalendarEvent, e: MouseEvent) => {
    e.stopPropagation();
    setNewEvent({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      allDay: event.allDay,
      calendar: event.calendar,
      participants: event.participants || "",
      location: event.location || "",
      description: event.description || "",
      category: event.category || "",
    });
    setEditingEventId(event.id);
    setOverlapWarning(null);
  };

  const getEventsForDate = (date: Date) =>
    events.filter((e) => sameDay(new Date(e.date), date));

  return {
    events,
    backendEvents,
    loadingEvents,
    newEvent,
    setNewEvent,
    editingEventId,
    setEditingEventId,
    deletingId,
    savingEvent,
    overlapWarning,
    setOverlapWarning,
    syncMessage,
    setSyncMessage,
    refreshEvents,
    saveEvent,
    removeEvent,
    startEditEvent,
    getEventsForDate,
    emptyEvent: EMPTY_EVENT,
  };
}
