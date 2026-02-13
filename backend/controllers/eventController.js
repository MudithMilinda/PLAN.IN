import { supabase } from '../supabaseClient.js';

// Get events for a specific user
export const getEvents = async (req, res) => {
  try {
    const { clerkUserId } = req.body;

    if (!clerkUserId) {
      return res.status(400).json({ error: 'Missing clerkUserId' });
    }

    // Fetch events for this user from Supabase
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    res.status(200).json({ events: data || [] });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new event
export const createEvent = async (req, res) => {
  const {
    clerkUserId,
    eventName,
    eventTheme,
    targetAudience,
    location,
    eventDate,
    additionalInfo,
  } = req.body;

  if (
    !clerkUserId ||
    !eventName ||
    !eventTheme ||
    !targetAudience ||
    !location ||
    !eventDate
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase.from('events').insert([
    {
      clerk_user_id: clerkUserId,
      event_name: eventName,
      event_theme: eventTheme,
      target_audience: targetAudience,
      location,
      event_date: eventDate,
      additional_info: additionalInfo || null,
    },
  ]);

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to save event' });
  }

  res.status(201).json({ message: 'Event saved successfully', data });
};