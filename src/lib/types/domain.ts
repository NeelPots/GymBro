import type { MovementParams, SessionEntry } from "@/lib/adaptive/engine";

export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string | null;
  defaultReps: number;
  defaultSets: number;
  difficultyTier: number;
  instructions?: string | null;
  easierVariation?: string | null;
  harderVariation?: string | null;
  videoUrl?: string | null;
}

export interface TrackedMovement extends Exercise {
  params: MovementParams;
  history: SessionEntry[];
}

export interface SignalItem {
  movementId: string;
  movementName: string;
  action: "progress" | "hold" | "deload";
  reason: string;
}

export interface PostAuthor {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface Post {
  id: string;
  author: PostAuthor;
  caption: string | null;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

export interface Story {
  id: string;
  author: PostAuthor;
  mediaUrl: string;
  mediaType: "image" | "video";
  createdAt: string;
  expiresAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: PostAuthor;
  body: string;
  createdAt: string;
}
