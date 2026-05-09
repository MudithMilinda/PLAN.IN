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
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { CalendarEvent } from "@/types/calendar";

interface EventPopupProps {
  event: CalendarEvent;
  anchorRect: DOMRect;
  onClose: () => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
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

export function EventPopup({
  event,
  anchorRect,
  onClose,
  onDelete,
  deletingId,
}: EventPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const POPUP_WIDTH = 320;
  const POPUP_OFFSET = 6;

  // Calculate position
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = anchorRect.right + POPUP_OFFSET;
  let top = anchorRect.top;

  // Flip left if not enough space on right
  if (left + POPUP_WIDTH > viewportWidth - 12) {
    left = anchorRect.left - POPUP_WIDTH - POPUP_OFFSET;
  }
  // Clamp left
  left = Math.max(12, left);

  // Clamp top (estimated popup height ~360px)
  const estimatedHeight = event.isContentPost ? 420 : 280;
  if (top + estimatedHeight > viewportHeight - 12) {
    top = viewportHeight - estimatedHeight - 12;
  }
  top = Math.max(12, top);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Slight delay so the opening click doesn't immediately close it
    const t = setTimeout(
      () => document.addEventListener("mousedown", handler),
      100,
    );
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isContent = event.isContentPost;
  const headerBg = isContent ? "bg-emerald-600" : "bg-indigo-600";

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
      style={{ position: "fixed", top, left, width: POPUP_WIDTH, zIndex: 9999 }}
      className="animate-in fade-in zoom-in-95 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl duration-150"
    >
      {/* Header */}
      <div
        className={`${headerBg} flex items-start justify-between gap-2 px-4 py-3`}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-snug font-semibold text-white">
            {event.title}
          </p>
          <p className="mt-0.5 text-xs text-white/70">{formattedDate}</p>
          {!event.allDay && (
            <p className="text-xs text-white/70">
              {event.startTime} – {event.endTime}
            </p>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-1">
          <button
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            disabled={deletingId === event.id}
            className="rounded-md p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white disabled:opacity-50"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-white/80 transition hover:bg-white/20 hover:text-white"
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex max-h-80 flex-col gap-2.5 overflow-y-auto px-4 py-3">
        {/* Content Post fields */}
        {isContent && (
          <>
            {event.category && (
              <Row icon={<Pin className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-800">{event.category}</span>
              </Row>
            )}
            {platformName && (
              <Row icon={platformIcon}>
                <span className="text-sm text-gray-500">Platform: </span>
                <span className="ml-1 text-sm text-gray-800">
                  {platformName}
                </span>
              </Row>
            )}
            {event.postType && (
              <Row icon={<Palette className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-500">Type: </span>
                <span className="ml-1 text-sm text-gray-800">
                  {event.postType}
                </span>
              </Row>
            )}

            {(event.description || event.caption) && (
              <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-2.5">
                {event.description && (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 text-gray-400">
                      <AlignLeft className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="mb-1 text-xs text-gray-400">Content</p>
                      <p className="text-sm leading-relaxed text-gray-800">
                        {event.description}
                      </p>
                    </div>
                  </div>
                )}
                {event.caption && event.caption !== event.description && (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 text-gray-400">
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </span>
                    <div>
                      <p className="mb-1 text-xs text-gray-400">Caption</p>
                      <p className="text-sm leading-relaxed text-gray-800">
                        {event.caption}
                      </p>
                    </div>
                  </div>
                )}
                {event.hashtags && (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex-shrink-0 text-gray-400">
                      <Hash className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="mb-1 text-xs text-gray-400">Hashtags</p>
                      <p className="text-sm leading-relaxed text-indigo-600">
                        {event.hashtags}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {event.weekLabel && (
              <Row icon={<Calendar className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-500">{event.weekLabel}</span>
                {event.weekTheme && (
                  <span className="text-sm text-gray-400">
                    {" "}
                    · {event.weekTheme}
                  </span>
                )}
              </Row>
            )}
          </>
        )}

        {/* Regular Event fields */}
        {!isContent && (
          <>
            {event.location && (
              <Row icon={<MapPin className="h-3.5 w-3.5" />}>
  <span className="text-sm text-gray-800">{formatLocation(event.location)}</span>
</Row>
            )}
            {event.participants && (
              <Row icon={<Users className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-800">
                  {event.participants}
                </span>
              </Row>
            )}
            {event.category && (
              <Row icon={<Tag className="h-3.5 w-3.5" />}>
                <span className="text-sm text-gray-800">{event.category}</span>
              </Row>
            )}
            {event.description && (
              <Row icon={<AlignLeft className="h-3.5 w-3.5" />} alignTop>
                <span className="text-sm leading-relaxed text-gray-800">
                  {event.description}
                </span>
              </Row>
            )}
            {event.googleEventId && (
              <Row icon={<Calendar className="h-3.5 w-3.5" />}>
                <span className="text-xs font-medium text-green-600">
                  Synced to Google Calendar
                </span>
              </Row>
            )}
            {!event.location &&
              !event.participants &&
              !event.category &&
              !event.description && (
                <p className="py-1 text-sm text-gray-400">
                  No additional details.
                </p>
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
