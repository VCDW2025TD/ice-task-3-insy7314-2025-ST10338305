// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    authorName: { type: String, trim: true }, // or a user ref if you want
    body: { type: String, required: true },
    approved: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
