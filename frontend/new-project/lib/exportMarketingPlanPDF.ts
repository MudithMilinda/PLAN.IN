// exportMarketingPlanPDF.ts
// Usage: import { exportMarketingPlanPDF } from '@/lib/exportMarketingPlanPDF';
//
// npm install jspdf

import jsPDF from "jspdf";

// ─── Types ────────────────────────────────────────────────────────────────────
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
  id?: string;
  event_name: string;
  event_theme: string;
  target_audience: string;
  location: string;
  event_date: string;
  additional_info?: string;
  marketing_plan: MarketingPlan | null;
}

// ─── Color Palette (Light Theme) ─────────────────────────────────────────────
const C = {
  purple:      [79,  70,  229] as [number, number, number],
  purpleLight: [238, 242, 255] as [number, number, number],
  teal:        [5,   150, 105] as [number, number, number],
  tealLight:   [236, 253, 245] as [number, number, number],
  orange:      [217, 119, 6]   as [number, number, number],
  orangeLight: [255, 251, 235] as [number, number, number],
  pink:        [225, 29,  72]  as [number, number, number],
  pinkLight:   [255, 241, 242] as [number, number, number],
  cyan:        [2,   132, 199] as [number, number, number],
  cyanLight:   [240, 249, 255] as [number, number, number],
  red:         [220, 38,  38]  as [number, number, number],
  redLight:    [254, 242, 242] as [number, number, number],
  gray:        [107, 114, 128] as [number, number, number],
  grayLight:   [249, 250, 251] as [number, number, number],
  grayBorder:  [229, 231, 235] as [number, number, number],
  white:       [255, 255, 255] as [number, number, number],
  black:       [17,  24,  39]  as [number, number, number],
  border:      [209, 213, 219] as [number, number, number],
};

const BUDGET_COLORS: [number, number, number][] = [
  [79, 70, 229], [225, 29, 72], [2, 132, 199],
  [5, 150, 105], [217, 119, 6], [124, 58, 237],
];

const WEEK_COLORS: [number, number, number][] = [
  C.purple, C.cyan, C.teal, C.orange, C.pink, C.red,
];
const WEEK_BG: [number, number, number][] = [
  C.purpleLight, C.cyanLight, C.tealLight, C.orangeLight, C.pinkLight, C.redLight,
];

// ─── FIX 1: formatLocation — handles raw string OR JSON object ────────────────
function formatLocation(location: string): string {
  if (!location) return "";
  try {
    const parsed = JSON.parse(location);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed.venue || parsed.city || parsed.name || location;
    }
    return location;
  } catch {
    return location;
  }
}

// ─── FIX 2: stripUnsupported — removes emoji & non-Latin-1 chars ─────────────
function strip(text: unknown): string {
  if (text == null) return "";
  return String(text)
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu,   "")
    .replace(/[\u{FE00}-\u{FEFF}]/gu,   "")
    .replace(/[^\x00-\u024F]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function wrap(doc: jsPDF, text: unknown, maxWidth: number): string[] {
  return doc.splitTextToSize(strip(text), maxWidth);
}

function sectionHeader(
  doc: jsPDF, label: string, y: number,
  color: [number, number, number], pageWidth: number, margin: number
): number {
  const H = 9;
  doc.setFillColor(...color);
  doc.roundedRect(margin, y, pageWidth - margin * 2, H, 2, 2, "F");
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...C.white);
  doc.text(label, margin + 4, y + 6.2);
  doc.setTextColor(...C.black);
  return y + H + 5;
}

function badge(
  doc: jsPDF, label: string, x: number, y: number,
  bg: [number, number, number], fg: [number, number, number]
): number {
  doc.setFont("helvetica", "bold").setFontSize(7);
  const w = doc.getTextWidth(label) + 6;
  doc.setFillColor(...bg);
  doc.roundedRect(x, y - 4, w, 5.5, 1.5, 1.5, "F");
  doc.setTextColor(...fg);
  doc.text(label, x + 3, y);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...C.black);
  return w;
}

function checkPage(doc: jsPDF, y: number, needed: number, pageH: number, margin: number): number {
  if (y + needed > pageH - margin) { doc.addPage(); return margin; }
  return y;
}

// White card with left accent stripe
function accentCard(
  doc: jsPDF, x: number, y: number, w: number, h: number,
  accent: [number, number, number], bg: [number, number, number]
) {
  doc.setFillColor(...bg);
  doc.roundedRect(x, y, w, h, 2, 2, "F");
  doc.setDrawColor(...C.grayBorder);
  doc.setLineWidth(0.25);
  doc.roundedRect(x, y, w, h, 2, 2, "S");
  doc.setFillColor(...accent);
  // Left stripe — no rounded corners on single-sided stripe, use rect
  doc.rect(x, y, 3, h, "F");
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export function exportMarketingPlanPDF(event: EventDetail): void {
  // FIX 3: wrap entire function in try/catch so errors surface clearly
  try {
    _exportPDF(event);
  } catch (err) {
    console.error("[exportMarketingPlanPDF] Failed:", err);
    alert("PDF export failed: " + String(err));
  }
}

function _exportPDF(event: EventDetail): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const PW = doc.internal.pageSize.getWidth();
  const PH = doc.internal.pageSize.getHeight();
  const M  = 14;
  const CW = PW - M * 2;
  let y    = M;

  // ── Cover ──────────────────────────────────────────────────────────────────
  doc.setFillColor(...C.purple);
  doc.rect(0, 0, PW, 44, "F");

  doc.setFillColor(99, 102, 241);  // indigo-500
  doc.circle(PW - 22, 10, 22, "F");
  doc.setFillColor(129, 140, 248); // indigo-400
  doc.circle(PW - 8, 38, 14, "F");

  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...C.white);
  doc.text(strip(event.event_name), M, 19);

  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(199, 210, 254);
  doc.text(strip(event.event_theme), M, 27);

  // FIX 4: use formatLocation for the location field
  const locationText = strip(formatLocation(event.location));
  const dateText = (() => {
    try {
      return new Date(event.event_date).toLocaleDateString("en-GB", { dateStyle: "long" });
    } catch {
      return strip(event.event_date);
    }
  })();

  const metaItems = [
    `Date: ${dateText}`,
    `Location: ${locationText}`,
    `Audience: ${strip(event.target_audience)}`,
  ];
  doc.setFontSize(8).setTextColor(224, 231, 255);
  let metaX = M;
  for (const item of metaItems) {
    doc.text(item, metaX, 36);
    metaX += doc.getTextWidth(item) + 8;
  }

  y = 52;

  if (!event.marketing_plan) {
    doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(...C.gray);
    doc.text("No marketing plan available for this event.", M, y + 20);
    doc.save(safeFilename(event.event_name));
    return;
  }

  const plan = event.marketing_plan;

  // ── Strategy Summary ───────────────────────────────────────────────────────
  y = sectionHeader(doc, "Strategy Overview", y, C.purple, PW, M);
  const summLines = wrap(doc, plan.summary, CW - 14);
  const summH = summLines.length * 5.5 + 8;
  accentCard(doc, M, y, CW, summH, C.purple, C.purpleLight);
  doc.setFont("helvetica", "normal").setFontSize(9.5).setTextColor(55, 48, 163);
  summLines.forEach((l, i) => doc.text(l, M + 8, y + 6 + i * 5.5));
  y += summH + 6;

  // ── Quick Wins ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 30, PH, M);
  y = sectionHeader(doc, "Quick Wins — Start Today", y, C.orange, PW, M);

  const CR = 3.5;
  const CX = M + CR + 3;
  const LH = 5;
  const PV = 6;
  const TX = CX + CR + 4;

  for (const [i, win] of (plan.quickWins ?? []).entries()) {
    const lines = wrap(doc, win, CW - TX + M - 4);
    const tbH   = lines.length * LH;
    const boxH  = Math.max(tbH + PV * 2, CR * 2 + PV * 2);
    y = checkPage(doc, y, boxH + 3, PH, M);
    accentCard(doc, M, y, CW, boxH, C.orange, C.orangeLight);
    const cy = y + boxH / 2;
    doc.setFillColor(...C.orange);
    doc.circle(CX, cy, CR, "F");
    doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.white);
    const nw = doc.getTextWidth(`${i + 1}`);
    doc.text(`${i + 1}`, CX - nw / 2, cy + 2.2);
    const tsy = y + (boxH - tbH) / 2 + LH - 1.5;
    doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...C.black);
    lines.forEach((l, li) => doc.text(l, TX, tsy + li * LH));
    y += boxH + 3;
  }
  y += 4;

  // ── Marketing Channels ─────────────────────────────────────────────────────
  y = checkPage(doc, y, 20, PH, M);
  y = sectionHeader(doc, "Marketing Channels", y, C.cyan, PW, M);

  const priColor: Record<string, [number, number, number]> = {
    High: C.teal, Medium: C.orange, Low: C.gray,
  };
  const priBg: Record<string, [number, number, number]> = {
    High: C.tealLight, Medium: C.orangeLight, Low: C.grayLight,
  };

  for (const ch of (plan.channels ?? [])) {
    const sl = wrap(doc, ch.strategy, CW - 14);
    const boxH = sl.length * 4.5 + 24;
    y = checkPage(doc, y, boxH, PH, M);
    accentCard(doc, M, y, CW, boxH, C.cyan, C.grayLight);
    doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...C.black);
    doc.text(strip(ch.name), M + 8, y + 7);
    const pc = priColor[ch.priority] ?? C.gray;
    const pb = priBg[ch.priority]   ?? C.grayLight;
    badge(doc, strip(ch.priority), M + 8 + doc.getTextWidth(strip(ch.name)) + 3, y + 7, pb, pc);
    doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...C.gray);
    sl.forEach((l, li) => doc.text(l, M + 8, y + 13 + li * 4.5));
    doc.setFont("helvetica", "italic").setFontSize(7.5).setTextColor(...C.cyan);
    doc.text((ch.contentTypes ?? []).map(strip).join("  •  "), M + 8, y + boxH - 5);
    y += boxH + 4;
  }
  y += 2;

  // ── Campaign Timeline ──────────────────────────────────────────────────────
  doc.addPage(); y = M;
  y = sectionHeader(doc, "Campaign Timeline", y, C.teal, PW, M);

  for (const [i, phase] of (plan.timeline ?? []).entries()) {
    const focusLines = wrap(doc, phase.focus, CW - 22);
    const taskLines: string[] = [];
    for (const t of (phase.tasks ?? [])) {
      wrap(doc, `-> ${t}`, CW - 22).forEach(l => taskLines.push(l));
    }
    const all  = [...focusLines, ...taskLines];
    const boxH = all.length * 4.8 + 16;
    y = checkPage(doc, y, boxH + 4, PH, M);

    doc.setFillColor(...C.white);
    doc.roundedRect(M, y, CW, boxH, 3, 3, "F");
    doc.setDrawColor(...C.grayBorder).setLineWidth(0.25);
    doc.roundedRect(M, y, CW, boxH, 3, 3, "S");
    doc.setFillColor(...C.teal);
    doc.rect(M, y, 4, boxH, "F");

    const cy = y + 9;
    doc.setFillColor(...C.teal);
    doc.circle(M + 13, cy, 5, "F");
    doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(...C.white);
    doc.text(`${i + 1}`, M + 11.4, cy + 2.5);

    const titleX  = M + 21;
    const titleY  = cy + 2.5;
    const pLabel  = strip(phase.phase);
    doc.setFont("helvetica", "bold").setFontSize(10);
    const pLabelW = doc.getTextWidth(pLabel);
    doc.setTextColor(...C.black);
    doc.text(pLabel, titleX, titleY);
    badge(doc, strip(phase.duration), titleX + pLabelW + 4, titleY, C.tealLight, C.teal);

    doc.setFont("helvetica", "normal").setFontSize(8.5);
    all.forEach((l, li) => {
      const isArrow = l.startsWith("->");
      doc.setTextColor(...(isArrow ? C.teal : C.gray));
      doc.text(l, titleX, y + 14 + li * 4.8);
    });
    y += boxH + 5;
  }
  y += 2;

  // ── Budget Allocation ──────────────────────────────────────────────────────
  const budgets  = plan.budgetAllocation ?? [];
  const barH_ch  = 50;
  y = checkPage(doc, y, barH_ch + budgets.length * 9 + 40, PH, M);
  y = sectionHeader(doc, "Budget Allocation", y, C.purple, PW, M);

  doc.setFillColor(...C.grayLight);
  doc.roundedRect(M, y, CW, barH_ch + 18, 3, 3, "F");

  const chL = M + 10;
  const chB = y + barH_ch;
  const chW = CW - 20;
  const maxP = Math.max(...budgets.map(b => b.percentage), 1);
  const bW   = budgets.length > 0 ? (chW / budgets.length) * 0.55 : 20;
  const gap  = budgets.length > 0 ? (chW - bW * budgets.length) / (budgets.length + 1) : 10;

  doc.setDrawColor(...C.border).setLineWidth(0.3);
  doc.line(chL, y + 2, chL, chB);
  doc.line(chL, chB, chL + chW, chB);

  budgets.forEach((item, i) => {
    const bh  = (item.percentage / maxP) * (barH_ch - 10);
    const bx  = chL + gap + i * (bW + gap);
    const by  = chB - bh;
    doc.setFillColor(...BUDGET_COLORS[i % BUDGET_COLORS.length]);
    doc.roundedRect(bx, by, bW, bh, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...BUDGET_COLORS[i % BUDGET_COLORS.length]);
    const pl = `${item.percentage}%`;
    doc.text(pl, bx + bW / 2 - doc.getTextWidth(pl) / 2, by - 1.5);
    doc.setFont("helvetica", "normal").setFontSize(6.5).setTextColor(...C.gray);
    const cl = doc.splitTextToSize(strip(item.category), bW + gap * 0.8) as string[];
    cl.forEach((t, ci) => doc.text(t, bx + bW / 2 - doc.getTextWidth(t) / 2, chB + 4 + ci * 4));
  });

  y = chB + 20;

  budgets.forEach((item, i) => {
    doc.setFont("helvetica", "bold").setFontSize(8.5);
    const cat  = strip(item.category);
    const catW = doc.getTextWidth(cat);
    const desc = `${item.percentage}%  -  ${strip(item.description)}`;
    doc.setFont("helvetica", "normal").setFontSize(8);
    const dw   = Math.max(CW - 3.5 - 6 - catW - 3, 40);
    const dl   = doc.splitTextToSize(desc, dw) as string[];
    const rowH = Math.max(dl.length * 4.5, 5) + 4;
    y = checkPage(doc, y, rowH, PH, M);
    doc.setFillColor(...BUDGET_COLORS[i % BUDGET_COLORS.length]);
    doc.roundedRect(M, y + (rowH - 3.5) / 2, 3.5, 3.5, 0.8, 0.8, "F");
    const tby = y + 4;
    doc.setFont("helvetica", "bold").setFontSize(8.5).setTextColor(...C.black);
    doc.text(cat, M + 3.5 + 6, tby);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...C.gray);
    dl.forEach((d, di) => doc.text(d, M + 3.5 + 6 + catW + 3, tby + di * 4.5));
    y += rowH;
  });
  y += 5;

  // ── Key Messages ───────────────────────────────────────────────────────────
  y = checkPage(doc, y, 20, PH, M);
  y = sectionHeader(doc, "Key Messages", y, C.pink, PW, M);
  for (const msg of (plan.keyMessages ?? [])) {
    const lines = wrap(doc, `" ${msg} "`, CW - 14);
    const boxH  = lines.length * 5 + 6;
    y = checkPage(doc, y, boxH, PH, M);
    accentCard(doc, M, y, CW, boxH, C.pink, C.pinkLight);
    doc.setFont("helvetica", "italic").setFontSize(9).setTextColor(159, 18, 57);
    lines.forEach((l, li) => doc.text(l, M + 8, y + 5 + li * 5));
    y += boxH + 3;
  }
  y += 3;

  // ── Content Ideas ──────────────────────────────────────────────────────────
  y = checkPage(doc, y, 20, PH, M);
  y = sectionHeader(doc, "Content Ideas", y, C.orange, PW, M);

  const colW = (CW - 5) / 2;
  let col = 0, rowY = y, maxRH = 0;

  for (const idea of (plan.contentIdeas ?? [])) {
    const lines = wrap(doc, idea.idea, colW - 10);
    const boxH  = lines.length * 4.5 + 18;
    if (col === 0) rowY = y;
    const xp = M + col * (colW + 5);
    y = checkPage(doc, rowY, boxH + 4, PH, M);
    if (y !== rowY) { rowY = y; col = 0; }
    doc.setFillColor(...C.white);
    doc.roundedRect(xp, rowY, colW, boxH, 2, 2, "F");
    doc.setDrawColor(...C.grayBorder).setLineWidth(0.25);
    doc.roundedRect(xp, rowY, colW, boxH, 2, 2, "S");
    doc.setFillColor(...C.orange);
    doc.rect(xp, rowY, colW, 2.5, "F");
    doc.setFont("helvetica", "bold").setFontSize(7.5).setTextColor(...C.orange);
    doc.text(strip(idea.type).toUpperCase(), xp + 5, rowY + 8);
    doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...C.black);
    lines.forEach((l, li) => doc.text(l, xp + 5, rowY + 14 + li * 4.5));
    doc.setFont("helvetica", "italic").setFontSize(7.5).setTextColor(...C.gray);
    doc.text(strip(idea.platform), xp + 5, rowY + boxH - 4);
    maxRH = Math.max(maxRH, boxH);
    if (++col === 2) { y = rowY + maxRH + 4; col = 0; maxRH = 0; }
  }
  if (col !== 0) y = rowY + maxRH + 4;
  y += 3;

  // ── Success Metrics ────────────────────────────────────────────────────────
  y = checkPage(doc, y, 20, PH, M);
  y = sectionHeader(doc, "Success Metrics", y, C.cyan, PW, M);

  const mCW = (CW - 5) / 2;
  const MR  = 3.5;
  const MOX = MR + 3;
  const MTX = MOX + MR + 4;
  const MLH = 5;
  const MPV = 6;
  col = 0; rowY = y; maxRH = 0;

  for (const [i, metric] of (plan.successMetrics ?? []).entries()) {
    const lines  = wrap(doc, metric, mCW - MTX - 4);
    const tbH    = lines.length * MLH;
    const boxH   = Math.max(tbH + MPV * 2, MR * 2 + MPV * 2);
    if (col === 0) rowY = y;
    const xp = M + col * (mCW + 5);
    y = checkPage(doc, rowY, boxH + 4, PH, M);
    if (y !== rowY) { rowY = y; col = 0; }
    doc.setFillColor(...C.white);
    doc.roundedRect(xp, rowY, mCW, boxH, 2, 2, "F");
    doc.setDrawColor(...C.grayBorder).setLineWidth(0.25);
    doc.roundedRect(xp, rowY, mCW, boxH, 2, 2, "S");
    const cx = xp + MOX, cy = rowY + boxH / 2;
    doc.setFillColor(...C.cyan);
    doc.circle(cx, cy, MR, "F");
    doc.setFont("helvetica", "bold").setFontSize(7).setTextColor(...C.white);
    const nl = `${i + 1}`;
    doc.text(nl, cx - doc.getTextWidth(nl) / 2, cy + 2.2);
    const tsy = rowY + (boxH - tbH) / 2 + MLH - 1.5;
    doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...C.black);
    lines.forEach((l, li) => doc.text(l, xp + MTX, tsy + li * MLH));
    maxRH = Math.max(maxRH, boxH);
    if (++col === 2) { y = rowY + maxRH + 4; col = 0; maxRH = 0; }
  }
  if (col !== 0) y = rowY + maxRH + 4;
  y += 3;

  // ── Weekly Content Calendar ────────────────────────────────────────────────
  if ((plan.weeklyContentCalendar ?? []).length > 0) {
    doc.addPage(); y = M;
    y = sectionHeader(doc, "Weekly Content Calendar", y, C.purple, PW, M);

    for (const [wi, week] of (plan.weeklyContentCalendar ?? []).entries()) {
      const wCol = WEEK_COLORS[wi % WEEK_COLORS.length];
      const wBg  = WEEK_BG[wi % WEEK_BG.length];
      y = checkPage(doc, y, 14, PH, M);
      doc.setFillColor(...wCol);
      doc.roundedRect(M, y, CW, 10, 2, 2, "F");
      doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(...C.white);
      doc.text(`${strip(week.week)}  -  ${strip(week.theme)}`, M + 5, y + 7);
      y += 13;

      for (const post of (week.posts ?? [])) {
        const capLines  = wrap(doc, post.caption,            CW - 16);
        const descLines = wrap(doc, post.contentDescription, CW - 16);
        const hashLines = wrap(doc, post.hashtags,           CW - 16);
        const boxH = descLines.length * 4 + capLines.length * 4 + hashLines.length * 4 + 30;
        y = checkPage(doc, y, boxH, PH, M);

        doc.setFillColor(...C.white);
        doc.roundedRect(M, y, CW, boxH, 2, 2, "F");
        doc.setDrawColor(...C.grayBorder).setLineWidth(0.25);
        doc.roundedRect(M, y, CW, boxH, 2, 2, "S");
        doc.setFillColor(...wCol);
        doc.rect(M, y, 3, boxH, "F");

        let bx = M + 8;
        const by2 = y + 7;
        badge(doc, strip(post.type),     bx, by2, C.grayLight,  C.gray);   bx += doc.getTextWidth(strip(post.type)) + 9;
        badge(doc, strip(post.platform), bx, by2, wBg,          wCol);     bx += doc.getTextWidth(strip(post.platform)) + 9;
        doc.setFont("helvetica", "italic").setFontSize(7.5).setTextColor(...C.gray);
        doc.text(strip(post.day), bx, by2);

        let lineY = y + 13;
        const section = (label: string) => {
          doc.setFont("helvetica", "bold").setFontSize(7.5).setTextColor(...C.gray);
          doc.text(label, M + 8, lineY); lineY += 4;
        };
        const body = (lines: string[], color: [number, number, number]) => {
          doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...color);
          lines.forEach(l => { doc.text(l, M + 8, lineY); lineY += 4; });
          lineY += 2;
        };
        section("VISUAL / CONTENT"); body(descLines, C.black);
        section("CAPTION");          body(capLines,  C.black);
        section("HASHTAGS");         body(hashLines, wCol);

        y += boxH + 4;
      }
      y += 4;
    }
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const total = (doc.internal as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setFillColor(...C.grayLight);
    doc.rect(0, PH - 10, PW, 10, "F");
    doc.setDrawColor(...C.grayBorder).setLineWidth(0.3);
    doc.line(0, PH - 10, PW, PH - 10);
    doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...C.gray);
    doc.text(`${strip(event.event_name)} - Marketing Plan`, M, PH - 3.5);
    doc.text(`Page ${p} of ${total}`, PW - M, PH - 3.5, { align: "right" });
  }

  doc.save(safeFilename(event.event_name));
}

function safeFilename(name: string): string {
  return `${strip(name).replace(/\s+/g, "_") || "marketing_plan"}_marketing_plan.pdf`;
}