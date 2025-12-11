"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { Calendar, MapPin, Users, Plus } from "lucide-react";

interface Event {
  id: string;
  title: string;
  reach: string;
  date: string;
  location: string;
  eventType: string;
}

function MyEventsContent() {
  const router = useRouter();

  // Sample events data - replace with your actual data
  const events: Event[] = [
    {
      id: "1",
      title: "Parinamaya Live in Concert",
      reach: "45.2K",
      date: "November 15, 2025",
      location: "Air Force Ground",
      eventType: "Outdoor Music event",
    },
    {
      id: "2",
      title: "Parinamaya Live in Concert",
      reach: "45.2K",
      date: "November 15, 2025",
      location: "Air Force Ground",
      eventType: "Outdoor Music event",
    },
    {
      id: "3",
      title: "Parinamaya Live in Concert",
      reach: "45.2K",
      date: "November 15, 2025",
      location: "Air Force Ground",
      eventType: "Outdoor Music event",
    },
  ];

  const handleAddEvent = () => {
    router.push("/events/create");
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6 mt-7"
      style={{ background: "linear-gradient(to bottom, #050020, #050020, #050020)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              My Events
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Manage all your events in one place
            </p>
          </div>

          {/* Add Event Button */}
          <button
            onClick={handleAddEvent}
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25 flex items-center gap-2 justify-center md:justify-start"
          >
            <Plus className="w-5 h-5" />
            Add Event
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {/* Empty State - Show if no events */}
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-md">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
              <p className="text-gray-400 mb-6">
                Get started by creating your first event
              </p>
              <button
                onClick={handleAddEvent}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Create Your First Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event }: { event: Event }) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:bg-slate-800/60 transition-all cursor-pointer group">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side - Event Info */}
        <div className="flex-1">
          {/* Event Title & Reach */}
          <div className="mb-3">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
              {event.title}
            </h3>
            <p className="text-gray-400 text-sm">
              Reach: <span className="text-white font-semibold">{event.reach}</span>
            </p>
          </div>
        </div>

        {/* Right Side - Event Details */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Date */}
          <div className="flex items-center gap-2 text-gray-300">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-sm md:text-base">{event.date}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-300">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-sm md:text-base">{event.location}</span>
          </div>

          {/* Event Type */}
          <div className="flex items-center gap-2 text-gray-300">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm md:text-base">{event.eventType}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyEventsPage() {
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
        style={{ background: "linear-gradient(to bottom, #050020, #050020, #050020)" }}
      >
        Loading...
      </div>
    );
  }

  return (
    <SidebarDemo>
      <MyEventsContent />
    </SidebarDemo>
  );
}