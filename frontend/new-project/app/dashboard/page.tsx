"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Send,
  ExternalLink,
  Pencil,
  Save,
  X,
  TrendingUp,
  Activity,
} from "lucide-react";

interface EventItem {
  id: string;
  event_name: string;
  location: string;
  event_date: string;
}

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  telegramUrl: string;
}

function DashboardContent({
  events,
  onOpenEvent,
  profile,
  profileForm,
  isEditing,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onChangeProfile,
  onSaveProfile,
}: {
  events: EventItem[];
  onOpenEvent: (eventId: string) => void;
  profile: ProfileForm;
  profileForm: ProfileForm;
  isEditing: boolean;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onChangeProfile: (field: keyof ProfileForm, value: string) => void;
  onSaveProfile: () => void;
}) {
  const { user } = useUser();

  const socialLinks = [
    { icon: Instagram, href: profile.instagramUrl },
    { icon: Facebook, href: profile.facebookUrl },
    { icon: Twitter, href: profile.twitterUrl },
    { icon: Send, href: profile.telegramUrl },
  ];

  const ongoingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
      .filter((event) => {
        const eventDate = new Date(event.event_date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
      );
  }, [events]);

  const shownEvents = useMemo(() => ongoingEvents.slice(0, 6), [ongoingEvents]);

  return (
    <div
      className="mt-7 min-h-screen p-4 md:p-6"
      style={{ background: "#050020" }}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-[1.9fr_0.9fr]">
          <section className="h-full rounded-3xl border border-[#2a2a5a] bg-[#0C0C29] p-5 shadow-[0_20px_80px_rgba(8,8,40,0.55)] backdrop-blur-md md:p-7">
            <div className="flex h-full flex-col gap-6 md:flex-row md:items-center">
              <div className="flex justify-center md:justify-start">
                <img
                  src={
                    user?.imageUrl ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"
                  }
                  alt="User profile picture"
                  className="h-28 w-28 rounded-full border-4 border-[#7f66d6] object-cover md:h-32 md:w-32"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h1 className="text-2xl font-bold text-white md:text-3xl">
                    {profile.fullName || user?.fullName || "PLAN.IN Creator"}
                  </h1>
                  {!isEditing ? (
                    <button
                      onClick={onStartEdit}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#2d2066] px-3 py-2 text-sm text-[#d8cbff] transition-colors hover:bg-[#5138a3]"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onCancelEdit}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#2f274d] px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-[#3d3360]"
                      >
                        <X className="h-4 w-4" /> Cancel
                      </button>
                      <button
                        onClick={onSaveProfile}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-60"
                      >
                        <Save className="h-4 w-4" />{" "}
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <p className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4 text-[#b79cf8]" />
                      {profile.email ||
                        user?.primaryEmailAddress?.emailAddress ||
                        "yourmail@example.com"}
                    </p>
                    <p className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4 text-[#b79cf8]" />
                      {profile.phone || "+94 77 000 0000"}
                    </p>
                    <p className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-[#b79cf8]" />
                      {profile.location || "Colombo, Sri Lanka"}
                    </p>
                    <p className="flex items-center gap-2 text-gray-300">
                      <CalendarDays className="h-4 w-4 text-[#b79cf8]" />
                      Active events: {events.length}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Full name"
                      value={profileForm.fullName}
                      onChange={(e) =>
                        onChangeProfile("fullName", e.target.value)
                      }
                    />
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Email"
                      value={profileForm.email}
                      onChange={(e) => onChangeProfile("email", e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Phone"
                      value={profileForm.phone}
                      onChange={(e) => onChangeProfile("phone", e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Location"
                      value={profileForm.location}
                      onChange={(e) =>
                        onChangeProfile("location", e.target.value)
                      }
                    />
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Instagram URL"
                      value={profileForm.instagramUrl}
                      onChange={(e) =>
                        onChangeProfile("instagramUrl", e.target.value)
                      }
                    />
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Facebook URL"
                      value={profileForm.facebookUrl}
                      onChange={(e) =>
                        onChangeProfile("facebookUrl", e.target.value)
                      }
                    />
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Twitter URL"
                      value={profileForm.twitterUrl}
                      onChange={(e) =>
                        onChangeProfile("twitterUrl", e.target.value)
                      }
                    />
                    <input
                      className="rounded-lg border border-[#4a3b85] bg-[#1e1452] px-3 py-2 text-white outline-none"
                      placeholder="Telegram URL"
                      value={profileForm.telegramUrl}
                      onChange={(e) =>
                        onChangeProfile("telegramUrl", e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="mt-5 flex items-center gap-3">
                  {socialLinks.map((item, index) => (
                    <a
                      key={index}
                      href={item.href || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d2066] text-[#d8cbff] transition-colors hover:bg-[#5138a3]"
                    >
                      <item.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-rows-2 gap-4">
            <div className="min-h-[170px] rounded-2xl border border-[#2a2a5a] bg-[#0C0C29] p-5 shadow-[0_12px_35px_rgba(8,8,40,0.45)]">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6f5bd6]/25 text-[#cdbdff]">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#d8d8ea]">
                Total Events
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-3xl font-bold text-white">{events.length}</p>
                <span className="rounded-full bg-[#2a2a5a] px-2 py-1 text-[11px] text-[#bda9ff]">
                  +{Math.max(events.length, 1)}%
                </span>
              </div>
              <p className="mt-3 text-xs text-[#9da0bf]">
                Overall events created in your workspace.
              </p>
            </div>
            <div className="min-h-[170px] rounded-2xl border border-[#2a2a5a] bg-[#0C0C29] p-5 shadow-[0_12px_35px_rgba(8,8,40,0.45)]">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#d8d8ea]">
                Ongoing Events
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-3xl font-bold text-white">
                  {ongoingEvents.length}
                </p>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] text-emerald-300">
                  Live
                </span>
              </div>
              <p className="mt-3 text-xs text-[#9da0bf]">
                Events not passed yet, active from today onward.
              </p>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-[#2a2a5a] bg-[#0C0C29] p-5 md:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white md:text-2xl">
              Ongoing Events
            </h2>
            <span className="rounded-full bg-[#2d2066] px-3 py-1 text-xs text-[#bda9ff] md:text-sm">
              {ongoingEvents.length} total
            </span>
          </div>

          {shownEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shownEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-[#3b2f6f] bg-[#130c42] p-4 transition-colors hover:border-[#7c5de1]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base leading-snug font-semibold text-white">
                      {event.event_name}
                    </h3>
                    <button
                      onClick={() => onOpenEvent(event.id)}
                      className="rounded-full bg-pink-500/20 px-3 py-1 text-xs text-pink-300"
                    >
                      View
                    </button>
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-sm text-gray-300">
                    <MapPin className="h-4 w-4 text-[#b79cf8]" />
                    {event.location || "Location TBD"}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-sm text-gray-300">
                    <CalendarDays className="h-4 w-4 text-[#b79cf8]" />
                    {new Date(event.event_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <button
                    onClick={() => onOpenEvent(event.id)}
                    className="mt-4 flex items-center gap-1 text-xs text-[#d5c6ff] transition-colors hover:text-white"
                  >
                    Open details <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#4a3b85] p-10 text-center">
              <p className="text-gray-300">
                No events yet. Create one from Generate Plan.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    telegramUrl: "",
  });
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    instagramUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    telegramUrl: "",
  });

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user) return;
    const defaults: ProfileForm = {
      fullName: user.fullName || "",
      email: user.primaryEmailAddress?.emailAddress || "",
      phone: "",
      location: "",
      instagramUrl: "",
      facebookUrl: "",
      twitterUrl: "",
      telegramUrl: "",
    };
    setProfile(defaults);
    setProfileForm(defaults);
  }, [user]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkUserId: user.id }),
        });

        const data = await response.json();
        if (response.ok) {
          setEvents(data.events || []);
        } else {
          console.error("Failed to fetch events:", data.error);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [user?.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkUserId: user.id }),
        });
        const data = await response.json();
        if (response.ok && data.profile) {
          const loaded: ProfileForm = {
            fullName: data.profile.full_name || user.fullName || "",
            email:
              data.profile.email ||
              user.primaryEmailAddress?.emailAddress ||
              "",
            phone: data.profile.phone || "",
            location: data.profile.location || "",
            instagramUrl: data.profile.instagram_url || "",
            facebookUrl: data.profile.facebook_url || "",
            twitterUrl: data.profile.twitter_url || "",
            telegramUrl: data.profile.telegram_url || "",
          };
          setProfile(loaded);
          setProfileForm(loaded);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkUserId: user.id, ...profileForm }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save profile");
      }
      const saved: ProfileForm = {
        fullName: data.profile.full_name || "",
        email: data.profile.email || "",
        phone: data.profile.phone || "",
        location: data.profile.location || "",
        instagramUrl: data.profile.instagram_url || "",
        facebookUrl: data.profile.facebook_url || "",
        twitterUrl: data.profile.twitter_url || "",
        telegramUrl: data.profile.telegram_url || "",
      };
      setProfile(saved);
      setProfileForm(saved);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) return null;

  return (
    <SidebarDemo>
      <DashboardContent
        events={events}
        onOpenEvent={(eventId) => router.push(`/events/${eventId}`)}
        profile={profile}
        profileForm={profileForm}
        isEditing={isEditing}
        isSaving={isSaving}
        onStartEdit={() => setIsEditing(true)}
        onCancelEdit={() => {
          setProfileForm(profile);
          setIsEditing(false);
        }}
        onChangeProfile={(field, value) =>
          setProfileForm((prev) => ({
            ...prev,
            [field]: value,
          }))
        }
        onSaveProfile={handleSaveProfile}
      />
    </SidebarDemo>
  );
}
