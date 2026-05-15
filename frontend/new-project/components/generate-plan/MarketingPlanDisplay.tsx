//results page

"use client";

import React from "react";
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
  Hash,
  Clock,
  MapPin,
} from "lucide-react";
import { MarketingPlan, EventData, LocationData } from "../../types/marketing";
import { PlanCard } from "./shared";
import { WeeklyContentCalendar } from "./WeeklyContentCalendar";

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-green-500/20 text-green-400 border border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  Low: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

const BUDGET_COLORS = [
  "bg-[#2f6ea8]",
  "bg-[#3f8ab5]",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-green-500",
];

// Helper: render location whether structured or legacy string 
function formatLocation(location?: LocationData | string): string {
  if (!location) return "";
  if (typeof location === "string") {
    try {
      const parsed = JSON.parse(location);
      return parsed.venue || parsed.city || location;
    } catch {
      return location;
    }
  }
  // LocationData object
  return location.venue || location.city || "";
}

interface Props {
  plan: MarketingPlan;
  event: EventData;
  onBack: () => void;
}

export function MarketingPlanDisplay({ plan, event, onBack }: Props) {
  return (
    <div
      className="mt-7 min-h-screen p-4 md:p-6"
      style={{ background: "#020812" }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            Marketing Plan Generated ✅
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            {event.eventName}
          </h1>

          {/* Meta chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400">
            {event.eventTheme && (
              <span className="rounded-full border border-[#4a86b8]/30 bg-[#2f6ea8]/10 px-3 py-1 text-[#9ac7e6]">
                {event.eventTheme}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1">
                <MapPin className="h-3.5 w-3.5 text-[#8fc3e6]" />
                {formatLocation(event.location)}
              </span>
            )}
            {event.duration && (
              <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                {event.duration}
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1">
              <Calendar className="h-3.5 w-3.5 text-yellow-400" />
              {new Date(event.eventDate).toLocaleDateString("en-LK", {
                dateStyle: "long",
              })}
            </span>
          </div>
        </div>

        {/* ── Strategy Summary ── */}
        <PlanCard
          icon={<Target className="h-5 w-5 text-[#7eb6de]" />}
          title="Strategy Overview"
        >
          <p className="leading-relaxed text-gray-300">{plan.summary}</p>
        </PlanCard>

        {/* ── Quick Wins ── */}
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

        {/* ── Marketing Channels ── */}
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
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_COLORS[ch.priority] ?? PRIORITY_COLORS.Low}`}
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

        {/* ── Timeline ── */}
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
                  <p className="mb-2 text-sm text-gray-400">{phase.focus}</p>
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

        {/* ── Budget ── */}
        <PlanCard
          icon={<DollarSign className="h-5 w-5 text-green-400" />}
          title="Budget Allocation"
        >
          <div className="mb-4 flex h-4 overflow-hidden rounded-full">
            {plan.budgetAllocation?.map((item, i) => (
              <div
                key={i}
                className={BUDGET_COLORS[i % BUDGET_COLORS.length]}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.percentage}%`}
              />
            ))}
          </div>
          <div className="space-y-3">
            {plan.budgetAllocation?.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className={`mt-1 h-3 w-3 flex-shrink-0 rounded-full ${BUDGET_COLORS[i % BUDGET_COLORS.length]}`}
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

        {/* ── Weekly Content Calendar ── */}
        {plan.weeklyContentCalendar &&
          plan.weeklyContentCalendar.length > 0 && (
            <PlanCard
              icon={<Hash className="h-5 w-5 text-[#83bbdf]" />}
              title="Weekly Content Calendar"
            >
              <p className="mb-4 text-sm text-gray-400">
                Ready-to-post captions and hashtags for each week. Click a week
                to expand.
              </p>
              <WeeklyContentCalendar weeks={plan.weeklyContentCalendar} />
            </PlanCard>
          )}

        {/* ── Content Ideas ── */}
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

        {/* ── Key Messages ── */}
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

        {/* ── Success Metrics ── */}
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

        {/* ── Back Button ── */}
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
