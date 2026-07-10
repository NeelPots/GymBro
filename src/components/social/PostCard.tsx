"use client";

import { useState } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AuthorAvatar, authorLabel } from "./AuthorAvatar";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { addComment, deletePost, getComments, toggleLike } from "@/services/social/socialClient";
import { cn } from "@/lib/utils";
import type { Comment, Post } from "@/lib/types/domain";

interface PostCardProps {
  post: Post;
  currentUserId: string | null;
  onDeleted: (postId: string) => void;
}

export function PostCard({ post, currentUserId, onDeleted }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isOwnPost = currentUserId === post.author.id;

  async function handleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((n) => n + (nextLiked ? 1 : -1));
    try {
      await toggleLike(post.id, liked);
    } catch {
      setLiked(liked);
      setLikeCount((n) => n + (nextLiked ? -1 : 1));
      toast.error("Sign in to like posts.");
    }
  }

  async function handleToggleComments() {
    setCommentsOpen((open) => !open);
    if (!comments) {
      const fetched = await getComments(post.id);
      setComments(fetched);
    }
  }

  async function handleAddComment() {
    const body = newComment.trim();
    if (body.length === 0) return;
    setIsSubmittingComment(true);
    try {
      await addComment(post.id, body);
      setNewComment("");
      setCommentCount((n) => n + 1);
      const fetched = await getComments(post.id);
      setComments(fetched);
    } catch {
      toast.error("Sign in to comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post.id);
      onDeleted(post.id);
    } catch {
      toast.error("Couldn't delete this post.");
    }
  }

  return (
    <div className="rounded-[var(--radius)] border border-border bg-surface">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <AuthorAvatar author={post.author} />
          <div>
            <div className="text-sm font-medium text-foreground">{authorLabel(post.author)}</div>
            <div className="font-mono text-[11px] text-muted-foreground">{formatRelativeTime(post.createdAt)}</div>
          </div>
        </div>
        {isOwnPost && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={post.mediaUrl} alt={post.caption ?? "Post image"} className="max-h-[520px] w-full object-cover" />

      <div className="flex items-center gap-4 px-4 pt-3">
        <button type="button" onClick={handleLike} className="flex items-center gap-1.5">
          <Heart size={20} className={cn(liked ? "fill-signal text-signal" : "text-foreground")} />
          <span className="font-mono text-xs text-muted-foreground">{likeCount}</span>
        </button>
        <button type="button" onClick={handleToggleComments} className="flex items-center gap-1.5">
          <MessageCircle size={20} className="text-foreground" />
          <span className="font-mono text-xs text-muted-foreground">{commentCount}</span>
        </button>
      </div>

      {post.caption && (
        <p className="px-4 pt-2 text-sm text-foreground">
          <span className="font-medium">{authorLabel(post.author)}</span> {post.caption}
        </p>
      )}

      {commentsOpen && (
        <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
          {comments === null ? (
            <p className="font-mono text-xs text-muted-foreground">Loading comments…</p>
          ) : comments.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-2 text-sm">
                <span className="font-medium text-foreground">{authorLabel(c.author)}</span>
                <span className="text-muted-foreground">{c.body}</span>
              </div>
            ))
          )}
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              placeholder="Add a comment…"
              className="h-9 flex-1 rounded-lg border border-border bg-surface-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
            />
            <button
              type="button"
              onClick={handleAddComment}
              disabled={isSubmittingComment || newComment.trim().length === 0}
              className="font-mono text-xs font-semibold text-signal disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      )}
      {!commentsOpen && <div className="pb-4" />}
    </div>
  );
}
