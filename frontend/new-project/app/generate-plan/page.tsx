"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import {
  Calendar, Target, TrendingUp, DollarSign, Lightbulb,
  Zap, BarChart2, MessageSquare, ArrowLeft, Copy, Check,
  ChevronDown, ChevronUp, Hash, Instagram, Video, Image, Layers
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type FormFields = "eventName" | "eventTheme" | "targetAudience" | "location" | "eventDate" | "additionalInfo";

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
  channels: { name: string; priority: string; strategy: string; contentTypes: string[] }[];
  timeline: { phase: string; duration: string; focus: string; tasks: string[] }[];
  budgetAllocation: { category: string; percentage: number; description: string }[];
  contentIdeas: { type: string; idea: string; platform: string }[];
  keyMessages: string[];
  successMetrics: string[];
  quickWins: string[];
  weeklyContentCalendar?: WeeklyContent[];
}

interface ApiResult {
  marketingPlan: MarketingPlan;
  event: FormData & { eventName: string };
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
    eventName: "", eventTheme: "", targetAudience: "",
    location: "", eventDate: "", additionalInfo: "",
  });

  const [errors, setErrors] = useState<ErrorState>({
    eventName: false, eventTheme: false, targetAudience: false,
    location: false, eventDate: false,
  });

  const [touched, setTouched] = useState<TouchedState>({
    eventName: false, eventTheme: false, targetAudience: false,
    location: false, eventDate: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<ApiResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const field = e.target.name as FormFields;
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field !== "additionalInfo" && errors[field as keyof ErrorState]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleBlur = (fieldName: keyof TouchedState) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    if (!formData[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: true }));
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
    setTouched({ eventName: true, eventTheme: true, targetAudience: true, location: true, eventDate: true });
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
      setGeneratedResult(result);
    } catch (err: any) {
      alert("Something went wrong ❌ — " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setGeneratedResult(null);
    setFormData({ eventName: "", eventTheme: "", targetAudience: "", location: "", eventDate: "", additionalInfo: "" });
    setErrors({ eventName: false, eventTheme: false, targetAudience: false, location: false, eventDate: false });
    setTouched({ eventName: false, eventTheme: false, targetAudience: false, location: false, eventDate: false });
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
    <div className="min-h-screen p-4 md:p-6 mt-7" style={{ background: "#050020" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Tell Us About Your Event</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Fill in your event details below and our AI will create a complete marketing strategy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Event Information</h2>
            <p className="text-gray-400 text-sm">All fields are required unless marked optional.</p>
          </div>

          <div className="space-y-6">
            <InputField label="Event Name" name="eventName" placeholder="Event name or title"
              value={formData.eventName} onChange={handleChange} onBlur={() => handleBlur("eventName")}
              error={errors.eventName && touched.eventName} errorMessage="Event name is required" required />

            <SelectField label="Event Categories" name="eventTheme" value={formData.eventTheme}
              onChange={handleChange} onBlur={() => handleBlur("eventTheme")}
              error={errors.eventTheme && touched.eventTheme} errorMessage="Event theme is required" required
              options={["Music Concerts", "Baila Concerts", "Party Music Events", "DJ / Club Events", "Music Festivals", "Classical & Carnatic Music Events"]} />

            <SelectField label="Target Audience" name="targetAudience" value={formData.targetAudience}
              onChange={handleChange} onBlur={() => handleBlur("targetAudience")}
              error={errors.targetAudience && touched.targetAudience} errorMessage="Target audience is required" required
              options={["Youth / Young Adults (15–25)", "Young Professionals (25–35)", "Adults / Families (35–55)", "Tourists / Expat Community"]} />

            <InputField label="Location" name="location" placeholder="Event location"
              value={formData.location} onChange={handleChange} onBlur={() => handleBlur("location")}
              error={errors.location && touched.location} errorMessage="Location is required" required />

            <div>
              <label className="block text-white font-semibold mb-2">
                Event Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <input type="datetime-local" name="eventDate" value={formData.eventDate}
                  onChange={handleChange} onBlur={() => handleBlur("eventDate")}
                  className={`w-full bg-slate-900/50 border rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none transition-all ${errors.eventDate && touched.eventDate
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                    : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"}`}
                  style={{ colorScheme: "dark" }} />
              </div>
              {errors.eventDate && touched.eventDate && <p className="text-red-400 text-sm mt-1">Event date is required</p>}
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Additional Information <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4}
                placeholder="Any special requirements or goals"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none" />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating Marketing Plan...
                </span>
              ) : "Generate Marketing Plan"}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              By submitting, our AI will analyze your event and create a marketing strategy.
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
    <button onClick={handleCopy}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-gray-400 hover:text-white transition-all border border-slate-600/50">
      {copied ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied!</span></> : <><Copy className="w-3 h-3" />Copy</>}
    </button>
  );
}

// ─── POST TYPE ICON ───────────────────────────────────────────────────────────
function PostTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t.includes("video") || t.includes("reel")) return <Video className="w-3.5 h-3.5" />;
  if (t.includes("carousel")) return <Layers className="w-3.5 h-3.5" />;
  if (t.includes("story")) return <Instagram className="w-3.5 h-3.5" />;
  return <Image className="w-3.5 h-3.5" />;
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
    "bg-purple-500", "bg-blue-500", "bg-cyan-500",
    "bg-green-500", "bg-orange-500", "bg-pink-500",
  ];

  return (
    <div className="space-y-3">
      {weeks.map((week, wi) => {
        const isOpen = openWeek === wi;
        const color = weekColors[wi % weekColors.length];
        const dot = weekDotColors[wi % weekDotColors.length];

        return (
          <div key={wi} className={`border rounded-2xl overflow-hidden bg-gradient-to-br ${color}`}>
            {/* Week Header — click to expand */}
            <button
              onClick={() => setOpenWeek(isOpen ? -1 : wi)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${dot} flex-shrink-0`} />
                <div>
                  <span className="text-white font-bold text-base">{week.week}</span>
                  <span className="ml-3 text-gray-400 text-sm">— {week.theme}</span>
                </div>
                <span className="hidden md:inline text-xs bg-slate-700/60 text-gray-400 px-2 py-0.5 rounded-full border border-slate-600/50">
                  {week.posts?.length} posts
                </span>
              </div>
              {isOpen
                ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            </button>

            {/* Week Content */}
            {isOpen && (
              <div className="px-4 md:px-5 pb-5 space-y-4">
                {week.posts?.map((post, pi) => (
                  <div key={pi} className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">

                    {/* Post header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                          <PostTypeIcon type={post.type} />
                          {post.type}
                        </span>
                        <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded-lg">
                          {post.platform}
                        </span>
                        <span className="text-xs text-gray-500">{post.day}</span>
                      </div>
                    </div>

                    {/* Content description */}
                    <div className="px-4 pt-3 pb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Visual / Content</p>
                      <p className="text-gray-300 text-sm">{post.contentDescription}</p>
                    </div>

                    {/* Caption */}
                    <div className="px-4 pt-2 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Caption</p>
                        <CopyButton text={post.caption} />
                      </div>
                      <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50">
                        <p className="text-gray-200 text-sm whitespace-pre-line leading-relaxed">
                          {post.caption}
                        </p>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold flex items-center gap-1">
                          <Hash className="w-3 h-3" /> Hashtags
                        </p>
                        <CopyButton text={post.hashtags} />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {post.hashtags?.split(" ").filter(Boolean).map((tag, ti) => (
                          <span key={ti}
                            className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full hover:bg-blue-500/20 transition-colors cursor-default">
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
const budgetColors = ["bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-cyan-500", "bg-orange-500", "bg-green-500"];

function MarketingPlanDisplay({ plan, event, onBack }: { plan: MarketingPlan; event: any; onBack: () => void }) {
  return (
    <div className="min-h-screen p-4 md:p-6 mt-7" style={{ background: "#050020" }}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-2 rounded-full mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Marketing Plan Generated ✅
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.eventName}</h1>
          <p className="text-gray-400">
            {event.eventTheme} · {event.location} ·{" "}
            {new Date(event.eventDate).toLocaleDateString("en-LK", { dateStyle: "long" })}
          </p>
        </div>

        {/* Strategy Summary */}
        <PlanCard icon={<Target className="w-5 h-5 text-purple-400" />} title="Strategy Overview">
          <p className="text-gray-300 leading-relaxed">{plan.summary}</p>
        </PlanCard>

        {/* Quick Wins */}
        <PlanCard icon={<Zap className="w-5 h-5 text-yellow-400" />} title="Quick Wins — Start Today">
          <ul className="space-y-2">
            {plan.quickWins?.map((win, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                <span className="text-gray-300 text-sm">{win}</span>
              </li>
            ))}
          </ul>
        </PlanCard>

        {/* Marketing Channels */}
        <PlanCard icon={<TrendingUp className="w-5 h-5 text-blue-400" />} title="Marketing Channels">
          <div className="space-y-4">
            {plan.channels?.map((ch, i) => (
              <div key={i} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold">{ch.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[ch.priority] || priorityColors.Low}`}>{ch.priority}</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{ch.strategy}</p>
                <div className="flex flex-wrap gap-2">
                  {ch.contentTypes?.map((ct, j) => (
                    <span key={j} className="bg-slate-800 text-gray-300 text-xs px-2 py-1 rounded-md border border-slate-700">{ct}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PlanCard>

        {/* Timeline */}
        <PlanCard icon={<Calendar className="w-5 h-5 text-cyan-400" />} title="Campaign Timeline">
          <div className="space-y-4">
            {plan.timeline?.map((phase, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{i + 1}</div>
                  {i < plan.timeline.length - 1 && <div className="w-0.5 flex-1 bg-slate-700 mt-2" />}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold">{phase.phase}</span>
                    <span className="text-purple-400 text-xs bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">{phase.duration}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{phase.focus}</p>
                  <ul className="space-y-1">
                    {phase.tasks?.map((task, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-purple-400 mt-0.5">→</span>{task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </PlanCard>

        {/* Budget */}
        <PlanCard icon={<DollarSign className="w-5 h-5 text-green-400" />} title="Budget Allocation">
          <div className="flex rounded-full overflow-hidden h-4 mb-4">
            {plan.budgetAllocation?.map((item, i) => (
              <div key={i} className={`${budgetColors[i % budgetColors.length]}`}
                style={{ width: `${item.percentage}%` }} title={`${item.category}: ${item.percentage}%`} />
            ))}
          </div>
          <div className="space-y-3">
            {plan.budgetAllocation?.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${budgetColors[i % budgetColors.length]}`} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="text-white text-sm font-medium">{item.category}</span>
                    <span className="text-gray-400 text-sm font-bold">{item.percentage}%</span>
                  </div>
                  <p className="text-gray-500 text-xs">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </PlanCard>

        {/* ─── WEEKLY CONTENT CALENDAR ─────────────────────────────────── */}
        {plan.weeklyContentCalendar && plan.weeklyContentCalendar.length > 0 && (
          <PlanCard icon={<Hash className="w-5 h-5 text-violet-400" />} title="Weekly Content Calendar">
            <p className="text-gray-400 text-sm mb-4">
              Ready-to-post captions and hashtags for each week. Click a week to expand.
            </p>
            <WeeklyContentCalendar weeks={plan.weeklyContentCalendar} />
          </PlanCard>
        )}

        {/* Content Ideas */}
        <PlanCard icon={<Lightbulb className="w-5 h-5 text-orange-400" />} title="Content Ideas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.contentIdeas?.map((idea, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-400 text-xs font-semibold uppercase tracking-wide">{idea.type}</span>
                  <span className="text-xs text-gray-500 bg-slate-800 px-2 py-0.5 rounded-full">{idea.platform}</span>
                </div>
                <p className="text-gray-300 text-sm">{idea.idea}</p>
              </div>
            ))}
          </div>
        </PlanCard>

        {/* Key Messages */}
        <PlanCard icon={<MessageSquare className="w-5 h-5 text-pink-400" />} title="Key Messages">
          <div className="space-y-2">
            {plan.keyMessages?.map((msg, i) => (
              <div key={i} className="flex items-start gap-3 bg-pink-500/5 border border-pink-500/20 rounded-xl p-3">
                <span className="text-pink-400 text-lg">"</span>
                <p className="text-gray-300 text-sm">{msg}</p>
              </div>
            ))}
          </div>
        </PlanCard>

        {/* Success Metrics */}
        <PlanCard icon={<BarChart2 className="w-5 h-5 text-cyan-400" />} title="Success Metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {plan.successMetrics?.map((metric, i) => (
              <div key={i} className="flex items-center gap-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3">
                <span className="w-7 h-7 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                <p className="text-gray-300 text-sm">{metric}</p>
              </div>
            ))}
          </div>
        </PlanCard>

        {/* Back Button */}
        <div className="text-center pb-8">
          <button onClick={onBack}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold py-3 px-8 rounded-xl transition-all">
            <ArrowLeft className="w-4 h-4" /> Create Another Event Plan
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── SHARED CARD ──────────────────────────────────────────────────────────────
function PlanCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-slate-700/50 rounded-lg flex items-center justify-center">{icon}</div>
        <h2 className="text-white font-bold text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
interface InputProps {
  label: string; name: FormFields; value: string; placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void; error?: boolean; errorMessage?: string; required?: boolean;
}
function InputField({ label, name, value, placeholder, onChange, onBlur, error = false, errorMessage = "", required = false }: InputProps) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">{label} {required && <span className="text-red-400">*</span>}</label>
      <input type="text" name={name} value={value} placeholder={placeholder} onChange={onChange} onBlur={onBlur}
        className={`w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all ${error ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"}`} />
      {error && errorMessage && <p className="text-red-400 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
}

// ─── SELECT ───────────────────────────────────────────────────────────────────
interface SelectProps {
  label: string; name: FormFields; value: string; options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void; error?: boolean; errorMessage?: string; required?: boolean;
}
function SelectField({ label, name, value, options, onChange, onBlur, error = false, errorMessage = "", required = false }: SelectProps) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">{label} {required && <span className="text-red-400">*</span>}</label>
      <select name={name} value={value} onChange={onChange} onBlur={onBlur}
        className={`w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-all ${error ? "border-red-500 focus:ring-2 focus:ring-red-500/20" : "border-slate-700/50 focus:ring-2 focus:ring-purple-500/20"}`}>
        <option value="" disabled>Select {label}</option>
        {options.map((option) => <option key={option} value={option} className="bg-slate-900">{option}</option>)}
      </select>
      {error && errorMessage && <p className="text-red-400 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
}