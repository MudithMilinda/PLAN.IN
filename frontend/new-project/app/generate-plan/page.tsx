"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SidebarDemo } from "@/components/layout/Sidebar";
import { Calendar } from "lucide-react";

// 1️⃣ TYPES
type FormFields =
  | "eventName"
  | "eventTheme"
  | "targetAudience"
  | "location"
  | "eventDate"
  | "additionalInfo";

interface FormData {
  eventName: string;
  eventTheme: string;
  targetAudience: string;
  location: string;
  eventDate: string;
  additionalInfo: string;
}

type ErrorState = Omit<Record<FormFields, boolean>, "additionalInfo">;
type TouchedState = Omit<Record<FormFields, boolean>, "additionalInfo">;

export default function EventFormPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded)
    return (
      <div className="flex h-screen items-center justify-center text-xl text-white bg-[#050020]">
        Loading...
      </div>
    );

  return (
    <SidebarDemo>
      <EventFormContent userId={user?.id} />
    </SidebarDemo>
  );
}

function EventFormContent({ userId }: { userId?: string }) {
  // 2️⃣ Strong typed form data
  const [formData, setFormData] = useState<FormData>({
    eventName: "",
    eventTheme: "",
    targetAudience: "",
    location: "",
    eventDate: "",
    additionalInfo: "",
  });

  // 3️⃣ Error and touched states
  const [errors, setErrors] = useState<ErrorState>({
    eventName: false,
    eventTheme: false,
    targetAudience: false,
    location: false,
    eventDate: false,
  });

  const [touched, setTouched] = useState<TouchedState>({
    eventName: false,
    eventTheme: false,
    targetAudience: false,
    location: false,
    eventDate: false,
  });

  // 4️⃣ Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const field = e.target.name as FormFields;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (field !== "additionalInfo" && errors[field as keyof ErrorState]) {
      setErrors((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  // 5️⃣ Handle blur (when user leaves field)
  const handleBlur = (fieldName: keyof TouchedState) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate on blur
    if (!formData[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }
  };

  // 6️⃣ Validate form
  const validateForm = (): boolean => {
    const newErrors: ErrorState = {
      eventName: !formData.eventName.trim(),
      eventTheme: !formData.eventTheme.trim(),
      targetAudience: !formData.targetAudience.trim(),
      location: !formData.location.trim(),
      eventDate: !formData.eventDate,
    };

    setErrors(newErrors);
    setTouched({
      eventName: true,
      eventTheme: true,
      targetAudience: true,
      location: true,
      eventDate: true,
    });

    return !Object.values(newErrors).some((error) => error);
  };

  // 7️⃣ Submit handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    // ✅ CORRECT ENDPOINT - /api/events/create use karanna
    const res = await fetch("http://localhost:5000/api/events/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkUserId: userId,
        eventName: formData.eventName,
        eventTheme: formData.eventTheme,
        targetAudience: formData.targetAudience,
        location: formData.location,
        eventDate: formData.eventDate,
        additionalInfo: formData.additionalInfo,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to save event");
    }

    const result = await res.json();
    console.log("Success:", result);
    
    alert("Marketing Plan Generated & Saved! ✅");

    // 🔥 RESET FORM HERE
    setFormData({
      eventName: "",
      eventTheme: "",
      targetAudience: "",
      location: "",
      eventDate: "",
      additionalInfo: "",
    });

    setErrors({
      eventName: false,
      eventTheme: false,
      targetAudience: false,
      location: false,
      eventDate: false,
    });

    setTouched({
      eventName: false,
      eventTheme: false,
      targetAudience: false,
      location: false,
      eventDate: false,
    });

    // Optional: Redirect to events page
    // router.push("/events");
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong while saving your event ❌");
  }
};

  return (
    <div
      className="min-h-screen p-4 md:p-6 mt-7"
      style={{ background: "linear-gradient(to bottom, #050020, #050020)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Tell Us About Your Event
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Fill in your event details below and our AI will create a complete marketing strategy.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Event Information</h2>
            <p className="text-gray-400 text-sm">
              All fields are required unless marked optional.
            </p>
          </div>

          <div className="space-y-6">
            {/* EVENT NAME */}
            <InputField
              label="Event Name"
              name="eventName"
              placeholder="Event name or title"
              value={formData.eventName}
              onChange={handleChange}
              onBlur={() => handleBlur("eventName")}
              error={errors.eventName && touched.eventName}
              errorMessage="Event name is required"
              required
            />

            {/* EVENT THEME - DROPDOWN */}
            <SelectField
              label="Event Categories"
              name="eventTheme"
              value={formData.eventTheme}
              onChange={handleChange}
              onBlur={() => handleBlur("eventTheme")}
              error={errors.eventTheme && touched.eventTheme}
              errorMessage="Event theme is required"
              required
              options={[
                "Music Concerts",
                "Baila Concerts",
                "Party Music Events",
                "DJ / Club Events",
                "Music Festivals",
                "Classical & Carnatic Music Events",
              ]}
            />

            {/* TARGET AUDIENCE - DROPDOWN */}
            <SelectField
              label="Target Audience"
              name="targetAudience"
              value={formData.targetAudience}
              onChange={handleChange}
              onBlur={() => handleBlur("targetAudience")}
              error={errors.targetAudience && touched.targetAudience}
              errorMessage="Target audience is required"
              required
              options={[
                "Youth / Young Adults (15–25)",
                "Young Professionals (25–35)",
                "Adults / Families (35–55)",
                "Tourists / Expat Community",
              ]}
            />

            {/* LOCATION */}
            <InputField
              label="Location"
              name="location"
              placeholder="Event location"
              value={formData.location}
              onChange={handleChange}
              onBlur={() => handleBlur("location")}
              error={errors.location && touched.location}
              errorMessage="Location is required"
              required
            />

            {/* EVENT DATE */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Event Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                <input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  onBlur={() => handleBlur("eventDate")}
                  className={`w-full bg-slate-900/50 border rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none transition-all ${
                    errors.eventDate && touched.eventDate
                      ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                  }`}
                  style={{
                    colorScheme: "dark",
                  }}
                />
              </div>
              {errors.eventDate && touched.eventDate && (
                <p className="text-red-400 text-sm mt-1">Event date is required</p>
              )}
            </div>

            {/* ADDITIONAL INFO */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Additional Information{" "}
                <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
                placeholder="Any special requirements or goals"
                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
            >
              Generate Marketing Plan
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              By submitting, our AI will analyze your event and create a marketing strategy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

/* REUSABLE INPUT COMPONENT */
interface InputProps {
  label: string;
  name: FormFields;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

function InputField({
  label,
  name,
  value,
  placeholder,
  onChange,
  onBlur,
  error = false,
  errorMessage = "",
  required = false,
}: InputProps) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
        }`}
      />
      {error && errorMessage && (
        <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

/* REUSABLE SELECT COMPONENT */
interface SelectProps {
  label: string;
  name: FormFields;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  error = false,
  errorMessage = "",
  required = false,
}: SelectProps) {
  return (
    <div>
      <label className="block text-white font-semibold mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-all ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-700/50 focus:ring-2 focus:ring-purple-500/20"
        }`}
      >
        <option value="" disabled>
          Select {label}
        </option>

        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-900">
            {option}
          </option>
        ))}
      </select>

      {error && errorMessage && (
        <p className="text-red-400 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
