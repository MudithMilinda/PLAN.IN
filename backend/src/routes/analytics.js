import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.post("/analytics", async (req, res) => {
  try {
    const { clerkUserId } = req.body || {};

    if (!clerkUserId) {
      return res.status(400).json({ error: "Missing clerkUserId" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString();

    const { count: totalEvents, error: totalErr } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("clerk_user_id", clerkUserId);

    if (totalErr) throw totalErr;

    const { count: ongoingEvents, error: ongoingErr } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("clerk_user_id", clerkUserId)
      .gte("event_date", today.toISOString());

    if (ongoingErr) throw ongoingErr;

    const { count: monthlyEvents, error: monthlyErr } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("clerk_user_id", clerkUserId)
      .gte("event_date", monthStart)
      .lt("event_date", monthEnd);

    if (monthlyErr) throw monthlyErr;

    const { count: plannedPosts, error: postsErr } = await supabase
      .from("content_posts")
      .select("id", { count: "exact", head: true })
      .eq("clerk_user_id", clerkUserId);

    if (postsErr) throw postsErr;

    const total = totalEvents || 0;
    const ongoing = ongoingEvents || 0;
    const monthly = monthlyEvents || 0;
    const posts = plannedPosts || 0;

    const ongoingPct = total > 0 ? Math.round((ongoing / total) * 100) : 0;
    const monthlyPct = total > 0 ? Math.round((monthly / total) * 100) : 0;
    const contentReadinessPct = total > 0 ? Math.min(100, Math.round((posts / total) * 10)) : 0;

    const metrics = [
      {
        label: "Ongoing Events",
        sub: "Active from today onward",
        pct: ongoingPct,
        color: "#2f6ea8",
      },
      {
        label: "This Month",
        sub: "Events scheduled this month",
        pct: monthlyPct,
        color: "#3aab73",
      },
      {
        label: "Content Readiness",
        sub: "Planned posts per event ratio",
        pct: contentReadinessPct,
        color: "#6b7280",
      },
    ];

    const overall = Math.round(metrics.reduce((sum, item) => sum + item.pct, 0) / metrics.length);

    return res.status(200).json({ overall, metrics });
  } catch (err) {
    console.error("Analytics route error:", err);
    return res.status(500).json({ error: "Failed to load analytics" });
  }
});

export default router;
