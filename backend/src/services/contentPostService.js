import { supabase } from '../config/supabase.js';

export async function getContentPosts(clerkUserId) {
  const postsQuery = await supabase
    .from('content_posts')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('post_date', { ascending: true });

  if (postsQuery.error || !postsQuery.data?.length) return postsQuery;

  const eventIds = [...new Set(postsQuery.data.map((p) => p.event_id).filter(Boolean))];
  if (!eventIds.length) return postsQuery;

  const eventsQuery = await supabase
    .from('events')
    .select('id, event_name, event_theme')
    .in('id', eventIds);

  if (eventsQuery.error) return postsQuery;

  const eventById = new Map((eventsQuery.data || []).map((e) => [e.id, e]));
  const merged = postsQuery.data.map((post) => ({
    ...post,
    event_name: eventById.get(post.event_id)?.event_name || null,
    event_theme: eventById.get(post.event_id)?.event_theme || null,
  }));

  return { data: merged, error: null };
}

export async function createContentPosts(rows) {
  return supabase
    .from('content_posts')
    .insert(rows);
}

export async function getContentPostById(id, clerkUserId) {
  return supabase
    .from('content_posts')
    .select('id, google_event_id, event_id, clerk_user_id, week_theme, platform, post_type, content_description, caption, hashtags')
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)
    .single();
}

export async function updateContentPost(id, clerkUserId, updates) {
  return supabase
    .from('content_posts')
    .update(updates)
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId)
    .select()
    .single();
}

export async function deleteContentPost(id, clerkUserId) {
  return supabase
    .from('content_posts')
    .delete()
    .eq('id', id)
    .eq('clerk_user_id', clerkUserId);
}

export async function deleteContentPostsByEvent(eventId, clerkUserId) {
  return supabase
    .from('content_posts')
    .delete()
    .eq('event_id', eventId)
    .eq('clerk_user_id', clerkUserId)
    .select('id');
}
