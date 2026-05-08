import { BackendContentPost, BackendEvent, NewEventData } from '@/types/calendar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getGoogleStatus(clerkUserId: string) {
  const res = await fetch(`${API_BASE}/api/google/status?clerkUserId=${clerkUserId}`);
  return res.json() as Promise<{ connected: boolean }>;
}

export async function disconnectGoogle(clerkUserId: string) {
  return fetch(`${API_BASE}/api/google/disconnect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerkUserId }),
  });
}

export function getGoogleConnectUrl(clerkUserId: string) {
  return `${API_BASE}/auth/google?clerkUserId=${clerkUserId}`;
}

export async function fetchEvents(clerkUserId: string) {
  const res = await fetch(`${API_BASE}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerkUserId }),
  });
  const data = await res.json();
  return { res, data: data as { events: BackendEvent[] } };
}

export async function fetchContentPosts(clerkUserId: string) {
  const res = await fetch(`${API_BASE}/api/content-posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerkUserId }),
  });
  const data = await res.json();
  return { res, data: data as { posts: BackendContentPost[] } };
}

export async function createEvent(clerkUserId: string, newEvent: NewEventData, selectedDate: Date) {
  const res = await fetch(`${API_BASE}/api/events/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clerkUserId,
      eventName: newEvent.title,
      eventTheme: newEvent.category || 'General',
      targetAudience: newEvent.participants || 'General Audience',
      location: newEvent.location || 'TBD',
      eventDate: selectedDate.toISOString().split('T')[0],
      additionalInfo: newEvent.description || '',
    }),
  });
  return { res, data: await res.json() };
}

export async function updateEvent(clerkUserId: string, eventId: string, newEvent: NewEventData, selectedDate: Date) {
  const res = await fetch(`${API_BASE}/api/events/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clerkUserId,
      eventId,
      event_name: newEvent.title,
      event_date: selectedDate.toISOString().split('T')[0],
      location: newEvent.location,
      event_theme: newEvent.category,
      description: newEvent.description,
      participants: newEvent.participants,
      start_time: newEvent.allDay ? null : newEvent.startTime,
      end_time: newEvent.allDay ? null : newEvent.endTime,
      all_day: newEvent.allDay,
    }),
  });
  return { res, data: await res.json() };
}

export async function deleteEvent(clerkUserId: string, eventId: string) {
  const res = await fetch(`${API_BASE}/api/events/${eventId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clerkUserId }),
  });
  return { res, data: await res.json() };
}
