// models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
