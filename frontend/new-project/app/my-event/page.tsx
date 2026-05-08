"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { Calendar, MapPin, Users, Plus, ChevronRight, Sparkles, Trash2, X, AlertTriangle } from "lucide-react";

interface Event {
  id: string;
  event_name: string;
  target_audience: string;
  event_date: string;
  location: string;
  event_theme: string;
  marketing_plan?: object | null;
}

function MyEventsContent() {
  const router = useRouter();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; event: Event | null }>({
    open: false,
    event: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const response = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkUserId: user.id }),
        });
        const data = await response.json();
        if (response.ok) setEvents(data.events || []);
        else console.error("Error fetching events:", data.error);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user?.id]);

  const openDeleteModal = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setDeleteModal({ open: true, event });
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModal({ open: false, event: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.event || !user?.id) return;
    setDeleting(true);

    try {
      // ✅ clerkUserId query param හරහා යවනවා
      // DELETE requests වලදී fetch() body ignore කරනවා — query param safe
      const response = await fetch(
        `http://localhost:5000/api/events/${deleteModal.event.id}?clerkUserId=${user.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== deleteModal.event!.id));
        setDeleteModal({ open: false, event: null });
      } else {
        const data = await response.json();
        alert("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Could not connect to server");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6 mt-7"
      style={{ background: "linear-gradient(to bottom, #050020, #050020)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Events</h1>
            <p className="text-gray-400 text-sm md:text-base">
              {events.length > 0
                ? `${events.length} event${events.length > 1 ? "s" : ""} — click to view marketing plan`
                : "Manage all your events in one place"}
            </p>
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading your events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => router.push(`/events/${event.id}`)}
                onDelete={(e) => openDeleteModal(e, event)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-md">
              <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No events yet</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first event</p>
              <button
                onClick={() => router.push("/events/create")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" /> Create Event
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && deleteModal.event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />

          {/* Modal */}
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon */}
            <div className="w-12 h-12 bg-red-500/15 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>

            {/* Text */}
            <h3 className="text-white font-bold text-xl text-center mb-2">Delete Event?</h3>
            <p className="text-gray-400 text-sm text-center mb-1">
              You are about to delete
            </p>
            <p className="text-white font-semibold text-center mb-4">
              "{deleteModal.event.event_name}"
            </p>
            <p className="text-gray-500 text-xs text-center mb-6">
              This will permanently delete the event, all content posts, and remove everything from Google Calendar. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({
  event,
  onClick,
  onDelete,
}: {
  event: Event;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const hasPlan = !!event.marketing_plan;

  return (
    <div
      onClick={onClick}
      className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:bg-slate-800/60 hover:border-purple-500/30 transition-all cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left Side */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
              {event.event_name}
            </h3>
            {hasPlan && (
              <span className="flex items-center gap-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" />
                Plan Ready
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            Audience: <span className="text-white font-semibold">{event.target_audience}</span>
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center">
          <div className="flex items-center gap-2 text-gray-300">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-sm">
              {new Date(event.event_date).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-sm">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">{event.event_theme}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Delete Button */}
            <button
              onClick={onDelete}
              className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors hidden md:block" />
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
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return null;

  return (
    <SidebarDemo>
      <MyEventsContent />
    </SidebarDemo>
  );
}