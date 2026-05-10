"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { exportMarketingPlanPDF } from "../../../lib/exportMarketingPlanPDF";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Zap,
  BarChart2,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Hash,
  Video,
  Layers,
  Image,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface WeeklyPost {
  day: string;
  type: string;
  platform: string;
  contentDescription: string;
  caption: string;
  hashtags: string;
}

interface WeeklyContent {
  week: string;
  theme: string;
  posts: WeeklyPost[];
}

interface MarketingPlan {
  summary: string;
  channels: {
    name: string;
    priority: string;
    strategy: string;
    contentTypes: string[];
  }[];
  timeline: {
    phase: string;
    duration: string;
    focus: string;
    tasks: string[];
  }[];
  budgetAllocation: {
    category: string;
    percentage: number;
    description: string;
  }[];
  contentIdeas: { type: string; idea: string; platform: string }[];
  keyMessages: string[];
  successMetrics: string[];
  quickWins: string[];
  weeklyContentCalendar?: WeeklyContent[];
}

interface EventDetail {
  id: string;
  event_name: string;
  event_theme: string;
  target_audience: string;
  location: string;
  event_date: string;
  additional_info?: string;
  marketing_plan: MarketingPlan | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const priorityColors: Record<string, string> = {
  High: "bg-green-500/20 text-green-400 border border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};
const budgetColors = [
  "bg-[#2f6ea8]",
  "bg-[#3f8ab5]",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-green-500",
];

function formatLocation(location: string): string {
  try {
    const parsed = JSON.parse(location);
    return parsed.venue || parsed.city || location;
  } catch {
    return location;
  }
}

// ─── Plan Card ────────────────────────────────────────────────────────────────
function PlanCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-700/50 px-2 py-1 text-xs text-gray-400 transition-all hover:bg-slate-600/50 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  );
}

// ─── Post Type Icon ───────────────────────────────────────────────────────────
function PostTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t.includes("video") || t.includes("reel"))
    return <Video className="h-3.5 w-3.5" />;
  if (t.includes("carousel")) return <Layers className="h-3.5 w-3.5" />;
  return <Image className="h-3.5 w-3.5" aria-label="Post type icon" />;
}

// ─── Weekly Content Calendar ──────────────────────────────────────────────────
function WeeklyContentCalendar({ weeks }: { weeks: WeeklyContent[] }) {
  const [openWeek, setOpenWeek] = useState<number>(0);

  const weekColors = [
    "from-[#2f6ea8]/25 to-[#2f6ea8]/10 border-[#4a86b8]/35",
    "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
    "from-green-500/20 to-green-500/5 border-green-500/30",
    "from-orange-500/20 to-orange-500/5 border-orange-500/30",
    "from-[#3f8ab5]/25 to-[#3f8ab5]/10 border-[#5fa7cf]/35",
  ];
  const weekDotColors = [
    "bg-[#2f6ea8]",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-[#3f8ab5]",
  ];

  return (
    <div className="space-y-3">
      {weeks.map((week, wi) => {
        const isOpen = openWeek === wi;
        const color = weekColors[wi % weekColors.length];
        const dot = weekDotColors[wi % weekDotColors.length];

        return (
          <div
            key={wi}
            className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${color}`}
          >
            {/* Week Header */}
            <button
              onClick={() => setOpenWeek(isOpen ? -1 : wi)}
              className="flex w-full items-center justify-between p-4 text-left md:p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${dot} flex-shrink-0`} />
                <div>
                  <span className="text-base font-bold text-white">
                    {week.week}
                  </span>
                  <span className="ml-3 text-sm text-gray-400">
                    — {week.theme}
                  </span>
                </div>
                <span className="hidden rounded-full border border-slate-600/50 bg-slate-700/60 px-2 py-0.5 text-xs text-gray-400 md:inline">
                  {week.posts?.length} posts
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
              )}
            </button>

            {/* Week Posts */}
            {isOpen && (
              <div className="space-y-4 px-4 pb-5 md:px-5">
                {week.posts?.map((post, pi) => (
                  <div
                    key={pi}
                    className="overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/60"
                  >
                    {/* Post header */}
                    <div className="flex items-center justify-between border-b border-slate-700/50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs font-semibold text-gray-300">
                          <PostTypeIcon type={post.type} />
                          {post.type}
                        </span>
                        <span className="rounded-lg border border-[#4a86b8]/20 bg-[#2f6ea8]/10 px-2 py-1 text-xs text-[#9ac7e6]">
                          {post.platform}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.day}
                        </span>
                      </div>
                    </div>

                    {/* Visual description */}
                    <div className="px-4 pt-3 pb-2">
                      <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        Visual / Content
                      </p>
                      <p className="text-sm text-gray-300">
                        {post.contentDescription}
                      </p>
                    </div>

                    {/* Caption */}
                    <div className="px-4 pt-2 pb-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          Caption
                        </p>
                        <CopyButton text={post.caption} />
                      </div>
                      <div className="rounded-xl border border-slate-700/50 bg-slate-800/80 p-3">
                        <p className="text-sm leading-relaxed whitespace-pre-line text-gray-200">
                          {post.caption}
                        </p>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div className="px-4 pb-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="flex items-center gap-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          <Hash className="h-3 w-3" /> Hashtags
                        </p>
                        <CopyButton text={post.hashtags} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {post.hashtags
                          ?.split(" ")
                          .filter(Boolean)
                          .map((tag, ti) => (
                            <span
                              key={ti}
                              className="cursor-default rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300 transition-colors hover:bg-blue-500/20"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
function EventDetailContent() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!user?.id || !params?.id) return;
      try {
        const response = await fetch(
          `http://localhost:5000/api/events/${params.id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clerkUserId: user.id }),
          },
        );
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Failed to load event");
          return;
        }
        setEvent(data.event);
      } catch {
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [user?.id, params?.id]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#020812" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#4a86b8] border-t-transparent" />
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#020812" }}
      >
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-slate-800/30 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h3 className="mb-2 text-xl font-bold text-white">Event not found</h3>
          <p className="mb-6 text-gray-400">
            {error || "This event doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/my-event")}
            className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-600"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const plan = event.marketing_plan;

  return (
    <div
      className="mt-7 min-h-screen p-4 md:p-6"
      style={{ background: "#020812" }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back button */}
        <button
          onClick={() => router.push("/my-event")}
          className="mb-2 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Events
        </button>

        {/* Event Header */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm md:p-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            Marketing Plan Ready
          </div>
          <h1 className="mb-1 text-2xl font-bold text-white md:text-3xl">
            {event.event_name}
          </h1>
          <p className="mb-4 text-sm text-gray-400">{event.event_theme}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="rounded-lg bg-slate-700/50 p-1.5">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-sm">
                {new Date(event.event_date).toLocaleDateString("en-GB", {
                  dateStyle: "long",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="rounded-lg bg-slate-700/50 p-1.5">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-sm">{formatLocation(event.location)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <div className="rounded-lg bg-slate-700/50 p-1.5">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-sm">{event.target_audience}</span>
            </div>
          </div>
          {event.additional_info && (
            <p className="mt-4 border-t border-slate-700/50 pt-4 text-sm text-gray-400">
              {event.additional_info}
            </p>
          )}
        </div>

        {/* No plan fallback */}
        {!plan ? (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8 text-center">
            <Zap className="mx-auto mb-3 h-12 w-12 text-gray-500" />
            <h3 className="mb-2 text-lg font-bold text-white">
              No marketing plan yet
            </h3>
            <p className="text-sm text-gray-400">
              This event was saved without generating a plan.
            </p>
          </div>
        ) : (
          <>
            {/* Strategy Summary */}
            <PlanCard
              icon={<Target className="h-5 w-5 text-[#7eb6de]" />}
              title="Strategy Overview"
            >
              <p className="leading-relaxed text-gray-300">{plan.summary}</p>
            </PlanCard>

            {/* Quick Wins */}
            <PlanCard
              icon={<Zap className="h-5 w-5 text-yellow-400" />}
              title="Quick Wins — Start Today"
            >
              <ul className="space-y-2">
                {plan.quickWins?.map((win, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/20 text-xs font-bold text-yellow-400">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-300">{win}</span>
                  </li>
                ))}
              </ul>
            </PlanCard>

            {/* Channels */}
            <PlanCard
              icon={<TrendingUp className="h-5 w-5 text-blue-400" />}
              title="Marketing Channels"
            >
              <div className="space-y-4">
                {plan.channels?.map((ch, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {ch.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[ch.priority] || priorityColors.Low}`}
                      >
                        {ch.priority}
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-gray-400">{ch.strategy}</p>
                    <div className="flex flex-wrap gap-2">
                      {ch.contentTypes?.map((ct, j) => (
                        <span
                          key={j}
                          className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-gray-300"
                        >
                          {ct}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PlanCard>

            {/* Timeline */}
            <PlanCard
              icon={<Calendar className="h-5 w-5 text-cyan-400" />}
              title="Campaign Timeline"
            >
              <div className="space-y-4">
                {plan.timeline?.map((phase, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#2f6ea8] text-sm font-bold text-white">
                        {i + 1}
                      </div>
                      {i < plan.timeline.length - 1 && (
                        <div className="mt-2 w-0.5 flex-1 bg-slate-700" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {phase.phase}
                        </span>
                        <span className="rounded-full border border-[#4a86b8]/20 bg-[#2f6ea8]/10 px-2 py-0.5 text-xs text-[#7eb6de]">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-gray-400">
                        {phase.focus}
                      </p>
                      <ul className="space-y-1">
                        {phase.tasks?.map((task, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm text-gray-300"
                          >
                            <span className="mt-0.5 text-[#7eb6de]">→</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </PlanCard>

            {/* Budget */}
            <PlanCard
              icon={<DollarSign className="h-5 w-5 text-green-400" />}
              title="Budget Allocation"
            >
              <div className="mb-4 flex h-4 overflow-hidden rounded-full">
                {plan.budgetAllocation?.map((item, i) => (
                  <div
                    key={i}
                    className={`${budgetColors[i % budgetColors.length]}`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.category}: ${item.percentage}%`}
                  />
                ))}
              </div>
              <div className="space-y-3">
                {plan.budgetAllocation?.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${budgetColors[i % budgetColors.length]}`}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-white">
                          {item.category}
                        </span>
                        <span className="text-sm font-bold text-gray-400">
                          {item.percentage}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PlanCard>

            {/* Weekly Content Calendar */}
            {plan.weeklyContentCalendar &&
              plan.weeklyContentCalendar.length > 0 && (
                <PlanCard
                  icon={<Hash className="h-5 w-5 text-[#83bbdf]" />}
                  title="Weekly Content Calendar"
                >
                  <p className="mb-4 text-sm text-gray-400">
                    Ready-to-post captions and hashtags for each week. Click a
                    week to expand.
                  </p>
                  <WeeklyContentCalendar weeks={plan.weeklyContentCalendar} />
                </PlanCard>
              )}

            {/* Content Ideas */}
            <PlanCard
              icon={<Lightbulb className="h-5 w-5 text-orange-400" />}
              title="Content Ideas"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {plan.contentIdeas?.map((idea, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wide text-orange-400 uppercase">
                        {idea.type}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-gray-500">
                        {idea.platform}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{idea.idea}</p>
                  </div>
                ))}
              </div>
            </PlanCard>

            {/* Key Messages */}
            <PlanCard
              icon={<MessageSquare className="h-5 w-5 text-[#8fc3e6]" />}
              title="Key Messages"
            >
              <div className="space-y-2">
                {plan.keyMessages?.map((msg, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-[#5fa7cf]/20 bg-[#3f8ab5]/8 p-3"
                  >
                    <span className="text-lg text-[#8fc3e6]">&quot;</span>
                    <p className="text-sm text-gray-300">{msg}</p>
                  </div>
                ))}
              </div>
            </PlanCard>

            {/* Success Metrics */}
            <PlanCard
              icon={<BarChart2 className="h-5 w-5 text-cyan-400" />}
              title="Success Metrics"
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {plan.successMetrics?.map((metric, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-bold text-cyan-400">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-300">{metric}</p>
                  </div>
                ))}
              </div>
            </PlanCard>
          </>
        )}

        <button
          onClick={async () => {
            try {
              await exportMarketingPlanPDF(event, user?.id);
            } catch (err) {
              alert("PDF export failed. Please try again.");
            }
          }}
          className="flex items-center gap-2 rounded-xl border border-[#4a86b8]/30 bg-[#2f6ea8]/10 px-4 py-2 text-sm font-semibold text-[#9ac7e6] transition-all hover:bg-[#2f6ea8]/20"
        >
          ⬇ Download PDF
        </button>

        {/* Back button bottom */}
        <div className="pb-8">
          <button
            onClick={() => router.push("/my-event")}
            className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <SidebarDemo>
      <EventDetailContent />
    </SidebarDemo>
  );
}
