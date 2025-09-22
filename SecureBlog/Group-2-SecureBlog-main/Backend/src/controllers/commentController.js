// controllers/commentController.js
import { Comment } from "../models/Comment.js";
import { Post } from "../models/post.js";

export const addComment = async (req, res) => {
  const { postId } = req.params;
  // only allow comments on published posts
  const post = await Post.findOne({ _id: postId, status: "published" });
  if (!post) return res.status(404).json({ message: "Post not found or not published" });

  const comment = await Comment.create({
    post: postId,
    authorName: req.body.authorName || "Anonymous",
    body: req.body.body
  });
  res.status(201).json(comment);
};

export const approveComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const comment = await Comment.findOne({ _id: commentId, post: postId });
  if (!comment) return res.status(404).json({ message: "Not found" });
  comment.approved = true;
  await comment.save();
  res.json(comment);
};

export const listComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId, approved: true }).sort({ createdAt: 1 }).lean();
  res.json(comments);
};
