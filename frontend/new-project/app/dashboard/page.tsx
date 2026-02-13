"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { Calendar, Users, CalendarDays } from 'lucide-react';

// ---------------- Dashboard Content ----------------
function DashboardContent({ eventsCount }: { eventsCount: number }) {
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

          {/* Active Events (Dynamic) */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 md:p-4 hover:bg-slate-800/70 transition-all">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-400 text-xs md:text-sm font-medium">Active Events</h3>
              <div className="p-1 md:p-1.5 bg-blue-500/20 rounded-lg">
                <CalendarDays className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white">{eventsCount}</p>
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
          {/* Predicted Engagement Rate */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                <Calendar className="w-4 h-4 text-purple-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Predicted Engagement Rate per Platform</h2>
            </div>
            
            <div className="space-y-4">
              {/* Instagram */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Instagram</span>
                  <span className="text-purple-400 text-sm font-semibold">8.5%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>

              {/* Facebook */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Facebook</span>
                  <span className="text-blue-400 text-sm font-semibold">6.2%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '62%' }}
                  ></div>
                </div>
              </div>

              {/* Twitter/X */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Twitter/X</span>
                  <span className="text-cyan-400 text-sm font-semibold">4.8%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '48%' }}
                  ></div>
                </div>
              </div>

              {/* TikTok */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">TikTok</span>
                  <span className="text-pink-400 text-sm font-semibold">7.3%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '73%' }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-gray-400">
                <span className="text-purple-400 font-medium">AI-Powered Predictions</span> based on event type, audience demographics, and historical community data
              </p>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white">Recent Events</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-700/50 rounded-lg p-3 md:p-4 hover:bg-slate-700/70 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 rounded-lg p-2 text-center min-w-[50px]">
                    <div className="text-purple-300 text-xs font-medium">FEB</div>
                    <div className="text-white text-xl font-bold">25</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1">Parinamaya Live in Concert</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Sri Lanka Exhibition Centre • 5,000 expected</p>
                  </div>
                  <span className="px-2 md:px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
                    Active
                  </span>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3 md:p-4 hover:bg-slate-700/70 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 rounded-lg p-2 text-center min-w-[50px]">
                    <div className="text-blue-300 text-xs font-medium">MAR</div>
                    <div className="text-white text-xl font-bold">10</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1">Tech Innovation Summit 2026</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Colombo • 1,200 expected</p>
                  </div>
                  <span className="px-2 md:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
                    Scheduled
                  </span>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3 md:p-4 hover:bg-slate-700/70 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 rounded-lg p-2 text-center min-w-[50px]">
                    <div className="text-blue-300 text-xs font-medium">MAR</div>
                    <div className="text-white text-xl font-bold">18</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm md:text-base mb-1">Startup Founders Workshop</h3>
                    <p className="text-gray-400 text-xs md:text-sm">Virtual • 300 expected</p>
                  </div>
                  <span className="px-2 md:px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
                    Scheduled
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [eventsCount, setEventsCount] = useState(0);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch user's events and set count
  useEffect(() => {
    const fetchEventsCount = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkUserId: user.id }),
        });

        const data = await response.json();
        if (response.ok) {
          setEventsCount(data.events?.length || 0);
        } else {
          console.error("Failed to fetch events:", data.error);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEventsCount();
  }, [user?.id]);

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
      <DashboardContent eventsCount={eventsCount} />
    </SidebarDemo>
  );
}