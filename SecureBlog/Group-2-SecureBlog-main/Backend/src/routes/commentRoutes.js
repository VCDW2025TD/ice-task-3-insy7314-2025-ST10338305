// routes/commentRoutes.js
import { Router } from "express";
import { addComment, listComments, approveComment } from "../controllers/commentController.js";
import { protect, requireRole } from "../middleware/auth.js";

const r = Router({ mergeParams: true }); // mounted under /posts/:postId/comments

r.get("/", listComments);
r.post("/", addComment); // readers (anyone) can add

r.post("/:commentId/approve", protect, requireRole("editor", "admin"), approveComment);

export default r;
