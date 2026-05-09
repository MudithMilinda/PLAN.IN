"use client";
//collapsible weekly calendar


import React, { useState } from "react";
import { ChevronDown, ChevronUp, Hash } from "lucide-react";
import { WeeklyContent } from "../../types/marketing";
import { CopyButton, PostTypeIcon } from "./shared";

const WEEK_COLORS = [
  "from-purple-500/20 to-purple-500/5 border-purple-500/30",
  "from-blue-500/20 to-blue-500/5 border-blue-500/30",
  "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30",
  "from-green-500/20 to-green-500/5 border-green-500/30",
  "from-orange-500/20 to-orange-500/5 border-orange-500/30",
  "from-pink-500/20 to-pink-500/5 border-pink-500/30",
];

const WEEK_DOT_COLORS = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
];

export function WeeklyContentCalendar({ weeks }: { weeks: WeeklyContent[] }) {
  const [openWeek, setOpenWeek] = useState<number>(0);

  return (
    <div className="space-y-3">
      {weeks.map((week, wi) => {
        const isOpen = openWeek === wi;
        const color = WEEK_COLORS[wi % WEEK_COLORS.length];
        const dot = WEEK_DOT_COLORS[wi % WEEK_DOT_COLORS.length];

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
                        <span className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2 py-1 text-xs text-purple-300">
                          {post.platform}
                        </span>
                        <span className="text-xs text-gray-500">{post.day}</span>
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