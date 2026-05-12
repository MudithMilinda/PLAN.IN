// ─────────────────────────────────────────────────────────────────────────────
// uploadMediaController.js
// ─────────────────────────────────────────────────────────────────────────────

import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabase.js";

// ── Multer Setup ────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },

  fileFilter: (_req, file, cb) => {
    const allowed =
      /image\/(jpeg|jpg|png|gif|webp)|video\/(mp4|quicktime|webm)/;

    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

const BUCKET = "post-media";

function extractStoragePathFromPublicUrl(url) {
  if (!url || typeof url !== "string") return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.substring(idx + marker.length);
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload Controller
// POST /api/content-posts/:id/media
// ─────────────────────────────────────────────────────────────────────────────

export const uploadPostMedia = [
  upload.array("files", 10),

  async (req, res) => {
    try {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("UPLOAD REQUEST STARTED");

      let { id } = req.params;
      
      // Strip "content-" prefix if present (from frontend's display ID)
      if (id && id.startsWith("content-")) {
        id = id.substring(8);
      }

      // multipart/form-data fields come from req.body after multer
      const clerkUserId = req.body?.clerkUserId;

      console.log("POST ID:", id);
      console.log("CLERK USER ID:", clerkUserId);
      console.log("BODY:", req.body);

      // ── Validation ────────────────────────────────────────────────────────
      if (!id) {
        return res.status(400).json({
          error: "Missing post ID",
        });
      }

      if (!clerkUserId) {
        return res.status(400).json({
          error: "Missing clerkUserId",
        });
      }

      // ── Check Post Ownership ─────────────────────────────────────────────
      const { data: existingPost, error: postError } = await supabase
        .from("content_posts")
        .select("*")
        .eq("id", id)
        .eq("clerk_user_id", clerkUserId)
        .single();

      console.log("EXISTING POST:", existingPost);
      console.log("POST ERROR:", postError);

      if (postError || !existingPost) {
        return res.status(404).json({
          error: "Content post not found or unauthorized",
          details: postError?.message || "No matching post found",
        });
      }

      // ── Validate Files ───────────────────────────────────────────────────
      const files = req.files;

      if (!files || files.length === 0) {
        return res.status(400).json({
          error: "No files uploaded",
        });
      }

      const uploadedUrls = [];

      // ── Upload Each File ────────────────────────────────────────────────
      for (const file of files) {
        try {
          const ext = path.extname(file.originalname) || ".bin";

          const fileName = `${uuidv4()}${ext}`;

          const storagePath = `${clerkUserId}/${id}/${fileName}`;

          console.log("UPLOADING:", storagePath);

          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, file.buffer, {
              contentType: file.mimetype,
              upsert: false,
            });

          if (uploadError) {
            console.error("SUPABASE UPLOAD ERROR:", uploadError);
            continue;
          }

          // ── Get Public URL ──────────────────────────────────────────────
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(storagePath);

          const publicUrl = publicUrlData?.publicUrl;

          if (publicUrl) {
            uploadedUrls.push(publicUrl);
          }
        } catch (fileErr) {
          console.error("FILE PROCESS ERROR:", fileErr);
        }
      }

      // ── Ensure Upload Success ───────────────────────────────────────────
      if (uploadedUrls.length === 0) {
        return res.status(500).json({
          error: "All uploads failed",
        });
      }

      // ── Merge Existing URLs ─────────────────────────────────────────────
      const existingUrls = Array.isArray(existingPost.media_urls)
        ? existingPost.media_urls
        : [];

      const mergedUrls = [...existingUrls, ...uploadedUrls];

      // ── Save URLs To DB ─────────────────────────────────────────────────
      const { data: updatedPost, error: updateError } = await supabase
        .from("content_posts")
        .update({
          media_urls: mergedUrls,
        })
        .eq("id", id)
        .eq("clerk_user_id", clerkUserId)
        .select("media_urls")
        .single();

      if (updateError) {
        console.error("DATABASE UPDATE ERROR:", updateError);

        return res.status(500).json({
          error: "Files uploaded but DB update failed",
          details: updateError.message,
        });
      }

      console.log("UPLOAD SUCCESS");

      return res.status(200).json({
        success: true,
        message: `${uploadedUrls.length} file(s) uploaded successfully`,
        media_urls: updatedPost.media_urls,
      });
    } catch (err) {
      console.error("UPLOAD MEDIA ERROR:", err);

      return res.status(500).json({
        error: "Internal server error",
        details: err.message,
      });
    }
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Delete Media Controller
// DELETE /api/content-posts/:id/media
// ─────────────────────────────────────────────────────────────────────────────
export const deletePostMedia = async (req, res) => {
  try {
    let { id } = req.params;
    if (id && id.startsWith("content-")) {
      id = id.substring(8);
    }

    const clerkUserId = req.body?.clerkUserId;
    const mediaUrl = req.body?.media_url;

    if (!id) return res.status(400).json({ error: "Missing post ID" });
    if (!clerkUserId) return res.status(400).json({ error: "Missing clerkUserId" });
    if (!mediaUrl) return res.status(400).json({ error: "Missing media_url" });

    const { data: existingPost, error: postError } = await supabase
      .from("content_posts")
      .select("media_urls")
      .eq("id", id)
      .eq("clerk_user_id", clerkUserId)
      .single();

    if (postError || !existingPost) {
      return res.status(404).json({
        error: "Content post not found or unauthorized",
        details: postError?.message || "No matching post found",
      });
    }

    const existingUrls = Array.isArray(existingPost.media_urls)
      ? existingPost.media_urls
      : [];

    const filteredUrls = existingUrls.filter((url) => url !== mediaUrl);

    if (filteredUrls.length === existingUrls.length) {
      return res.status(404).json({ error: "Media URL not found in this post" });
    }

    const storagePath = extractStoragePathFromPublicUrl(mediaUrl);
    if (storagePath) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove([storagePath]);
      if (removeError) {
        console.warn("STORAGE REMOVE WARNING:", removeError.message);
      }
    }

    const { data: updatedPost, error: updateError } = await supabase
      .from("content_posts")
      .update({ media_urls: filteredUrls })
      .eq("id", id)
      .eq("clerk_user_id", clerkUserId)
      .select("media_urls")
      .single();

    if (updateError) {
      return res.status(500).json({
        error: "Failed to update post media",
        details: updateError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
      media_urls: updatedPost.media_urls || [],
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
};
