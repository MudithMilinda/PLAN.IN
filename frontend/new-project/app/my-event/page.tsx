"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  ChevronRight,
  Sparkles,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";

interface Event {
  id: string;
  event_name: string;
  target_audience: string;
  event_date: string;
  location: string;
  event_theme: string;
  marketing_plan?: object | null;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://plan-in.onrender.com";

function MyEventsContent() {
  const router = useRouter();
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    event: Event | null;
  }>({
    open: false,
    event: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_BASE}/api/events`, {
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
      const response = await fetch(
        `${API_BASE}/api/events/${deleteModal.event.id}?clerkUserId=${user.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== deleteModal.event!.id));
        setDeleteModal({ open: false, event: null });
      } else {
        const data = await response.json();
        alert("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch {
      alert("Could not connect to server");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="mt-7 min-h-screen p-4 md:p-6"
      style={{ background: "linear-gradient(to bottom, #020812, #020812)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              My Events
            </h1>
            <p className="text-sm text-gray-400 md:text-base">
              {events.length > 0
                ? `${events.length} event${events.length > 1 ? "s" : ""} — click to view marketing plan`
                : "Manage all your events in one place"}
            </p>
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#4a86b8] border-t-transparent" />
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
            <div className="max-w-md rounded-2xl border border-slate-700/50 bg-slate-800/30 p-12 text-center backdrop-blur-sm">
              <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-500" />
              <h3 className="mb-2 text-xl font-bold text-white">
                No events yet
              </h3>
              <p className="mb-6 text-gray-400">
                Get started by creating your first event
              </p>
              <button
                onClick={() => router.push("/generate-plan")}
                className="mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2f6ea8] to-[#4ba3c7] px-6 py-3 font-semibold text-white"
              >
                <Plus className="h-4 w-4" /> Create Event
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
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeDeleteModal}
              className="absolute top-4 right-4 text-gray-500 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/15">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>

            {/* Text */}
            <h3 className="mb-2 text-center text-xl font-bold text-white">
              Delete Event?
            </h3>
            <p className="mb-1 text-center text-sm text-gray-400">
              You are about to delete
            </p>
            <p className="mb-4 text-center font-semibold text-white">
              &quot;{deleteModal.event.event_name}&quot;
            </p>
            <p className="mb-6 text-center text-xs text-gray-500">
              This will permanently delete the event, all content posts, and
              remove everything from Google Calendar. This action cannot be
              undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 rounded-xl bg-slate-700 py-3 font-semibold text-white transition-all hover:bg-slate-600 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
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

//  Event Card
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
      className="group cursor-pointer rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm transition-all hover:border-[#4a86b8]/30 hover:bg-slate-800/60 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left Side */}
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-3">
            <h3 className="text-xl font-bold text-white transition-all group-hover:bg-gradient-to-r group-hover:from-[#7eb6de] group-hover:to-[#9bccea] group-hover:bg-clip-text group-hover:text-transparent md:text-2xl">
              {event.event_name}
            </h3>
            {hasPlan && (
              <span className="flex items-center gap-1 rounded-full border border-[#4a86b8]/30 bg-[#2f6ea8]/15 px-2 py-0.5 text-xs font-medium text-[#9ac7e6]">
                <Sparkles className="h-3 w-3" />
                Plan Ready
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">
            Audience:{" "}
            <span className="font-semibold text-white">
              {event.target_audience}
            </span>
          </p>
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center gap-2 text-gray-300">
            <div className="rounded-lg bg-slate-700/50 p-2">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-sm">
              {new Date(event.event_date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <div className="rounded-lg bg-slate-700/50 p-2">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-sm">
              {(() => {
                try {
                  const loc =
                    typeof event.location === "string"
                      ? JSON.parse(event.location)
                      : event.location;
                  return loc.venue || loc.city || event.location;
                } catch {
                  return event.location;
                }
              })()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <div className="rounded-lg bg-slate-700/50 p-2">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-sm">{event.event_theme}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Delete Button */}
            <button
              onClick={onDelete}
              className="rounded-lg p-2 text-gray-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
              title="Delete event"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            {/* Arrow */}
            <ChevronRight className="hidden h-5 w-5 text-gray-600 transition-colors group-hover:text-[#7eb6de] md:block" />
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
