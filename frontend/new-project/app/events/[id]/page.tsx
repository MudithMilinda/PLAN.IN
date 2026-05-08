"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import {
    ArrowLeft, Calendar, MapPin, Users, Target, TrendingUp,
    DollarSign, Lightbulb, Zap, BarChart2, MessageSquare, AlertCircle,
    Copy, Check, ChevronDown, ChevronUp, Hash, Video, Layers, Image,
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
    channels: { name: string; priority: string; strategy: string; contentTypes: string[] }[];
    timeline: { phase: string; duration: string; focus: string; tasks: string[] }[];
    budgetAllocation: { category: string; percentage: number; description: string }[];
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
const budgetColors = ["bg-purple-500", "bg-pink-500", "bg-blue-500", "bg-cyan-500", "bg-orange-500", "bg-green-500"];

// ─── Plan Card ────────────────────────────────────────────────────────────────
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

// ─── Copy Button ──────────────────────────────────────────────────────────────
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
            {copied
                ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied!</span></>
                : <><Copy className="w-3 h-3" />Copy</>}
        </button>
    );
}

// ─── Post Type Icon ───────────────────────────────────────────────────────────
function PostTypeIcon({ type }: { type: string }) {
    const t = type.toLowerCase();
    if (t.includes("video") || t.includes("reel")) return <Video className="w-3.5 h-3.5" />;
    if (t.includes("carousel")) return <Layers className="w-3.5 h-3.5" />;
    return <Image className="w-3.5 h-3.5" />;
}

// ─── Weekly Content Calendar ──────────────────────────────────────────────────
function WeeklyContentCalendar({ weeks }: { weeks: WeeklyContent[] }) {
    const [openWeek, setOpenWeek] = useState<number>(0);

    const weekColors = [
        "from-purple-500/20 to-purple-500/5 border-purple-500/30",
        "from-blue-500/20 to-blue-500/5 border-blue-500/30",
        "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
        "from-green-500/20 to-green-500/5 border-green-500/30",
        "from-orange-500/20 to-orange-500/5 border-orange-500/30",
        "from-pink-500/20 to-pink-500/5 border-pink-500/30",
    ];
    const weekDotColors = ["bg-purple-500", "bg-blue-500", "bg-cyan-500", "bg-green-500", "bg-orange-500", "bg-pink-500"];

    return (
        <div className="space-y-3">
            {weeks.map((week, wi) => {
                const isOpen = openWeek === wi;
                const color = weekColors[wi % weekColors.length];
                const dot = weekDotColors[wi % weekDotColors.length];

                return (
                    <div key={wi} className={`border rounded-2xl overflow-hidden bg-gradient-to-br ${color}`}>
                        {/* Week Header */}
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

                        {/* Week Posts */}
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

                                        {/* Visual description */}
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
                const response = await fetch(`http://localhost:5000/api/events/${params.id}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ clerkUserId: user.id }),
                });
                const data = await response.json();
                if (!response.ok) { setError(data.error || "Failed to load event"); return; }
                setEvent(data.event);
            } catch (err) {
                setError("Could not connect to server");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [user?.id, params?.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#050020" }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Loading event...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#050020" }}>
                <div className="bg-slate-800/30 border border-red-500/30 rounded-2xl p-8 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">Event not found</h3>
                    <p className="text-gray-400 mb-6">{error || "This event doesn't exist."}</p>
                    <button onClick={() => router.push("/my-event")}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                        ← Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const plan = event.marketing_plan;

    return (
        <div className="min-h-screen p-4 md:p-6 mt-7" style={{ background: "#050020" }}>
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Back button */}
                <button onClick={() => router.push("/my-event")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-2">
                    <ArrowLeft className="w-4 h-4" /> Back to My Events
                </button>

                {/* Event Header */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8">
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-1 rounded-full mb-3">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Marketing Plan Ready
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{event.event_name}</h1>
                    <p className="text-gray-400 text-sm mb-4">{event.event_theme}</p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-gray-300">
                            <div className="p-1.5 bg-slate-700/50 rounded-lg"><Calendar className="w-4 h-4" /></div>
                            <span className="text-sm">{new Date(event.event_date).toLocaleDateString("en-GB", { dateStyle: "long" })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <div className="p-1.5 bg-slate-700/50 rounded-lg"><MapPin className="w-4 h-4" /></div>
                            <span className="text-sm">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <div className="p-1.5 bg-slate-700/50 rounded-lg"><Users className="w-4 h-4" /></div>
                            <span className="text-sm">{event.target_audience}</span>
                        </div>
                    </div>
                    {event.additional_info && (
                        <p className="mt-4 text-gray-400 text-sm border-t border-slate-700/50 pt-4">{event.additional_info}</p>
                    )}
                </div>

                {/* No plan fallback */}
                {!plan ? (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 text-center">
                        <Zap className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <h3 className="text-white font-bold text-lg mb-2">No marketing plan yet</h3>
                        <p className="text-gray-400 text-sm">This event was saved without generating a plan.</p>
                    </div>
                ) : (
                    <>
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

                        {/* Channels */}
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

                        {/* Weekly Content Calendar */}
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
                    </>
                )}

                {/* Back button bottom */}
                <div className="pb-8">
                    <button onClick={() => router.push("/my-event")}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-semibold py-3 px-6 rounded-xl transition-all text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to My Events
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