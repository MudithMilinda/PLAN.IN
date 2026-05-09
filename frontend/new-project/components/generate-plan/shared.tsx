"use client";
//PlanCard, CopyButton, InputField, SelectField

import React, { useState } from "react";
import {
  Copy,
  Check,
  Video,
  Layers,
  Instagram,
  Image,
} from "lucide-react";

// ─── COPY BUTTON ──────────────────────────────────────────────────────────────
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 rounded-lg border border-slate-600/50 bg-slate-700/50 px-2 py-1 text-xs text-gray-400 transition-all hover:bg-slate-600/50 hover:text-white"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  );
}

// ─── POST TYPE ICON ───────────────────────────────────────────────────────────
export function PostTypeIcon({ type }: { type: string }) {
  const t = type.toLowerCase();
  if (t.includes("video") || t.includes("reel"))
    return <Video className="h-3.5 w-3.5" />;
  if (t.includes("carousel")) return <Layers className="h-3.5 w-3.5" />;
  if (t.includes("story")) return <Instagram className="h-3.5 w-3.5" />;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image className="h-3.5 w-3.5" />;
}

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
export function PlanCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700/50">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── SHARED PLACEHOLDER STYLE (font-size + family එකම) ───────────────────────
// සියලුම input/select/textarea වලට apply වෙන common style object
const sharedInputClass =
  "w-full rounded-lg border bg-slate-900/50 px-4 py-3 text-sm font-normal text-white " +
  "placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 " +
  "transition-all focus:outline-none";

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
interface InputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

export function InputField({
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
      <label className="mb-2 block font-semibold text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`${sharedInputClass} ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-700/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
        }`}
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}

// ─── SELECT FIELD ─────────────────────────────────────────────────────────────
interface SelectProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  onBlur,
  error = false,
  errorMessage = "",
  required = false,
  disabled = false,
  placeholder,
}: SelectProps) {
  return (
    <div>
      <label className="mb-2 block font-semibold text-white">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`${sharedInputClass} disabled:cursor-not-allowed disabled:opacity-50 ${
          // value="" නම් placeholder color, otherwise white
          !value ? "text-gray-500" : "text-white"
        } ${
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
            : "border-slate-700/50 focus:ring-2 focus:ring-purple-500/20"
        }`}
      >
        <option value="" disabled className="text-sm font-normal text-gray-500 bg-slate-900">
          {placeholder ?? `Select ${label}`}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-sm font-normal text-white bg-slate-900">
            {option}
          </option>
        ))}
      </select>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}