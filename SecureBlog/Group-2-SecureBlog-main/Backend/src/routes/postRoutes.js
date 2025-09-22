// routes/postRoutes.js
import { Router } from "express";
import {
  createDraft, updateDraft, publishPost, listPosts, getPost, deletePost
} from "../controllers/postController.js";
import { protect, requireRole } from "../middleware/auth.js";

const r = Router();

// Posts
r.get("/", listPosts);
r.get("/:postId", getPost);

r.post("/", protect, requireRole("author", "editor", "admin"), createDraft); // authors create drafts
r.put("/:postId", protect, requireRole("author"), updateDraft);              // authors edit own drafts (enforced in controller)
r.post("/:postId/publish", protect, requireRole("editor", "admin"), publishPost);
r.delete("/:postId", protect, requireRole("admin"), deletePost);

export default r;
