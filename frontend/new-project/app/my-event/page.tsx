"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {SidebarDemo} from "@/components/layout/Sidebar";
import { Calendar, MapPin, Users, Plus } from "lucide-react";

interface Event {
  id: string;
  event_name: string;
  target_audience: string;
  event_date: string;
  location: string;
  event_theme: string;
}

function MyEventsContent() {
  const router = useRouter();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from Express backend using POST
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clerkUserId: user.id
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setEvents(data.events || []);
        } else {
          console.error('Error fetching events:', data.error);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.id]);

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
        {loading ? (
          <p className="text-center text-white mt-10">Loading events...</p>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-md">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
              <p className="text-gray-400 mb-6">
                Get started by creating your first event
              </p>
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
          <div className="mb-3">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
              {event.event_name}
            </h3>
            <p className="text-gray-400 text-sm">
              Audience: <span className="text-white font-semibold">{event.target_audience}</span>
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
            <span className="text-sm md:text-base">
              {new Date(event.event_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
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
            <span className="text-sm md:text-base">{event.event_theme}</span>
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