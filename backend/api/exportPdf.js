import express from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  indigo:    [79,  70,  229],
  rose:      [225, 29,  72 ],
  sky:       [2,   132, 199],
  emerald:   [5,   150, 105],
  amber:     [217, 119, 6  ],
  violet:    [124, 58,  237],
  white:     [255, 255, 255],
  ink:       [17,  24,  39 ],
  muted:     [107, 114, 128],
  faint:     [156, 163, 175],
  light:     [248, 250, 252],
  border:    [229, 231, 235],
  indigoBg:  [238, 242, 255],
  roseBg:    [255, 241, 242],
  skyBg:     [240, 249, 255],
  emeraldBg: [236, 253, 245],
  amberBg:   [255, 251, 235],
};

const BUDGET_COLORS = [C.indigo, C.rose, C.sky, C.emerald, C.amber, C.violet];
const WEEK_COLORS   = [C.indigo, C.sky, C.emerald, C.amber, C.rose, C.violet];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rgb(c) { return { r: c[0], g: c[1], b: c[2] }; }
function hex(c) { return `#${c.map(v => v.toString(16).padStart(2,"0")).join("")}`; }

function strip(text) {
  if (text == null) return "";
  return String(text)
    .replace(/[\u{1F000}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{27BF}]/gu, "")
    .replace(/[^\x00-\u024F]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatLocation(location) {
  if (!location) return "";
  try {
    const p = JSON.parse(location);
    return p.venue || p.city || p.name || location;
  } catch { return location; }
}

function safeFilename(name) {
  return `${(name || "marketing_plan")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase()}_marketing_plan.pdf`;
}


function textHeight(doc, text, width, fontName, fontSize) {
  doc.font(fontName).fontSize(fontSize);
  return doc.heightOfString(strip(text), { width });
}

function checkPage(doc, y, needed) {
  const pageH = doc.page.height - doc.page.margins.bottom;
  if (y + needed > pageH) {
    doc.addPage();
    return doc.page.margins.top;
  }
  return y;
}

function sectionHeader(doc, title, color, y, pageW, margin) {
  doc.rect(margin, y, pageW - margin * 2, 22).fill(hex(color));
  doc.font("Helvetica-Bold")
     .fontSize(11)
     .fillColor("#ffffff")
     .text(strip(title), margin + 10, y + 6, { width: pageW - margin * 2 - 20 });
  return y + 30;
}

function accentCard(doc, text, accentColor, bgColor, y, x, w) {
  
  doc.font("Helvetica").fontSize(9);
  const textH = doc.heightOfString(strip(text), { width: w - 20 });
  const cardH = textH + 18;
  doc.rect(x, y, w, cardH).fill(hex(bgColor));
  doc.rect(x, y, 4, cardH).fill(hex(accentColor));
  doc.font("Helvetica")
     .fontSize(9)
     .fillColor(hex(C.ink))
     .text(strip(text), x + 12, y + 9, { width: w - 20 });
  return y + cardH + 6;
}

// Route 
router.post("/api/export-pdf", (req, res) => {
  try {
    const clerkUserId =
      req.body?.clerkUserId ||
      req.query?.clerkUserId ||
      req.headers?.["x-clerk-user-id"];

    console.log(`[POST] /export-pdf | clerkUserId: ${clerkUserId || "❌ MISSING"}`);
    if (!clerkUserId) {
      return res.status(400).json({ error: "Missing clerkUserId" });
    }

    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ error: "Missing event payload" });
    }

    const plan = event?.marketing_plan || {};

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 40, bottom: 40, left: 40, right: 40 },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename(event?.event_name)}"`
    );
    doc.pipe(res);

    const PW     = doc.page.width;
    const margin = 40;
    const CW     = PW - margin * 2;
    let y        = margin;

    //  Cover 
    doc.rect(0, 0, PW, 110).fill(hex(C.indigo));
    doc.circle(PW - 40, 20, 50).fill("#6366f1");
    doc.circle(PW - 10, 90, 30).fill("#818cf8");

    doc.font("Helvetica-Bold")
       .fontSize(22)
       .fillColor("#ffffff")
       .text(strip(event?.event_name || ""), margin, 22, { width: CW - 60 });

    doc.font("Helvetica")
       .fontSize(11)
       .fillColor("#c7d2fe")
       .text(strip(event?.event_theme || ""), margin, 52, { width: CW - 60 });

    const dateText = (() => {
      try {
        return new Date(event?.event_date).toLocaleDateString("en-GB", { dateStyle: "long" });
      } catch { return strip(event?.event_date || ""); }
    })();
    const locationText = strip(formatLocation(event?.location || ""));

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#a5b4fc").text("DATE", margin, 76);
    doc.font("Helvetica").fontSize(9).fillColor("#e0e7ff").text(dateText, margin, 86);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#a5b4fc").text("LOCATION", margin + 160, 76);
    doc.font("Helvetica").fontSize(9).fillColor("#e0e7ff").text(locationText, margin + 160, 86);

    doc.font("Helvetica-Bold").fontSize(8).fillColor("#a5b4fc").text("AUDIENCE", margin + 320, 76);
    doc.font("Helvetica").fontSize(9).fillColor("#e0e7ff").text(strip(event?.target_audience || ""), margin + 320, 86);

    y = 130;

    //  Strategy Overview 

    y = checkPage(doc, y, 80);
    y = sectionHeader(doc, "Strategy Overview", C.indigo, y, PW, margin);
    y = accentCard(doc, plan.summary || "", C.indigo, C.indigoBg, y, margin, CW);
    y += 8;

    //  Quick Wins 
    y = checkPage(doc, y, 60);
    y = sectionHeader(doc, "Quick Wins — Start Today", C.amber, y, PW, margin);

    for (let i = 0; i < (plan.quickWins || []).length; i++) {
      const win = plan.quickWins[i];
      // FIX: set font before heightOfString
      doc.font("Helvetica").fontSize(9);
      const textH = doc.heightOfString(strip(win), { width: CW - 40 });
      const cardH = textH + 18;

      y = checkPage(doc, y, cardH + 6);

      doc.rect(margin, y, CW, cardH).fill(hex(C.amberBg));
      doc.rect(margin, y, 4, cardH).fill(hex(C.amber));

      doc.circle(margin + 18, y + cardH / 2, 8).fill(hex(C.amber));
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff")
         .text(`${i + 1}`, margin + 14, y + cardH / 2 - 4, { width: 8, align: "center" });

      doc.font("Helvetica").fontSize(9).fillColor(hex(C.ink))
         .text(strip(win), margin + 32, y + 9, { width: CW - 40 });

      y += cardH + 5;
    }
    y += 8;

    //  Marketing Channels 
    y = checkPage(doc, y, 60);
    y = sectionHeader(doc, "Marketing Channels", C.sky, y, PW, margin);

    for (const ch of (plan.channels || [])) {
      
      doc.font("Helvetica").fontSize(9);
      const stratH = doc.heightOfString(strip(ch.strategy || ""), { width: CW - 20 });
      const cardH  = stratH + 36;

      y = checkPage(doc, y, cardH + 6);

      doc.rect(margin, y, CW, cardH).fill(hex(C.light));
      doc.rect(margin, y, 4, cardH).fill(hex(C.sky));
      doc.rect(margin, y, CW, cardH).stroke(hex(C.border)).lineWidth(0.5);

      doc.font("Helvetica-Bold").fontSize(11).fillColor(hex(C.ink))
         .text(strip(ch.name || ""), margin + 12, y + 8);

      const priColors = { High: C.emerald, Medium: C.amber, Low: C.muted };
      const priColor  = priColors[ch.priority] || C.muted;
      const badgeW    = 44;
      doc.rect(PW - margin - badgeW - 4, y + 6, badgeW, 14)
         .fill(hex(priColor.map ? priColor.map(v => Math.min(v + 180, 255)) : [240,240,240]));
      doc.font("Helvetica-Bold").fontSize(7).fillColor(hex(priColor))
         .text(strip(ch.priority || ""), PW - margin - badgeW, y + 10, { width: badgeW - 8, align: "center" });

      doc.font("Helvetica").fontSize(9).fillColor(hex(C.muted))
         .text(strip(ch.strategy || ""), margin + 12, y + 22, { width: CW - 20 });

      const ctText = (ch.contentTypes || []).map(strip).join("  •  ");
      doc.font("Helvetica-Oblique").fontSize(8).fillColor(hex(C.sky))
         .text(ctText, margin + 12, y + cardH - 12, { width: CW - 20 });

      y += cardH + 6;
    }
    y += 8;

    //  Campaign Timeline 
    const timeline = plan.timeline || [];
    if (timeline.length > 0) {
      y = checkPage(doc, y, 120);
      y = sectionHeader(doc, "Campaign Timeline", C.emerald, y, PW, margin);

      for (let i = 0; i < timeline.length; i++) {
      const phase = plan.timeline[i];

      
      doc.font("Helvetica").fontSize(9);
      const focusH    = doc.heightOfString(strip(phase.focus || ""), { width: CW - 50 });
      const tasksText = (phase.tasks || []).map(t => `→  ${strip(t)}`).join("\n");
      const tasksH    = tasksText ? doc.heightOfString(tasksText, { width: CW - 50 }) : 0;
      const cardH     = focusH + tasksH + 32;

      y = checkPage(doc, y, cardH + 8);

      doc.rect(margin, y, CW, cardH).fill(hex(C.light));
      doc.rect(margin, y, 4, cardH).fill(hex(C.emerald));
      doc.rect(margin, y, CW, cardH).stroke(hex(C.border)).lineWidth(0.5);

      doc.circle(margin + 20, y + 16, 10).fill(hex(C.emerald));
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#ffffff")
         .text(`${i + 1}`, margin + 15, y + 11, { width: 10, align: "center" });

      doc.font("Helvetica-Bold").fontSize(11).fillColor(hex(C.ink))
         .text(strip(phase.phase || ""), margin + 38, y + 8);

      const phaseW = doc.widthOfString(strip(phase.phase || ""));
      doc.rect(margin + 42 + phaseW, y + 6, 55, 14).fill(hex(C.emeraldBg));
      doc.font("Helvetica-Bold").fontSize(8).fillColor(hex(C.emerald))
         .text(strip(phase.duration || ""), margin + 44 + phaseW, y + 10, { width: 50 });

      doc.font("Helvetica").fontSize(9).fillColor(hex(C.muted))
         .text(strip(phase.focus || ""), margin + 38, y + 26, { width: CW - 50 });

      if (tasksText) {
        doc.font("Helvetica").fontSize(9).fillColor(hex(C.ink))
           .text(tasksText, margin + 38, y + 28 + focusH, { width: CW - 50 });
      }

        y += cardH + 8;
      }
      y += 4;
    }

    //  Budget Allocation 
    const budget = plan.budgetAllocation || [];
    if (budget.length > 0) {
      y = checkPage(doc, y, 140);
      y = sectionHeader(doc, "Budget Allocation", C.indigo, y, PW, margin);
      const total  = budget.reduce((s, b) => s + (b.percentage || 0), 0) || 1;

      const chartX   = margin;
      const chartY   = y;
      const chartW   = CW;
      const chartH   = 120;
      const axisLeft = 30;
      const plotX    = chartX + axisLeft;
      const plotW    = chartW - axisLeft - 10;
      const barCount = budget.length;
      const barGroupW = plotW / Math.max(barCount, 1);
      const barW     = Math.min(barGroupW * 0.55, 40);
      const maxPct   = 100;
      const plotH    = chartH - 24;

      // Y-axis grid lines and labels
      const ySteps = [0, 25, 50, 75, 100];
      for (const step of ySteps) {
      const lineY = chartY + plotH - (step / maxPct) * plotH;
      doc.moveTo(plotX, lineY)
         .lineTo(plotX + plotW, lineY)
         .stroke(hex(C.border)).lineWidth(0.5);
      doc.font("Helvetica").fontSize(7).fillColor(hex(C.faint))
         .text(`${step}%`, chartX, lineY - 4, { width: axisLeft - 4, align: "right" });
    }

      // Bars
      for (let i = 0; i < budget.length; i++) {
      const pct = budget[i].percentage || 0;
      const col = BUDGET_COLORS[i % BUDGET_COLORS.length];
      const bx  = plotX + i * barGroupW + (barGroupW - barW) / 2;
      const bh  = (pct / maxPct) * plotH;
      const by  = chartY + plotH - bh;

      doc.rect(bx, by, barW, bh).fill(hex(col));

      doc.font("Helvetica-Bold").fontSize(8).fillColor(hex(col))
         .text(`${pct}%`, bx - 4, by - 11, { width: barW + 8, align: "center" });

      const label = strip(budget[i].category || "");
      const words = label.split(" ");
      const line1 = words.slice(0, 2).join(" ");
      const line2 = words.slice(2).join(" ");
      doc.font("Helvetica").fontSize(7).fillColor(hex(C.muted))
         .text(line1, bx - 8, chartY + plotH + 5, { width: barW + 16, align: "center" });
      if (line2) {
        doc.text(line2, bx - 8, chartY + plotH + 14, { width: barW + 16, align: "center" });
      }
    }

      // X-axis baseline
      doc.moveTo(plotX, chartY + plotH)
       .lineTo(plotX + plotW, chartY + plotH)
       .stroke(hex(C.border)).lineWidth(0.5);

      y = chartY + chartH + 20;

      // Legend rows
      for (let i = 0; i < budget.length; i++) {
      
      doc.font("Helvetica").fontSize(8);
      const descH = doc.heightOfString(strip(budget[i].description || ""), { width: CW - 50 });
      const rowH  = Math.max(descH + 16, 28);

      y = checkPage(doc, y, rowH + 4);

      const col = BUDGET_COLORS[i % BUDGET_COLORS.length];
      doc.rect(margin, y + 2, 10, 10).fill(hex(col));

      doc.font("Helvetica-Bold").fontSize(10).fillColor(hex(C.ink))
         .text(strip(budget[i].category || ""), margin + 16, y);

      doc.font("Helvetica-Bold").fontSize(10).fillColor(hex(col))
         .text(`${budget[i].percentage}%`, PW - margin - 30, y, { width: 30, align: "right" });

      doc.font("Helvetica").fontSize(8).fillColor(hex(C.faint))
         .text(strip(budget[i].description || ""), margin + 16, y + 13, { width: CW - 50 });

        y += rowH + 4;
      }
      y += 8;
    }

    //  Key Messages
    const keyMessages = plan.keyMessages || [];
    if (keyMessages.length > 0) {
      y = checkPage(doc, y, 80);
      y = sectionHeader(doc, "Key Messages", C.rose, y, PW, margin);
      for (const msg of keyMessages) {
      // FIX: accentCard now sets font internally before measuring
      doc.font("Helvetica").fontSize(9);
      const cardH = doc.heightOfString(strip(`"${strip(msg)}"`), { width: CW - 20 }) + 18;
      y = checkPage(doc, y, cardH + 6);
      y = accentCard(doc, `"${strip(msg)}"`, C.rose, C.roseBg, y, margin, CW);
      }
      y += 8;
    }

    //  Content Ideas 
    const ideas = plan.contentIdeas || [];
    if (ideas.length > 0) {
      y = checkPage(doc, y, 80);
      y = sectionHeader(doc, "Content Ideas", C.amber, y, PW, margin);
      const colW  = (CW - 8) / 2;

      for (let i = 0; i < ideas.length; i += 2) {
      const pair = ideas.slice(i, i + 2);

      
      doc.font("Helvetica").fontSize(9);
      const heights = pair.map(idea =>
        doc.heightOfString(strip(idea.idea || ""), { width: colW - 16 }) + 36
      );
      const rowH = Math.max(...heights);

      y = checkPage(doc, y, rowH + 6);

      pair.forEach((idea, j) => {
        const cx = margin + j * (colW + 8);
        doc.rect(cx, y, colW, rowH).fill("#ffffff").stroke(hex(C.border)).lineWidth(0.5);
        doc.rect(cx, y, colW, 3).fill(hex(C.amber));
        doc.font("Helvetica-Bold").fontSize(8).fillColor(hex(C.amber))
           .text((strip(idea.type || "")).toUpperCase(), cx + 8, y + 9);
        doc.font("Helvetica").fontSize(8).fillColor(hex(C.faint))
           .text(strip(idea.platform || ""), cx + colW - 60, y + 9, { width: 52, align: "right" });
        doc.font("Helvetica").fontSize(9).fillColor(hex(C.ink))
           .text(strip(idea.idea || ""), cx + 8, y + 22, { width: colW - 16 });
      });
        y += rowH + 6;
      }
      y += 8;
    }

    //  Success Metrics
    const metrics = plan.successMetrics || [];
    if (metrics.length > 0) {
      y = checkPage(doc, y, 80);
      y = sectionHeader(doc, "Success Metrics", C.sky, y, PW, margin);
      const mColW   = (CW - 8) / 2;

      for (let i = 0; i < metrics.length; i += 2) {
      const pair = metrics.slice(i, i + 2);

      
      doc.font("Helvetica").fontSize(9);
      const heights = pair.map(metric =>
        doc.heightOfString(strip(metric || ""), { width: mColW - 40 }) + 20
      );
      const cardH = Math.max(Math.max(...heights), 40);

      y = checkPage(doc, y, cardH + 6);

      pair.forEach((metric, j) => {
        const cx = margin + j * (mColW + 8);
        doc.rect(cx, y, mColW, cardH).fill(hex(C.skyBg)).stroke(hex([186,230,253])).lineWidth(0.5);
        doc.circle(cx + 16, y + cardH / 2, 10).fill(hex(C.sky));
        doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff")
           .text(`${i + j + 1}`, cx + 11, y + cardH / 2 - 4, { width: 10, align: "center" });
        doc.font("Helvetica").fontSize(9).fillColor(hex(C.ink))
           .text(strip(metric || ""), cx + 32, y + 10, { width: mColW - 40 });
      });
        y += cardH + 6;
      }
      y += 8;
    }

    //  Weekly Content Calendar 
    const weeks = plan.weeklyContentCalendar || [];
    if (weeks.length > 0) {
      y = checkPage(doc, y, 120);
      y = sectionHeader(doc, "Weekly Content Calendar", C.indigo, y, PW, margin);
      y += 4;

      for (let wi = 0; wi < weeks.length; wi++) {
        const week = weeks[wi];
        const col  = WEEK_COLORS[wi % WEEK_COLORS.length];

        y = checkPage(doc, y, 36);
        doc.rect(margin, y, CW, 24).fill(hex(col));
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#ffffff")
           .text(`${strip(week.week)}  —  ${strip(week.theme)}`, margin + 10, y + 7, { width: CW - 20 });
        y += 32;

        for (const post of (week.posts || [])) {
     
          doc.font("Helvetica").fontSize(9);
          const descH = doc.heightOfString(strip(post.contentDescription || ""), { width: CW - 20 });
          const capH  = doc.heightOfString(strip(post.caption || ""),            { width: CW - 32 });

          doc.font("Helvetica").fontSize(8);
          const tagsH = doc.heightOfString(strip(post.hashtags || ""),           { width: CW - 20 });

         
          const cardH = Math.max(descH + capH + tagsH + 70, 120);

          y = checkPage(doc, y, cardH + 8);

          
          doc.rect(margin, y, CW, cardH).fill("#ffffff").stroke(hex(C.border)).lineWidth(0.5);
          doc.rect(margin, y, CW, 3).fill(hex(col));

          let bx = margin + 10;
          doc.font("Helvetica-Bold").fontSize(8).fillColor(hex(C.ink))
             .text(strip(post.type || ""), bx, y + 10);
          bx += doc.widthOfString(strip(post.type || "")) + 10;
          doc.font("Helvetica-Bold").fontSize(8).fillColor(hex(col))
             .text(strip(post.platform || ""), bx, y + 10);
          bx += doc.widthOfString(strip(post.platform || "")) + 10;
          doc.font("Helvetica").fontSize(8).fillColor(hex(C.faint))
             .text(strip(post.day || ""), bx, y + 10);

          let py = y + 24;

          doc.font("Helvetica-Bold").fontSize(7).fillColor(hex(C.faint))
             .text("VISUAL / CONTENT", margin + 10, py);
          py += 11;
          doc.font("Helvetica").fontSize(9).fillColor(hex(C.ink))
             .text(strip(post.contentDescription || ""), margin + 10, py, { width: CW - 20 });
          py += descH + 8;

          doc.font("Helvetica-Bold").fontSize(7).fillColor(hex(C.faint))
             .text("CAPTION", margin + 10, py);
          py += 11;
          doc.rect(margin + 10, py, CW - 20, capH + 10).fill("#f9fafb");
          doc.font("Helvetica").fontSize(9).fillColor(hex(C.ink))
             .text(strip(post.caption || ""), margin + 16, py + 5, { width: CW - 32 });
          py += capH + 18;

          doc.font("Helvetica-Bold").fontSize(7).fillColor(hex(C.faint))
             .text("HASHTAGS", margin + 10, py);
          py += 11;
          const tags = (post.hashtags || "").split(" ").filter(Boolean).join("  ");
          doc.font("Helvetica").fontSize(8).fillColor(hex(col))
             .text(tags, margin + 10, py, { width: CW - 20 });

          y += cardH + 8;
        }
        y += 8;
      }
    }

    doc.end();

  } catch (err) {
    console.error("[export-pdf]", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || "PDF generation failed" });
    }
  }
});

export default router;
