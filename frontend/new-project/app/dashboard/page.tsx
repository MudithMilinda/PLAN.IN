"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { Calendar, Users, CalendarDays } from 'lucide-react';

function DashboardContent() {
  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ background: 'linear-gradient(to bottom, #050020, #050020, #050020)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">PLAN.IN</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Welcome back! Here's what's happening with your events.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {/* Total Reach */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 md:p-4 hover:bg-slate-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-xs md:text-sm font-medium">Total Reach</h3>
              <div className="p-1 md:p-1.5 bg-purple-500/20 rounded-lg">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">128.5K</p>
          </div>

          {/* Active Events */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 md:p-4 hover:bg-slate-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-xs md:text-sm font-medium">Active Events</h3>
              <div className="p-1 md:p-1.5 bg-blue-500/20 rounded-lg">
                <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">6</p>
          </div>

          {/* Communities */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 md:p-4 hover:bg-slate-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-xs md:text-sm font-medium">Communities</h3>
              <div className="p-1 md:p-1.5 bg-pink-500/20 rounded-lg">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-pink-400" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">65</p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Posts */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Upcoming Scheduled Posts</h2>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 md:p-4 hover:bg-slate-700/70 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1 line-clamp-2">
                    Parinamaya Live in Concert - Early Bird Announcement
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm">Today, 2:00 PM</p>
                </div>
                <span className="px-2 md:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
                  Scheduled
                </span>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Calendar</h2>
            </div>
            <div className="flex items-center justify-center h-32 md:h-40 text-gray-500">
              <div className="text-center">
                <Calendar className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 opacity-20" />
                <p className="text-xs md:text-sm">Calendar view coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div
        className="flex h-screen items-center justify-center text-xl text-white"
        style={{ background: 'linear-gradient(to bottom, #050020, #050020, #050020)' }}
      >
        Loading...
      </div>
    );
  }

  return (
    <SidebarDemo>
      <DashboardContent />
    </SidebarDemo>
  );
}
