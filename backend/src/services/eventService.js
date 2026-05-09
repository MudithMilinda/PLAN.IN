import { supabase } from '../config/supabase.js';

export async function getEventsByUser(clerkUserId) {
  return supabase
    .from('events')
    .select('id, event_name, event_theme, target_audience, location, event_date, marketing_plan, google_event_id')
    .eq('clerk_user_id', clerkUserId)
    .order('event_date', { ascending: false });
}

export async function getEventById(eventId, clerkUserId) {
  return supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('clerk_user_id', clerkUserId)
    .single();
}

export async function createEventRecord(payload) {
  return supabase
    .from('events')
    .insert([payload])
    .select();
}

export async function updateEventRecord(eventId, clerkUserId, updates) {
  return supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .eq('clerk_user_id', clerkUserId)
    .select()
    .single();
}

export async function setGoogleEventId(eventId, googleEventId) {
  return supabase
    .from('events')
    .update({ google_event_id: googleEventId })
    .eq('id', eventId);
}

export async function deleteEventRecord(eventId, clerkUserId) {
  return supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('clerk_user_id', clerkUserId);
}

//Total event count
export async function getTotalEventCount() {
  return supabase
    .from('events')
    .select('*', { count: 'exact', head: true });
}