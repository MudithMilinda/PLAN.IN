"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { MapPin, TrendingUp, Activity } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */
interface EventItem {
  id: string;
  event_name: string;
  location: string;
  event_date: string;
}

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  telegramUrl: string;
}

interface InsightMetric {
  label: string;
  sub: string;
  pct: number;
  color: string;
}

interface AnalyticsData {
  overall: number;
  metrics: InsightMetric[];
}

function getVenueOnly(location: string) {
  if (!location) return "Location TBD";
  try {
    const parsed = JSON.parse(location);
    if (parsed && typeof parsed === "object" && "venue" in parsed) {
      return String((parsed as { venue?: string }).venue || "Location TBD");
    }
  } catch {
    // Keep fallback behavior for plain-text locations.
  }
  return location;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

/** Live clock + greeting hero card */
function HeroCard({ name }: { name: string }) {
  const now = useClock();
  const h = now.getHours();
  const greeting =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#284764] bg-slate-800/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:p-8">
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#1a5a8a]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#0d3a60]/30 blur-2xl" />

      <div className="relative flex flex-col gap-1">
        <p className="text-sm font-medium tracking-wide text-[#7ab3d4]">
          {greeting},{" "}
          <span className="font-semibold text-white">{name || "Creator"}</span>{" "}
          🚀
        </p>
        <p className="text-xs text-[#4d7a9a]">
          Ready to make today productive!
        </p>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <span className="text-5xl leading-none font-bold text-white tabular-nums">
              {String(h % 12 || 12).padStart(2, "0")}:
              {String(now.getMinutes()).padStart(2, "0")}
            </span>
            <span className="ml-2 text-xl font-medium text-[#7ab3d4]">
              {h >= 12 ? "PM" : "AM"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-green-500/35 bg-green-600/15 px-3.5 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-[10px] font-semibold tracking-widest text-green-400">
              LIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Square summary card — icon top-left, content bottom */
function EventSummaryCard({
  icon: Icon,
  title,
  value,
  badge,
  badgeClassName,
  description,
  iconWrapClassName,
}: {
  icon: React.ElementType;
  title: string;
  value: number;
  badge: string;
  badgeClassName: string;
  description: string;
  iconWrapClassName: string;
}) {
  return (
    <div className="flex aspect-square flex-col rounded-[1.25rem] border border-[#1e3a56] bg-slate-800/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Icon top-left */}
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${iconWrapClassName}`}
      >
        <Icon className="h-5 w-5 text-[#b8dbf2]" />
      </div>

      {/* Content pushed to bottom */}
      <div className="mt-auto">
        <p className="mb-3 text-[15px] font-semibold text-[#a8c7e8]">{title}</p>
        <div className="mb-3 flex items-center gap-2.5">
          <span className="text-5xl leading-none font-bold text-white tabular-nums">
            {value}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-[13px] font-semibold ${badgeClassName}`}
          >
            {badge}
          </span>
        </div>
        <p className="text-[13px] leading-relaxed text-[#6a90b0]">
          {description}
        </p>
      </div>
    </div>
  );
}

/** Ongoing events list in the former quick tasks card */
function QuickTasks({
  events,
  onOpenEvent,
}: {
  events: EventItem[];
  onOpenEvent: (id: string) => void;
}) {
  const ongoing = useMemo(
    () =>
      events
        .filter((e) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const d = new Date(e.event_date);
          d.setHours(0, 0, 0, 0);
          return d >= today;
        })
        .sort(
          (a, b) =>
            new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
        ),
    [events],
  );
  const shown = ongoing.slice(0, 6);

  return (
    <div className="min-h-[450px] rounded-3xl border border-[#284764] bg-slate-800/40 p-5 shadow-[0_20px_60px_rgba(8,8,40,0.45)]">
      <div className="mt-1 mb-4 flex items-center justify-between gap-4">
        <p className="text-xl font-bold text-white">Ongoing Events</p>
        <span className="rounded-full bg-[#1a3554] px-3 py-1 text-xs text-[#add3ee]">
          {ongoing.length} total
        </span>
      </div>
      <hr className="mb-4 border-white/10" />

      <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {shown.map((event) => (
          <li key={event.id}>
            <button
              onClick={() => onOpenEvent(event.id)}
              className="w-full rounded-2xl border border-[#2a4366] bg-[#1a2a44] px-3 py-3 text-left transition-colors hover:border-[#5e87b6] hover:bg-[#1f3251]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[#2F6EA8] text-white">
                  <span className="text-[10px] leading-none font-bold tracking-wide text-[#dbe2ff] uppercase">
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      month: "short",
                    })}
                  </span>
                  <span className="mt-0.5 text-lg leading-none font-extrabold">
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                    })}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base leading-tight font-semibold text-white md:text-lg">
                    {event.event_name}
                  </p>
                  <p className="mt-1 flex items-center gap-1 truncate text-sm text-[#aeb8cd]">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8cc1e6]" />
                    {getVenueOnly(event.location)}
                  </p>
                </div>
              </div>
            </button>
          </li>
        ))}
        {shown.length === 0 && (
          <li className="py-4 text-center text-xs text-[#4d7a9a]">
            No events yet.
          </li>
        )}
      </ul>
    </div>
  );
}

/** Insights / donut chart (pure CSS) */
function InsightsCard({ analytics }: { analytics: AnalyticsData }) {
  const r = 54;

  return (
    <div className="rounded-3xl border border-[#284764] bg-slate-800/40 p-5 shadow-[0_20px_60px_rgba(8,8,40,0.45)]">
      <p className="text-base font-bold text-white">Insights</p>
      <p className="mb-4 text-xs text-[#4d7a9a]">Performance analytics</p>

      <div className="flex justify-center">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            {analytics.metrics.map((m, i) => {
              const radius = r - i * 14;
              const c = 2 * Math.PI * radius;

              return (
                <React.Fragment key={m.label}>
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="#1a3554"
                    strokeWidth="10"
                  />

                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={m.color}
                    strokeWidth="10"
                    strokeDasharray={`${(m.pct / 100) * c} ${c}`}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                  />
                </React.Fragment>
              );
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {analytics.overall}%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {analytics.metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: m.color }}
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#d8d8ea]">
                  {m.label}
                </p>

                <p className="truncate text-[11px] text-[#4d7a9a]">{m.sub}</p>
              </div>
            </div>

            <span
              className="shrink-0 text-sm font-bold"
              style={{ color: m.color }}
            >
              {m.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main dashboard layout                                              */
/* ------------------------------------------------------------------ */
function DashboardContent({
  events,
  onOpenEvent,
  profile,
  analytics,
}: {
  events: EventItem[];
  onOpenEvent: (id: string) => void;
  profile: ProfileForm;
  analytics: AnalyticsData;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ongoingCount = events.filter((e) => {
    const d = new Date(e.event_date);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  }).length;

  return (
    <div
      className="mt-7 min-h-screen p-4 md:p-6"
      style={{ background: "#020812" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1.2fr]">
          <div className="space-y-6">
            <HeroCard name={profile.fullName} />

            <QuickTasks events={events} onOpenEvent={onOpenEvent} />
          </div>

          <div className="space-y-6">
            {/* Square summary cards */}
            <div className="grid grid-cols-2 gap-6">
              <EventSummaryCard
                icon={TrendingUp}
                title="Total Events"
                value={events.length}
                badge={`+${Math.max(events.length, 1)}%`}
                badgeClassName="bg-[#1a3d62] text-[#7ec8f5]"
                description="Overall events in your workspace."
                iconWrapClassName="bg-[#1a3d62]"
              />
              <EventSummaryCard
                icon={Activity}
                title="Ongoing Events"
                value={ongoingCount}
                badge="Live"
                badgeClassName="bg-[#0a3d30] text-[#3ddba6]"
                description="Events active from today onward."
                iconWrapClassName="bg-[#0a3d30]"
              />
            </div>
            <InsightsCard analytics={analytics} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page entry point                                                   */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overall: 0,
    metrics: [
      {
        label: "Ongoing Events",
        sub: "Active from today onward",
        pct: 0,
        color: "#2f6ea8",
      },
      {
        label: "This Month",
        sub: "Events scheduled this month",
        pct: 0,
        color: "#3aab73",
      },
      {
        label: "Content Readiness",
        sub: "Planned posts per event ratio",
        pct: 0,
        color: "#6b7280",
      },
    ],
  });
  const blank: ProfileForm = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    telegramUrl: "",
  };
  const [profile, setProfile] = useState<ProfileForm>(blank);

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user) return;
    const d: ProfileForm = {
      fullName: user.fullName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
      phone: "",
      location: "",
      instagramUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      telegramUrl: "",
    };
    setProfile(d);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId: user.id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.events) setEvents(d.events);
      })
      .catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId: user.id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.profile) {
          const p: ProfileForm = {
            fullName: d.profile.full_name || user.fullName || "",
            email:
              d.profile.email || user.primaryEmailAddress?.emailAddress || "",
            phone: d.profile.phone || "",
            location: d.profile.location || "",
            instagramUrl: d.profile.instagram_url || "",
            facebookUrl: d.profile.facebook_url || "",
            twitterUrl: d.profile.twitter_url || "",
            telegramUrl: d.profile.telegram_url || "",
          };
          setProfile(p);
        }
      })
      .catch(console.error);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    fetch("http://localhost:5000/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkUserId: user.id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.overall !== undefined && Array.isArray(d?.metrics)) {
          setAnalytics(d as AnalyticsData);
        }
      })
      .catch(console.error);
  }, [user?.id, events.length]);

  if (!isLoaded) return null;

  return (
    <SidebarDemo>
      <DashboardContent
        events={events}
        onOpenEvent={(id) => router.push(`/events/${id}`)}
        profile={profile}
        analytics={analytics}
      />
    </SidebarDemo>
  );
}
