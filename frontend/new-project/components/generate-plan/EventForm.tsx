"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, Building2, Globe } from "lucide-react";
import { FormData, ErrorState, TouchedState, ApiResult } from "../../types/marketing";
import { targetAudienceMap, EVENT_CATEGORIES } from "../../lib/targetAudienceMap";
import { InputField, SelectField } from "./shared";

const DURATION_OPTIONS = [
  "Half Day (< 4 hours)",
  "1 Day",
  "2–3 Days",
  "1 Week Campaign",
  "2 Week Campaign",
  "1 Month Campaign",
  "Ongoing / Recurring",
];

interface Props {
  userId?: string;
  onSuccess: (result: ApiResult) => void;
}

// ── targetAudience is now string[] ─────────────────────────────────────────
interface FormDataMulti extends Omit<FormData, "targetAudience"> {
  targetAudience: string[];
}

const DEFAULT_FORM: FormDataMulti = {
  eventName: "",
  eventTheme: "",
  targetAudience: [],          // array now
  duration: "",
  location: { city: "", venue: "", country: "" },
  eventDate: "",
  additionalInfo: "",
};

const DEFAULT_ERRORS: ErrorState = {
  eventName: false,
  eventTheme: false,
  targetAudience: false,
  duration: false,
  locationCity: false,
  eventDate: false,
};

const DEFAULT_TOUCHED: TouchedState = { ...DEFAULT_ERRORS };

export function EventForm({ userId, onSuccess }: Props) {
  const [formData, setFormData] = useState<FormDataMulti>(DEFAULT_FORM);
  const [errors, setErrors]     = useState<ErrorState>(DEFAULT_ERRORS);
  const [touched, setTouched]   = useState<TouchedState>(DEFAULT_TOUCHED);
  const [audiences, setAudiences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Toggle a single audience item in/out of the array
  const handleAudienceToggle = (audience: string) => {
    setFormData((prev) => {
      const already = prev.targetAudience.includes(audience);
      return {
        ...prev,
        targetAudience: already
          ? prev.targetAudience.filter((a) => a !== audience)
          : [...prev.targetAudience, audience],
      };
    });
    setErrors((prev) => ({ ...prev, targetAudience: false }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Location sub-fields
    if (name === "locationCity" || name === "locationVenue" || name === "locationCountry") {
      const key =
        name === "locationCity" ? "city" : name === "locationVenue" ? "venue" : "country";
      setFormData((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }));
      if (name === "locationCity" && errors.locationCity)
        setErrors((prev) => ({ ...prev, locationCity: false }));
      return;
    }

    // Event theme → update dynamic audience list, reset targetAudience array
    if (name === "eventTheme") {
      setAudiences(targetAudienceMap[value] || []);
      setFormData((prev) => ({ ...prev, eventTheme: value, targetAudience: [] }));
      setErrors((prev) => ({ ...prev, eventTheme: false, targetAudience: false }));
      return;
    }

    // All other fields
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name in errors && errors[name as keyof ErrorState])
      setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleBlur = (key: keyof TouchedState, isEmpty: boolean) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    if (isEmpty) setErrors((prev) => ({ ...prev, [key]: true }));
  };

  const validateForm = (): boolean => {
    const newErrors: ErrorState = {
      eventName:      !formData.eventName.trim(),
      eventTheme:     !formData.eventTheme.trim(),
      targetAudience: formData.targetAudience.length === 0,   // array check
      duration:       !formData.duration.trim(),
      locationCity:   !formData.location.city.trim(),
      eventDate:      !formData.eventDate,
    };
    setErrors(newErrors);
    setTouched({
      eventName: true, eventTheme: true, targetAudience: true,
      duration: true, locationCity: true, eventDate: true,
    });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    const eventDateISO = new Date(formData.eventDate).toISOString();

    const payload = {
      clerkUserId: userId,
      eventName:      formData.eventName,
      eventTheme:     formData.eventTheme,
      targetAudience: formData.targetAudience,   // string[] sent as-is
      duration:       formData.duration,
      location: {
        city:    formData.location.city,
        venue:   formData.location.venue   || undefined,
        country: formData.location.country || undefined,
      },
      eventDate:      eventDateISO,
      additionalInfo: formData.additionalInfo || undefined,
    };

    try {
      const res = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }
      const result = await res.json();

      onSuccess({
        marketingPlan: result.marketingPlan,
        event: {
          eventName:  result.event.event_name,
          eventDate:  result.event.event_date,
          location:   result.event.location,
          eventTheme: result.event.event_theme,
          duration:   result.event.duration,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert("Something went wrong ❌ — " + msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="mt-7 min-h-screen p-4 md:p-6" style={{ background: "#050020" }}>
      <div className="mx-auto max-w-4xl">
        {/* Page header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-bold text-white md:text-4xl">
            Tell Us About Your Event
          </h1>
          <p className="text-sm text-gray-400 md:text-base">
            Fill in your event details below and our AI will create a complete marketing strategy.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm md:p-8"
        >
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold text-white">Event Information</h2>
            <p className="text-sm text-gray-400">All fields are required unless marked optional.</p>
          </div>

          <div className="space-y-6">
            {/* ── Event Name ── */}
            <InputField
              label="Event Name"
              name="eventName"
              placeholder="Event name or title"
              value={formData.eventName}
              onChange={handleChange}
              onBlur={() => handleBlur("eventName", !formData.eventName.trim())}
              error={errors.eventName && touched.eventName}
              errorMessage="Event name is required"
              required
            />

            {/* ── Event Category ── */}
            <SelectField
              label="Event Categories"
              name="eventTheme"
              value={formData.eventTheme}
              onChange={handleChange}
              onBlur={() => handleBlur("eventTheme", !formData.eventTheme.trim())}
              error={errors.eventTheme && touched.eventTheme}
              errorMessage="Event category is required"
              required
              options={EVENT_CATEGORIES}
            />

            {/* ── Target Audience — multi-select checkboxes ── */}
            <div>
              <p className="mb-2 font-semibold text-white">
                Target Audience <span className="text-red-400">*</span>
              </p>

              {/* Selected badges */}
              {formData.targetAudience.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {formData.targetAudience.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 rounded-full bg-purple-600/30 px-3 py-1 text-xs font-medium text-purple-300 border border-purple-500/40"
                    >
                      {a}
                      <button
                        type="button"
                        onClick={() => handleAudienceToggle(a)}
                        className="ml-0.5 text-purple-400 hover:text-white transition-colors"
                        aria-label={`Remove ${a}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div
                className={`rounded-xl border p-4 bg-slate-900/40 ${
                  errors.targetAudience && touched.targetAudience
                    ? "border-red-500"
                    : "border-slate-700/40"
                }`}
              >
                {audiences.length === 0 ? (
                  <p className="text-gray-500 text-sm">Select an Event Category first</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {audiences.map((audience) => {
                      const checked = formData.targetAudience.includes(audience);
                      return (
                        <label
                          key={audience}
                          className={`flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2.5 transition-all border ${
                            checked
                              ? "bg-purple-600/20 border-purple-500/50 text-white"
                              : "bg-slate-800/40 border-slate-700/30 text-gray-400 hover:border-slate-600 hover:text-gray-200"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-all ${
                              checked
                                ? "bg-purple-600 border-purple-500"
                                : "border-slate-500"
                            }`}
                          >
                            {checked && (
                              <svg
                                className="h-2.5 w-2.5 text-white"
                                viewBox="0 0 10 10"
                                fill="none"
                              >
                                <path
                                  d="M1.5 5L4 7.5L8.5 2.5"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => handleAudienceToggle(audience)}
                          />
                          <span className="text-sm">{audience}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {errors.targetAudience && touched.targetAudience && (
                <p className="mt-1 text-sm text-red-400">
                  Please select at least one target audience
                </p>
              )}

              {formData.targetAudience.length > 0 && (
                <p className="mt-1.5 text-xs text-gray-500">
                  {formData.targetAudience.length} audience
                  {formData.targetAudience.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            {/* ── Event Duration ── */}
            <SelectField
              label="Event Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              onBlur={() => handleBlur("duration", !formData.duration.trim())}
              error={errors.duration && touched.duration}
              errorMessage="Event duration is required"
              required
              options={DURATION_OPTIONS}
            />

            {/* ── Location (structured) ── */}
            <div>
              <p className="mb-3 font-semibold text-white">
                Location <span className="text-red-400">*</span>
              </p>

              <div className="space-y-3 rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
                {/* City — required */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-300">
                    <MapPin className="h-4 w-4 text-purple-400" />
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="locationCity"
                    value={formData.location.city}
                    placeholder="e.g. Colombo"
                    onChange={handleChange}
                    onBlur={() => handleBlur("locationCity", !formData.location.city.trim())}
                    className={`w-full rounded-lg border bg-slate-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:outline-none ${
                      errors.locationCity && touched.locationCity
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                    }`}
                  />
                  {errors.locationCity && touched.locationCity && (
                    <p className="mt-1 text-sm text-red-400">City is required</p>
                  )}
                </div>

                {/* Venue — optional */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Building2 className="h-4 w-4 text-blue-400" />
                    Venue Name{" "}
                    <span className="font-normal text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="locationVenue"
                    value={formData.location.venue ?? ""}
                    placeholder="e.g. Nelum Pokuna Theatre"
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>

                {/* Country — optional */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    Country{" "}
                    <span className="font-normal text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="locationCountry"
                    value={formData.location.country ?? ""}
                    placeholder="e.g. Sri Lanka"
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Event Date (timezone-aware) ── */}
            <div>
              <label className="mb-2 block font-semibold text-white">
                Event Date &amp; Time <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute top-1/2 left-4 z-10 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  onBlur={() => handleBlur("eventDate", !formData.eventDate)}
                  className={`w-full rounded-lg border bg-slate-900/50 py-3 pr-4 pl-12 text-white transition-all focus:outline-none ${
                    errors.eventDate && touched.eventDate
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  }`}
                  style={{ colorScheme: "dark" }}
                />
              </div>
              {errors.eventDate && touched.eventDate && (
                <p className="mt-1 text-sm text-red-400">Event date is required</p>
              )}
              {formData.eventDate && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  Will be sent as:{" "}
                  <span className="font-mono text-gray-400">
                    {new Date(formData.eventDate).toISOString()}
                  </span>
                </p>
              )}
            </div>

            {/* ── Additional Info ── */}
            <div>
              <label className="mb-2 block font-semibold text-white">
                Additional Information{" "}
                <span className="font-normal text-gray-500">(Optional)</span>
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                placeholder="Any special requirements, budget hints, or goals"
                className="w-full resize-none rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
              />
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full transform rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating Marketing Plan...
                </span>
              ) : (
                "Generate Marketing Plan"
              )}
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
              By submitting, our AI will analyze your event and create a marketing strategy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}