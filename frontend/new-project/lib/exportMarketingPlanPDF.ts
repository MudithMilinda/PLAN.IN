/**
 * 
 *
 * Calls the backend /api/export-pdf endpoint and triggers a browser download.
 * Backend expects: { event: EventDetail }
 * Backend returns:  application/pdf stream
 */

interface WeeklyPost {
  day: string;
  type: string;
  platform: string;
  contentDescription: string;
  caption: string;
  hashtags: string;
}

interface WeeklyContent {
  week: string;
  theme: string;
  posts: WeeklyPost[];
}

interface MarketingPlan {
  summary: string;
  channels: {
    name: string;
    priority: string;
    strategy: string;
    contentTypes: string[];
  }[];
  timeline: {
    phase: string;
    duration: string;
    focus: string;
    tasks: string[];
  }[];
  budgetAllocation: {
    category: string;
    percentage: number;
    description: string;
  }[];
  contentIdeas: { type: string; idea: string; platform: string }[];
  keyMessages: string[];
  successMetrics: string[];
  quickWins: string[];
  weeklyContentCalendar?: WeeklyContent[];
}

interface EventDetail {
  id: string;
  event_name: string;
  event_theme: string;
  target_audience: string;
  location: string;
  event_date: string;
  additional_info?: string;
  marketing_plan: MarketingPlan | null;
}

/**
 * Derives a safe filename from the event name.
 * Mirrors the safeFilename() helper in the backend router.
 */
function safeFilename(eventName?: string): string {
  const base = (eventName ?? "marketing_plan")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
  return `${base}_marketing_plan.pdf`;
}

/**
 * Fetches the PDF from the backend and triggers a browser download.
 *
 * @param event  - Full EventDetail object (same shape the detail page holds in state)
 * @param apiBase - Optional base URL override (defaults to http://localhost:5000)
 */
export async function exportMarketingPlanPDF(
  event: EventDetail,
  clerkUserId?: string,
  apiBase = "http://localhost:5000",
): Promise<void> {
  const endpoint = `${apiBase}/api/export-pdf`;

  let blob: Blob;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clerkUserId ? { "x-clerk-user-id": clerkUserId } : {}),
      },
      body: JSON.stringify({ event, clerkUserId }),
    });

    if (!response.ok) {
      // Try to read a JSON error body if the backend sent one
      let message = `PDF export failed (HTTP ${response.status})`;
      try {
        const errBody = await response.json();
        if (errBody?.error) message = errBody.error;
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    blob = await response.blob();
  } catch (err) {
    console.error("[exportMarketingPlanPDF]", err);
    // Re-throw so the caller / UI can show an error toast
    throw err;
  }

  //  Trigger browser download 
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFilename(event.event_name);

  // Append → click → remove (works in all modern browsers)
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Free the object URL after a short delay so the download has time to start
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
