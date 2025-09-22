// controllers/postController.js
import { Post } from "../models/post.js";

// Authors create drafts
export const createDraft = async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
      status: "draft"
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Authors can edit only their own drafts
export const updateDraft = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (post.status !== "draft") return res.status(403).json({ message: "Cannot edit published posts" });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    post.title = req.body.title ?? post.title;
    post.content = req.body.content ?? post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Editors/Admins publish any post
export const publishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Not found" });
    if (post.status === "published") return res.status(400).json({ message: "Already published" });

    post.status = "published";
    post.publishedAt = new Date();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Readers list published; authors can optionally list their drafts if desired
export const listPosts = async (req, res) => {
  const filter = { status: "published" };
  const posts = await Post.find(filter).sort({ publishedAt: -1 }).lean();
  res.json(posts);
};

// Get single post: only published (you can extend to allow author to view own draft)
export const getPost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId, status: "published" }).lean();
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
};

// Admin hard delete any post
export const deletePost = async (req, res) => {
  const deleted = await Post.findByIdAndDelete(req.params.postId);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.status(204).end();
};
