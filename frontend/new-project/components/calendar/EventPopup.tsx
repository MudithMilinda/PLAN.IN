"use client";

import {
  AlignLeft,
  Calendar,
  Hash,
  MapPin,
  Mic,
  Palette,
  Phone,
  Pin,
  Smartphone,
  Tag,
  Trash2,
  Upload,
  Users,
  X,
  Pencil,
  Check,
  Loader2,
  Image as ImageIcon,
  Film,
  ExternalLink,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CalendarEvent } from "@/types/calendar";

interface EventPopupProps {
  event: CalendarEvent;
  anchorRect: DOMRect;
  onClose: () => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
  onUpdate?: (id: string, updates: Partial<CalendarEvent>) => void;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Smartphone className="h-4 w-4" />,
  facebook: <Smartphone className="h-4 w-4" />,
  tiktok: <Smartphone className="h-4 w-4" />,
  youtube: <Mic className="h-4 w-4" />,
  twitter: <Phone className="h-4 w-4" />,
};

function formatLocation(location?: string): string {
  if (!location) return "";

  try {
    const parsed = JSON.parse(location);
    return parsed.venue || parsed.city || location;
  } catch {
    return location;
  }
}

const API_BASE =
  process.env.NEXT_PUBLIC_VITE_API_URL ?? "http://localhost:5000";

// ─────────────────────────────────────────────────────────────
// Media Helpers
// ─────────────────────────────────────────────────────────────

function isVideo(url: string) {
  return /\.(mp4|mov|webm|avi)(\?|$)/i.test(url);
}

function MediaThumb({ url }: { url: string }) {
  if (isVideo(url)) {
    return (
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
        <video src={url} className="h-full w-full object-cover" muted />
        <Film className="absolute h-5 w-5 text-white drop-shadow" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="media"
      className="h-16 w-16 rounded-lg object-cover ring-1 ring-gray-200"
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Editable Field
// ─────────────────────────────────────────────────────────────

function EditableField({
  label,
  value,
  icon,
  multiline = false,
  color,
  onSave,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  multiline?: boolean;
  color?: string;
  onSave: (v: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
    }
  }, [editing]);

  const handleSave = async () => {
    setSaving(true);

    try {
      await onSave(draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 flex-shrink-0 text-gray-400">{icon}</span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-gray-400">{label}</p>

          {!editing ? (
            <button
              onClick={() => {
                setDraft(value);
                setEditing(true);
              }}
              className="rounded p-0.5 text-gray-300 transition hover:text-gray-500"
            >
              <Pencil className="h-3 w-3" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded p-0.5 text-emerald-500 transition hover:text-emerald-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </button>

              <button
                onClick={() => setEditing(false)}
                className="rounded p-0.5 text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {editing ? (
          multiline ? (
            <textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm leading-relaxed text-gray-800 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
            />
          ) : (
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm text-gray-800 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"
            />
          )
        ) : (
          <p className={`text-sm leading-relaxed ${color ?? "text-gray-800"}`}>
            {value || <span className="text-gray-300 italic">Empty</span>}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export function EventPopup({
  event,
  anchorRect,
  onClose,
  onDelete,
  deletingId,
  onUpdate,
}: EventPopupProps) {
  const { userId } = useAuth();

  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const POPUP_WIDTH = 340;
  const POPUP_OFFSET = 6;

  // ─────────────────────────────────────────────────────────
  // Editable states
  // ─────────────────────────────────────────────────────────

  const [localContent, setLocalContent] = useState(
    event.contentDescription ?? event.description ?? "",
  );

  const [localCaption, setLocalCaption] = useState(event.caption ?? "");

  const [localHashtags, setLocalHashtags] = useState(event.hashtags ?? "");

  // IMPORTANT FIX
  useEffect(() => {
    setLocalContent(event.contentDescription ?? event.description ?? "");
    setLocalCaption(event.caption ?? "");
    setLocalHashtags(event.hashtags ?? "");
  }, [event]);

  // ─────────────────────────────────────────────────────────
  // Media states
  // ─────────────────────────────────────────────────────────

  const [mediaUrls, setMediaUrls] = useState<string[]>(
    Array.isArray(event.media_urls) ? event.media_urls : [],
  );

  // IMPORTANT FIX FOR REFRESH
  useEffect(() => {
    setMediaUrls(Array.isArray(event.media_urls) ? event.media_urls : []);
  }, [event]);

  const [uploading, setUploading] = useState(false);

  const [uploadError, setUploadError] = useState<string | null>(null);

  const [deletingMediaUrl, setDeletingMediaUrl] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────
  // Position
  // ─────────────────────────────────────────────────────────

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = anchorRect.right + POPUP_OFFSET;
  let top = anchorRect.top;

  if (left + POPUP_WIDTH > viewportWidth - 12) {
    left = anchorRect.left - POPUP_WIDTH - POPUP_OFFSET;
  }

  left = Math.max(12, left);

  const estimatedHeight = event.isContentPost ? 520 : 280;

  if (top + estimatedHeight > viewportHeight - 12) {
    top = viewportHeight - estimatedHeight - 12;
  }

  top = Math.max(12, top);

  // ─────────────────────────────────────────────────────────
  // Close handlers
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 100);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // ─────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────

  const clerkUserId = userId ?? "";

  const postId = event.isContentPost ? event.rawPostId : event.id;

  async function patchPost(updates: Record<string, string>) {
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!postId) {
      throw new Error("Missing post ID");
    }

    const res = await fetch(`${API_BASE}/api/content-posts/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clerkUserId: userId,
        ...updates,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(err.details || err.error || "Save failed");
    }

    const json = await res.json();

    onUpdate?.(event.id, updates);

    return json;
  }

  // ─────────────────────────────────────────────────────────
  // Upload Media
  // ─────────────────────────────────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    if (!clerkUserId) {
      setUploadError("User not authenticated");
      return;
    }

    if (!postId) {
      setUploadError("Missing post ID");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();

      files.forEach((f) => {
        formData.append("files", f);
      });

      formData.append("clerkUserId", clerkUserId);

      const res = await fetch(`${API_BASE}/api/content-posts/${postId}/media`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(err.error || "Upload failed");
      }

      const json = await res.json();

      const newUrls: string[] = json.media_urls || [];

      setMediaUrls(newUrls);

      onUpdate?.(event.id, {
        media_urls: newUrls,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setUploadError(message);
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  // Delete Media
  // ─────────────────────────────────────────────────────────

  async function handleDeleteMedia(urlToDelete: string) {
    if (!postId) {
      setUploadError("Missing post ID");
      return;
    }

    setDeletingMediaUrl(urlToDelete);

    try {
      const res = await fetch(`${API_BASE}/api/content-posts/${postId}/media`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkUserId,
          media_url: urlToDelete,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(err.error || "Delete failed");
      }

      const json = await res.json();

      const newUrls: string[] = json.media_urls || [];

      setMediaUrls(newUrls);

      onUpdate?.(event.id, {
        media_urls: newUrls,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Delete failed";
      setUploadError(message);
    } finally {
      setDeletingMediaUrl(null);
    }
  }

  // ─────────────────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────────────────

  const isContent = event.isContentPost;

  const headerBg = isContent ? "bg-emerald-600" : "bg-[#2f6ea8]";

  const formattedDate = new Date(event.date).toLocaleDateString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const platformName = event.platform
    ? event.platform.charAt(0).toUpperCase() + event.platform.slice(1)
    : null;

  const platformIcon = event.platform
    ? (PLATFORM_ICONS[event.platform.toLowerCase()] ?? (
        <Smartphone className="h-4 w-4" />
      ))
    : null;

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        top,
        left,
        width: POPUP_WIDTH,
        zIndex: 9999,
      }}
      className="animate-in fade-in zoom-in-95 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl duration-150"
    >
      {/* Header */}
      <div
        className={`${headerBg} flex items-start justify-between gap-2 px-4 py-3`}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {event.title}
          </p>

          <p className="mt-0.5 text-xs text-white/70">{formattedDate}</p>
        </div>

        <div className="flex items-center gap-1">
          {isContent && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-md p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
              </button>
            </>
          )}

          <button
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            disabled={deletingId === event.id}
            className="rounded-md p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex max-h-[440px] flex-col gap-2.5 overflow-y-auto px-4 py-3">
        {uploadError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
            {uploadError}
          </div>
        )}

        {/* Media */}
        {mediaUrls.length > 0 && (
          <div className="border-b border-gray-100 pb-3">
            <div className="mb-2 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-gray-400" />

              <p className="text-xs text-gray-400">
                Media ({mediaUrls.length})
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {mediaUrls.map((url, i) => (
                <div key={i} className="group relative">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <MediaThumb url={url} />

                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition group-hover:bg-black/30">
                      <ExternalLink className="h-4 w-4 text-white opacity-0 transition group-hover:opacity-100" />
                    </div>
                  </a>

                  <button
                    onClick={() => handleDeleteMedia(url)}
                    disabled={deletingMediaUrl === url}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow transition hover:bg-red-600"
                  >
                    {deletingMediaUrl === url ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload hint */}
        {mediaUrls.length === 0 && isContent && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400 transition hover:border-emerald-300 hover:text-emerald-600"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                Add photos or videos
              </>
            )}
          </button>
        )}

        {/* Content */}
        {isContent && (
          <>
            {platformName && (
              <Row icon={platformIcon}>
                <span className="text-sm text-gray-500">Platform:</span>

                <span className="ml-1 text-sm text-gray-800">
                  {platformName}
                </span>
              </Row>
            )}

            {event.category && (
              <Row icon={<Tag className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-500">Event Category:</span>

                <span className="ml-1 text-sm text-gray-800">
                  {event.category}
                </span>
              </Row>
            )}

            {event.weekTheme && (
              <Row icon={<Palette className="h-3.5 w-3.5" />} alignTop>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Content Theme</span>
                  <span className="text-sm text-gray-800">
                    {event.weekTheme}
                  </span>
                </div>
              </Row>
            )}

            <EditableField
              label="Content"
              value={localContent}
              icon={<AlignLeft className="h-3.5 w-3.5" />}
              multiline
              onSave={async (v) => {
                await patchPost({
                  content_description: v,
                });

                setLocalContent(v);
              }}
            />

            <EditableField
              label="Caption"
              value={localCaption}
              icon={<Pencil className="h-3.5 w-3.5" />}
              multiline
              onSave={async (v) => {
                await patchPost({
                  caption: v,
                });

                setLocalCaption(v);
              }}
            />

            <EditableField
              label="Hashtags"
              value={localHashtags}
              icon={<Hash className="h-3.5 w-3.5" />}
              multiline
              color="text-[#2f6ea8]"
              onSave={async (v) => {
                await patchPost({
                  hashtags: v,
                });

                setLocalHashtags(v);
              }}
            />
          </>
        )}

        {/* Normal event */}
        {!isContent && (
          <>
            {event.category && (
              <Row icon={<Tag className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-500">Event Category:</span>
                <span className="ml-1 text-sm text-gray-800">
                  {event.category}
                </span>
              </Row>
            )}

            {event.description && (
              <Row icon={<AlignLeft className="h-3.5 w-3.5" />} alignTop>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Event Data</span>
                  <span className="text-sm text-gray-800">
                    {event.description}
                  </span>
                </div>
              </Row>
            )}

            {event.participants && (
              <Row icon={<Users className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-500">Target Audience:</span>
                <span className="ml-1 text-sm text-gray-800">
                  {event.participants}
                </span>
              </Row>
            )}

            {event.location && (
              <Row icon={<MapPin className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-800">
                  {formatLocation(event.location)}
                </span>
              </Row>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Row({
  icon,
  children,
  alignTop = false,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  alignTop?: boolean;
}) {
  return (
    <div
      className={`flex gap-2.5 ${alignTop ? "items-start" : "items-center"}`}
    >
      <span
        className={`flex-shrink-0 text-gray-400 ${alignTop ? "mt-0.5" : ""}`}
      >
        {icon}
      </span>

      <div className="flex min-w-0 flex-wrap items-center gap-0.5">
        {children}
      </div>
    </div>
  );
}
