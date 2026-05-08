"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import {
  Calendar,
  Target,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Zap,
  BarChart2,
  MessageSquare,
  ArrowLeft,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Hash,
  Instagram,
  Video,
  Image,
  Layers,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type FormFields =
  | "eventName"
  | "eventTheme"
  | "targetAudience"
  | "location"
  | "eventDate"
  | "additionalInfo";

interface FormData {
  eventName: string;
  eventTheme: string;
  targetAudience: string;
  location: string;
  eventDate: string;
  additionalInfo: string;
}

type ErrorState = Omit<Record<FormFields, boolean>, "additionalInfo">;
type TouchedState = Omit<Record<FormFields, boolean>, "additionalInfo">;

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

interface ApiResult {
  marketingPlan: MarketingPlan;
  event: EventData;
}

// ─── PAGE WRAPPER ─────────────────────────────────────────────────────────────
export default function EventFormPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <SidebarDemo>
      <EventFormContent userId={user?.id} />
    </SidebarDemo>
  );
}

// ─── MAIN CONTENT ─────────────────────────────────────────────────────────────
function EventFormContent({ userId }: { userId?: string }) {
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    eventTheme: "",
    targetAudience: "",
    location: "",
    eventDate: "",
    additionalInfo: "",
  });

  const [errors, setErrors] = useState<ErrorState>({
    eventName: false,
    eventTheme: false,
    targetAudience: false,
    location: false,
    eventDate: false,
  });

  const [touched, setTouched] = useState<TouchedState>({
    eventName: false,
    eventTheme: false,
    targetAudience: false,
    location: false,
    eventDate: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<ApiResult | null>(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const field = e.target.name as FormFields;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field !== "additionalInfo" && errors[field as keyof ErrorState]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleBlur = (fieldName: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    if (!formData[fieldName])
      setErrors((prev) => ({ ...prev, [fieldName]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {
      eventName: !formData.eventName.trim(),
      eventTheme: !formData.eventTheme.trim(),
      targetAudience: !formData.targetAudience.trim(),
      location: !formData.location.trim(),
      eventDate: !formData.eventDate,
    };
    setErrors(newErrors);
    setTouched({
      eventName: true,
      eventTheme: true,
      targetAudience: true,
      location: true,
      eventDate: true,
    });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkUserId: userId, ...formData }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }
      const result = await res.json();

      const normalizedResult: ApiResult = {
        marketingPlan: result.marketingPlan,
        event: {
          eventName: result.event.event_name,
          eventDate: result.event.event_date,
          location: result.event.location,
          eventTheme: result.event.event_theme,
        },
      };

      setGeneratedResult(normalizedResult);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("Something went wrong ❌ — " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setGeneratedResult(null);
    setFormData({
      eventName: "",
      eventTheme: "",
      targetAudience: "",
      location: "",
      eventDate: "",
      additionalInfo: "",
    });
    setErrors({
      eventName: false,
      eventTheme: false,
      targetAudience: false,
      location: false,
      eventDate: false,
    });
    setTouched({
      eventName: false,
      eventTheme: false,
      targetAudience: false,
      location: false,
      eventDate: false,
    });
  };

  if (generatedResult) {
    return (
      <MarketingPlanDisplay
        plan={generatedResult.marketingPlan}
        event={generatedResult.event}
        onBack={handleBack}
      />
    );
  }

  return (
    <div
      className="mt-7 min-h-screen p-4 md:p-6"
      style={{ background: "#050020" }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Tell Us About Your Event
          </h1>
          <p className="text-sm text-gray-400 md:text-base">
            Fill in your event details below and our AI will create a complete
            marketing strategy.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm md:p-8"
        >
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-white">
              Event Information
            </h2>
            <p className="text-sm text-gray-400">
              All fields are required unless marked optional.
            </p>
          </div>

          <div className="space-y-6">
            <InputField
              label="Event Name"
              name="eventName"
              placeholder="Event name or title"
              value={formData.eventName}
              onChange={handleChange}
              onBlur={() => handleBlur("eventName")}
              error={errors.eventName && touched.eventName}
              errorMessage="Event name is required"
              required
            />

            <SelectField
              label="Event Categories"
              name="eventTheme"
              value={formData.eventTheme}
              onChange={handleChange}
              onBlur={() => handleBlur("eventTheme")}
              error={errors.eventTheme && touched.eventTheme}
              errorMessage="Event theme is required"
              required
              options={[
                "Music Concerts",
                "Baila Concerts",
                "Party Music Events",
                "DJ / Club Events",
                "Music Festivals",
                "Classical & Carnatic Music Events",
              ]}
            />

            <SelectField
              label="Target Audience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              onBlur={() => handleBlur("targetAudience")}
              error={errors.targetAudience && touched.targetAudience}
              errorMessage="Target audience is required"
              required
              options={[
                "Youth / Young Adults (15–25)",
                "Young Professionals (25–35)",
                "Adults / Families (35–55)",
                "Tourists / Expat Community",
              ]}
            />

            <InputField
              label="Location"
              name="location"
              placeholder="Event location"
              value={formData.location}
              onChange={handleChange}
              onBlur={() => handleBlur("location")}
              error={errors.location && touched.location}
              errorMessage="Location is required"
              required
            />

            <div>
              <label className="mb-2 block font-semibold text-white">
                Event Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  onBlur={() => handleBlur("eventDate")}
                  className={`w-full rounded-lg border bg-slate-900/50 py-3 pr-4 pl-12 text-white transition-all focus:outline-none ${
                    errors.eventDate && touched.eventDate
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  }`}
                  style={{ colorScheme: "dark" }}
                />
              </div>
              {errors.eventDate && touched.eventDate && (
                <p className="mt-1 text-sm text-red-400">
                  Event date is required
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-semibold text-white">
                Additional Information{" "}
                <span className="font-normal text-gray-500">(Optional)</span>
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                placeholder="Any special requirements or goals"
                className="w-full resize-none rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full transform rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Generating Marketing Plan...
                </span>
              ) : (
                "Generate Marketing Plan"
              )}
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
              By submitting, our AI will analyze your event and create a
              marketing strategy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── COPY BUTTON ──────────────────────────────────────────────────────────────
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

// ─── POST TYPE ICON ───────────────────────────────────────────────────────────
function PostTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t.includes("video") || t.includes("reel"))
    return <Video className="h-3.5 w-3.5" />;
  if (t.includes("carousel")) return <Layers className="h-3.5 w-3.5" />;
  if (t.includes("story")) return <Instagram className="h-3.5 w-3.5" />;
  return <Image className="h-3.5 w-3.5" />;
}

// ─── WEEKLY CONTENT CALENDAR ──────────────────────────────────────────────────
function WeeklyContentCalendar({ weeks }: { weeks: WeeklyContent[] }) {
  const [openWeek, setOpenWeek] = useState<number>(0); // first week open by default

  const weekColors = [
    "from-purple-500/20 to-purple-500/5 border-purple-500/30",
    "from-blue-500/20 to-blue-500/5 border-blue-500/30",
    "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
    "from-green-500/20 to-green-500/5 border-green-500/30",
    "from-orange-500/20 to-orange-500/5 border-orange-500/30",
    "from-pink-500/20 to-pink-500/5 border-pink-500/30",
  ];

  const weekDotColors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-cyan-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
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
            {/* Week Header — click to expand */}
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

            {/* Week Content */}
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
                        <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-xs text-purple-300">
                          {post.platform}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.day}
                        </span>
                      </div>
                    </div>

                    {/* Content description */}
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

// ─── MARKETING PLAN DISPLAY ───────────────────────────────────────────────────
const priorityColors: Record<string, string> = {
  High: "bg-green-500/20 text-green-400 border border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};
const budgetColors = [
  "bg-purple-500",
  "bg-pink-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-green-500",
];

interface EventData {
  eventName: string;
  eventDate: string;
  location?: string;
  eventTheme?: string;
}

function MarketingPlanDisplay({
  plan,
  event,
  onBack,
}: {
  plan: MarketingPlan;
  event: EventData;
  onBack: () => void;
}) {
  return (
    <div
      className="mt-7 min-h-screen p-4 md:p-6"
      style={{ background: "#050020" }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Marketing Plan Generated ✅
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            {event.eventName}
          </h1>
          <p className="text-gray-400">
            {event.eventTheme} · {event.location} ·{" "}
            {new Date(event.eventDate).toLocaleDateString("en-LK", {
              dateStyle: "long",
            })}
          </p>
        </div>

        {/* Strategy Summary */}
        <PlanCard
          icon={<Target className="h-5 w-5 text-purple-400" />}
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

        {/* Marketing Channels */}
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
                  <span className="font-semibold text-white">{ch.name}</span>
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
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
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
                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-gray-400">{phase.focus}</p>
                  <ul className="space-y-1">
                    {phase.tasks?.map((task, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <span className="mt-0.5 text-purple-400">→</span>
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
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </PlanCard>

        {/* ─── WEEKLY CONTENT CALENDAR ─────────────────────────────────── */}
        {plan.weeklyContentCalendar &&
          plan.weeklyContentCalendar.length > 0 && (
            <PlanCard
              icon={<Hash className="h-5 w-5 text-violet-400" />}
              title="Weekly Content Calendar"
            >
              <p className="mb-4 text-sm text-gray-400">
                Ready-to-post captions and hashtags for each week. Click a week
                to expand.
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
          icon={<MessageSquare className="h-5 w-5 text-pink-400" />}
          title="Key Messages"
        >
          <div className="space-y-2">
            {plan.keyMessages?.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-pink-500/20 bg-pink-500/5 p-3"
              >
                <span className="text-lg text-pink-400">&quot;</span>
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

        {/* Back Button */}
        <div className="pb-8 text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-8 py-3 font-semibold text-white transition-all hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" /> Create Another Event Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED CARD ──────────────────────────────────────────────────────────────
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

// ─── INPUT ────────────────────────────────────────────────────────────────────
interface InputProps {
  label: string;
  name: FormFields;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}
function InputField({
  label,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  error = false,
  errorMessage = "",
  required = false,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full rounded-lg border bg-slate-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none ${error ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"}`}
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
interface SelectProps {
  label: string;
  name: FormFields;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}
function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  error = false,
  errorMessage = "",
  required = false,
}: SelectProps) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full rounded-lg border bg-slate-900/50 px-4 py-3 text-white transition-all focus:outline-none ${error ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-700/50 focus:ring-2 focus:ring-purple-500/20"}`}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
