import { supabase } from '../config/supabase.js';

export const getUserProfile = async (req, res) => {
  try {
    const clerkUserId = req.body?.clerkUserId || req.query?.clerkUserId;
    if (!clerkUserId) return res.status(400).json({ error: 'Missing clerkUserId' });

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    return res.status(200).json({ profile: data || null });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

export const upsertUserProfile = async (req, res) => {
  try {
    const { clerkUserId, ...profileData } = req.body || {};
    if (!clerkUserId) return res.status(400).json({ error: 'Missing clerkUserId' });

    const payload = {
      clerk_user_id: clerkUserId,
      ...profileData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'clerk_user_id' })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Failed to save profile' });

    return res.status(200).json({ success: true, profile: data });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
