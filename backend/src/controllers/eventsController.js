import { generateMarketingPlan } from '../services/aiMarketingService.js';
import { buildContentPostDescription, createChildEvent, createMainEvent, deleteChildEventsByParent, deleteMainEvent, getCalendarClient, updateCalendarEvent } from '../services/googleCalendarService.js';
import { createEventRecord, deleteEventRecord, getEventById as getEventByIdService, getEventsByUser, setGoogleEventId, updateEventRecord } from '../services/eventService.js';
import { createContentPosts, deleteContentPost as deleteContentPostRecord, deleteContentPostsByEvent, getContentPostById, getContentPosts as getContentPostsService, updateContentPost as updateContentPostService } from '../services/contentPostService.js';
import { resolvePostDate } from '../utils/resolvePostDate.js';
import { supabase } from '../config/supabase.js';

const getClerkUserId = (req) => req.body?.clerkUserId || req.query?.clerkUserId;

// ── Helper: targetAudience normalize ────────────────────────────────────────
// Frontend එකෙන් array එකක් එනවා — DB save කරන්න string, AI-ට pass කරන්න array
const normalizeAudience = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') return [raw];
  return [];
};

export const getEvents = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req);
    console.log(`📥 getEvents — clerkUserId: ${clerkUserId || '❌ MISSING'} | body keys: ${Object.keys(req.body || {}).join(',') || 'none'}`);
    if (!clerkUserId) return res.status(400).json({ error: 'Missing clerkUserId' });
    const { data, error } = await getEventsByUser(clerkUserId);
    if (error) return res.status(500).json({ error: 'Failed to fetch events' });
    console.log(`📤 getEvents — returning ${data?.length ?? 0} events`);
    return res.status(200).json({ events: data || [] });
  } catch (err) { console.error('getEvents error:', err); return res.status(500).json({ error: 'Internal server error' }); }
};

export const getContentPosts = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req);
    if (!clerkUserId) return res.status(400).json({ error: 'Missing clerkUserId' });
    const { data, error } = await getContentPostsService(clerkUserId);
    if (error) return res.status(500).json({ error: 'Failed to fetch content posts' });
    return res.status(200).json({ posts: data || [] });
  } catch { return res.status(500).json({ error: 'Internal server error' }); }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = getClerkUserId(req);
    if (!clerkUserId) return res.status(400).json({ error: 'Missing clerkUserId' });
    if (!id) return res.status(400).json({ error: 'Missing event ID' });
    const { data, error } = await getEventByIdService(id, clerkUserId);
    if (error || !data) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json({ event: data });
  } catch { return res.status(500).json({ error: 'Internal server error' }); }
};

export const createEvent = async (req, res) => {
  const clerkUserId = getClerkUserId(req);
  const { eventName, eventTheme, location, eventDate, additionalInfo, duration } = req.body;

  // ── targetAudience: array normalize + validate ───────────────────────────
  const audienceArray = normalizeAudience(req.body.targetAudience);
  const audienceStr   = audienceArray.join(', ');   // DB + Calendar description-ට

  if (!clerkUserId || !eventName || !eventTheme || audienceArray.length === 0 || !location || !eventDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // AI-ට array pass කරනවා (buildPrompt multi-audience handle කරනවා)
    const marketingPlan = await generateMarketingPlan({
      eventName, eventTheme,
      targetAudience: audienceArray,   // ← array
      duration, location, eventDate, additionalInfo,
    });

    const eventDateISO  = new Date(eventDate).toISOString();
    const eventDateOnly = eventDateISO.split('T')[0];

    // DB-ට string save කරනවා
    const { data, error } = await createEventRecord({
      clerk_user_id:   clerkUserId,
      event_name:      eventName,
      event_theme:     eventTheme,
      target_audience: audienceStr,    // ← "Young Adults, Music Fans, General Public"
      location,
      event_date:      eventDateISO,
      additional_info: additionalInfo || null,
      marketing_plan:  marketingPlan,
    });

    if (error) return res.status(500).json({ error: 'Failed to save event', supabaseError: error.message });

    const savedEvent = data?.[0];
    if (!savedEvent) return res.status(500).json({ error: 'Event saved but no row returned' });

    let googleEventId = null;
    let calendarPostsSynced = 0;

    let calendarClient = null;
    try {
      calendarClient = await getCalendarClient(clerkUserId);
    } catch (e) {
      console.warn('⚠️ getCalendarClient threw — continuing without Google sync:', e.message);
    }

    if (calendarClient) {
      try {
        const mainRes = await createMainEvent(calendarClient, {
          summary:     `🎉 ${eventName}`,
          location,
          description: `Event Theme: ${eventTheme}\nTarget Audience: ${audienceStr}${additionalInfo ? `\nNotes: ${additionalInfo}` : ''}`,
          start: { date: eventDateOnly, timeZone: 'Asia/Colombo' },
          end:   { date: eventDateOnly, timeZone: 'Asia/Colombo' },
          colorId: '11',
        });
        googleEventId = mainRes.data.id;
        await setGoogleEventId(savedEvent.id, googleEventId);
      } catch (e) { console.error('⚠️ Main event Google sync error:', e.message); }
    }

    const weeks = marketingPlan?.weeklyContentCalendar || [];
    const totalWeeks = weeks.length;
    const contentPostsToInsert = [];

    for (const week of weeks) {
      for (const post of (week.posts || [])) {
        const postDate = resolvePostDate(eventDateOnly, week.week, post.day, totalWeeks);
        let postGoogleEventId = null;
        if (calendarClient) {
          try {
            const gRes = await createChildEvent(calendarClient, {
              summary: `${eventName} — ${post.type}`,
              description: buildContentPostDescription({
                weekTheme: week.theme, platform: post.platform, postType: post.type,
                contentDescription: post.contentDescription, caption: post.caption, hashtags: post.hashtags,
              }),
              start: { date: postDate, timeZone: 'Asia/Colombo' },
              end:   { date: postDate, timeZone: 'Asia/Colombo' },
              colorId: '2',
              extendedProperties: {
                private: { parentEventId: googleEventId || '', eventName, week: week.week, weekTheme: week.theme },
                shared:  { eventType: 'marketing_post' },
              },
            });
            postGoogleEventId = gRes.data.id;
            calendarPostsSynced++;
          } catch (e) { console.error(`⚠️ Post sync error (${week.week} ${post.day}):`, e.message); }
        }
        contentPostsToInsert.push({
          event_id: savedEvent.id, clerk_user_id: clerkUserId, post_date: postDate,
          week_label: week.week, week_theme: week.theme, day_label: post.day,
          platform: post.platform, post_type: post.type, content_description: post.contentDescription,
          caption: post.caption, hashtags: post.hashtags, google_event_id: postGoogleEventId,
        });
      }
    }

    if (contentPostsToInsert.length > 0) {
      const { error: postsError } = await createContentPosts(contentPostsToInsert);
      if (postsError) console.error('⚠️ content_posts insert error:', postsError.message);
    }

    return res.status(201).json({
      success: true,
      message: googleEventId
        ? `Event saved! Synced to Google Calendar with ${calendarPostsSynced} content posts.`
        : `Event saved! ${contentPostsToInsert.length} content posts saved to calendar.`,
      event: { ...savedEvent, eventName, eventTheme, targetAudience: audienceStr, location, eventDate },
      marketingPlan, googleEventId, calendarPostsSynced, contentPostsSaved: contentPostsToInsert.length,
    });
  } catch (err) {
    console.error('❌ Error in createEvent:', err);
    if (err.code === 'AI_PARSE_ERROR') return res.status(500).json({ error: 'AI returned unexpected format.' });
    if (err?.status === 401) return res.status(500).json({ error: 'Invalid OpenAI API key.' });
    if (err?.status === 429) return res.status(429).json({ error: 'Rate limit hit. Please try again.' });
    return res.status(500).json({ error: 'Failed to generate marketing plan.', details: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const clerkUserId = getClerkUserId(req);
    const { eventId, event_name, event_date, location, event_theme, description } = req.body;
    if (!clerkUserId || !eventId) return res.status(400).json({ error: 'Missing required fields' });

    const { data: existing, error: fetchErr } = await getEventByIdService(eventId, clerkUserId);
    if (fetchErr || !existing) return res.status(404).json({ error: 'Event not found or unauthorized' });

    const eventDateISO  = new Date(event_date).toISOString();
    const eventDateOnly = eventDateISO.split('T')[0];
    const { data: updated, error: updateErr } = await updateEventRecord(eventId, clerkUserId, {
      event_name, event_date: eventDateISO, location, event_theme, additional_info: description || null,
    });
    if (updateErr) return res.status(500).json({ error: 'Failed to update event', details: updateErr.message });

    let googleSynced = false;
    if (existing.google_event_id) {
      try {
        const cal = await getCalendarClient(clerkUserId);
        if (cal) {
          await updateCalendarEvent(cal, existing.google_event_id, {
            summary:     `🎉 ${event_name}`,
            location,
            description: `Event Theme: ${event_theme}${description ? `\nNotes: ${description}` : ''}`,
            start: { date: eventDateOnly, timeZone: 'Asia/Colombo' },
            end:   { date: eventDateOnly, timeZone: 'Asia/Colombo' },
          });
          googleSynced = true;
        }
      } catch (e) { console.warn('⚠️ Google patch error:', e.message); }
    }

    return res.status(200).json({ success: true, event: updated, googleEventId: existing.google_event_id, googleSynced });
  } catch (err) { return res.status(500).json({ error: 'Internal server error', details: err.message }); }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = getClerkUserId(req);
    if (!clerkUserId || !id) return res.status(400).json({ error: 'Missing required fields' });
    const { data: existing, error: fetchError } = await getEventByIdService(id, clerkUserId);
    if (fetchError || !existing) return res.status(404).json({ error: 'Event not found or unauthorized' });

    let calendarClient = null;
    try { calendarClient = await getCalendarClient(clerkUserId); } catch (e) { console.warn('⚠️ getCalendarClient error:', e.message); }

    let calendarPostsDeleted = 0;
    if (calendarClient && existing.google_event_id) {
      try { const result = await deleteChildEventsByParent(calendarClient, existing.google_event_id); calendarPostsDeleted = result.deletedCount; }
      catch (e) { console.warn('⚠️ Failed deleting linked calendar events:', e.message); }
    }

    const { data: deletedRows, error: postsDeleteError } = await deleteContentPostsByEvent(id, clerkUserId);
    if (postsDeleteError) console.error('⚠️ content_posts Supabase delete error:', postsDeleteError.message);
    const deletedWeeklyCount = deletedRows?.length ?? 0;

    const { error: deleteError } = await deleteEventRecord(id, clerkUserId);
    if (deleteError) return res.status(500).json({ error: 'Failed to delete event', details: deleteError.message });

    let googleDeleted = false;
    if (calendarClient && existing.google_event_id) {
      try { googleDeleted = await deleteMainEvent(calendarClient, existing.google_event_id); }
      catch (e) { console.warn('⚠️ Could not delete main event from Google Calendar:', e.message); }
    }

    return res.status(200).json({ success: true, message: 'Event deleted successfully', eventName: existing.event_name, deletedWeeklyContentCount: deletedWeeklyCount, calendarPostsDeleted, googleDeleted });
  } catch (err) { return res.status(500).json({ error: 'Internal server error', details: err.message }); }
};

export const updateContentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = getClerkUserId(req);
    const { caption, hashtags, content_description, platform, post_type, post_date } = req.body;
    if (!clerkUserId || !id) return res.status(400).json({ error: 'Missing required fields' });
    const { data: existing, error: fetchError } = await getContentPostById(id, clerkUserId);
    if (fetchError || !existing) return res.status(404).json({ error: 'Content post not found or unauthorized' });

    const { data: eventData } = await supabase.from('events').select('event_name').eq('id', existing.event_id).single();
    const updates = {};
    if (caption !== undefined) updates.caption = caption;
    if (hashtags !== undefined) updates.hashtags = hashtags;
    if (content_description !== undefined) updates.content_description = content_description;
    if (platform !== undefined) updates.platform = platform;
    if (post_type !== undefined) updates.post_type = post_type;
    if (post_date !== undefined) updates.post_date = post_date;

    const { data: updated, error: updateError } = await updateContentPostService(id, clerkUserId, updates);
    if (updateError) return res.status(500).json({ error: 'Failed to update content post', details: updateError.message });

    let googleSynced = false;
    if (existing.google_event_id) {
      try {
        const calendarClient = await getCalendarClient(clerkUserId);
        if (calendarClient) {
          const patchBody = {
            summary:     `${eventData?.event_name || 'Event'} — ${updated.post_type}`,
            description: buildContentPostDescription({ weekTheme: updated.week_theme || '', platform: updated.platform, postType: updated.post_type, contentDescription: updated.content_description, caption: updated.caption, hashtags: updated.hashtags }),
          };
          if (post_date) { patchBody.start = { date: post_date, timeZone: 'Asia/Colombo' }; patchBody.end = { date: post_date, timeZone: 'Asia/Colombo' }; }
          await updateCalendarEvent(calendarClient, existing.google_event_id, patchBody);
          googleSynced = true;
        }
      } catch (e) { console.warn('⚠️ Google Calendar patch error:', e.message); }
    }

    return res.status(200).json({ success: true, message: googleSynced ? 'Content post updated & synced to Google Calendar' : 'Content post updated', post: updated, googleSynced });
  } catch (err) { return res.status(500).json({ error: 'Internal server error', details: err.message }); }
};

export const deleteContentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const clerkUserId = getClerkUserId(req);
    if (!clerkUserId || !id) return res.status(400).json({ error: 'Missing required fields' });
    const { data: existing, error: fetchError } = await getContentPostById(id, clerkUserId);
    if (fetchError || !existing) return res.status(404).json({ error: 'Content post not found or unauthorized' });
    const { error: deleteError } = await deleteContentPostRecord(id, clerkUserId);
    if (deleteError) return res.status(500).json({ error: 'Failed to delete content post', details: deleteError.message });

    let googleDeleted = false;
    if (existing.google_event_id) {
      try { const calendarClient = await getCalendarClient(clerkUserId); if (calendarClient) { await deleteMainEvent(calendarClient, existing.google_event_id); googleDeleted = true; } }
      catch (e) { console.warn('⚠️ Google Calendar delete error:', e.message); }
    }

    return res.status(200).json({ success: true, message: googleDeleted ? 'Content post deleted from app & Google Calendar' : 'Content post deleted', googleDeleted });
  } catch (err) { return res.status(500).json({ error: 'Internal server error', details: err.message }); }
};