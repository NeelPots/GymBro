import type { Post, PostAuthor, Story } from "@/lib/types/domain";

/**
 * Demo content so the social feed doesn't look empty while real usage is
 * low. Avatars via i.pravatar.cc and post images via picsum.photos - both
 * long-standing, publicly documented placeholder-media services (not
 * invented URLs), seeded per item for a stable image across reloads. IDs
 * are prefixed "mock-" so components can identify and gracefully no-op
 * write actions (like/comment) against them - see socialClient.ts.
 */
const MOCK_AUTHORS: PostAuthor[] = [
  {
    id: "mock-user-1",
    username: "jlifts",
    displayName: "Jordan Lifts",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-jordan",
  },
  {
    id: "mock-user-2",
    username: "mia.moves",
    displayName: "Mia Torres",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-mia",
  },
  {
    id: "mock-user-3",
    username: "calisthenics_sam",
    displayName: "Sam Reyes",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-sam",
  },
  {
    id: "mock-user-4",
    username: "priya.progress",
    displayName: "Priya Nair",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-priya",
  },
  {
    id: "mock-user-5",
    username: "coach_deakin",
    displayName: "Deakin Cole",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-deakin",
  },
  {
    id: "mock-user-6",
    username: "ella.endurance",
    displayName: "Ella Novak",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-ella",
  },
  {
    id: "mock-user-7",
    username: "the_deadlift_guy",
    displayName: "Theo Marsh",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-theo",
  },
  {
    id: "mock-user-8",
    username: "yuki.trains",
    displayName: "Yuki Tanaka",
    avatarUrl: "https://i.pravatar.cc/150?u=gymbro-yuki",
  },
];

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function hoursFromNow(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

export const MOCK_POSTS: Post[] = [
  {
    id: "mock-post-1",
    author: MOCK_AUTHORS[0],
    caption: "New pull-up PR this morning - 12 strict reps. The consistency is finally paying off.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-1/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(3),
    likeCount: 42,
    commentCount: 6,
    likedByMe: false,
  },
  {
    id: "mock-post-2",
    author: MOCK_AUTHORS[1],
    caption: "Leg day survived. Barely. Squat depth finally clicking after months of mobility work.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-2/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(7),
    likeCount: 28,
    commentCount: 3,
    likedByMe: true,
  },
  {
    id: "mock-post-3",
    author: MOCK_AUTHORS[2],
    caption: "First strict muscle-up. Eighteen months of inverted rows and negatives led to this.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-3/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(11),
    likeCount: 91,
    commentCount: 14,
    likedByMe: false,
  },
  {
    id: "mock-post-4",
    author: MOCK_AUTHORS[3],
    caption: "30-day streak complete. Nothing fancy, just showed up every single day.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-4/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(15),
    likeCount: 63,
    commentCount: 9,
    likedByMe: false,
  },
  {
    id: "mock-post-5",
    author: MOCK_AUTHORS[4],
    caption: "Reminder from your coach: deload weeks are training too. Recover on purpose.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-5/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(20),
    likeCount: 37,
    commentCount: 5,
    likedByMe: false,
  },
  {
    id: "mock-post-6",
    author: MOCK_AUTHORS[5],
    caption: "5k tempo run this morning before the sun came up. Cardio day done.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-6/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(26),
    likeCount: 22,
    commentCount: 2,
    likedByMe: false,
  },
  {
    id: "mock-post-7",
    author: MOCK_AUTHORS[6],
    caption: "Conventional deadlift, new working weight. Bar speed felt fast today.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-7/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(31),
    likeCount: 55,
    commentCount: 8,
    likedByMe: true,
  },
  {
    id: "mock-post-8",
    author: MOCK_AUTHORS[7],
    caption: "Handstand hold practice. Wall-assisted for now, freestanding is the goal.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-8/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(38),
    likeCount: 47,
    commentCount: 4,
    likedByMe: false,
  },
  {
    id: "mock-post-9",
    author: MOCK_AUTHORS[0],
    caption: "Push day at the park - dip bars and a pull-up rig is really all you need.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-9/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(44),
    likeCount: 33,
    commentCount: 3,
    likedByMe: false,
  },
  {
    id: "mock-post-10",
    author: MOCK_AUTHORS[2],
    caption: "Rest day. Foam rolling, walking, and way too much stretching. Feels earned.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-10/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(50),
    likeCount: 19,
    commentCount: 1,
    likedByMe: false,
  },
  {
    id: "mock-post-11",
    author: MOCK_AUTHORS[3],
    caption: "Six months of progress photos side by side. Slow and unglamorous, but it's working.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-11/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(58),
    likeCount: 104,
    commentCount: 21,
    likedByMe: false,
  },
  {
    id: "mock-post-12",
    author: MOCK_AUTHORS[4],
    caption: "Form check request for the group: is my bar path drifting forward on the press?",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-12/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(65),
    likeCount: 14,
    commentCount: 11,
    likedByMe: false,
  },
  {
    id: "mock-post-13",
    author: MOCK_AUTHORS[5],
    caption: "Marathon training week 6 - long run done, legs are toast, worth it.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-13/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(72),
    likeCount: 26,
    commentCount: 3,
    likedByMe: false,
  },
  {
    id: "mock-post-14",
    author: MOCK_AUTHORS[6],
    caption: "First time hitting bodyweight on bench press. Small milestone, big mood.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-14/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(80),
    likeCount: 71,
    commentCount: 12,
    likedByMe: false,
  },
  {
    id: "mock-post-15",
    author: MOCK_AUTHORS[7],
    caption: "Grip strength work with farmer's carries today. Underrated accessory movement.",
    mediaUrl: "https://picsum.photos/seed/gymbro-post-15/900/1100",
    mediaType: "image",
    createdAt: hoursAgo(90),
    likeCount: 30,
    commentCount: 2,
    likedByMe: false,
  },
];

export const MOCK_STORIES: Story[] = [
  {
    id: "mock-story-1",
    author: MOCK_AUTHORS[1],
    mediaUrl: "https://picsum.photos/seed/gymbro-story-1/720/1280",
    mediaType: "image",
    createdAt: hoursAgo(2),
    expiresAt: hoursFromNow(22),
  },
  {
    id: "mock-story-2",
    author: MOCK_AUTHORS[2],
    mediaUrl: "https://picsum.photos/seed/gymbro-story-2/720/1280",
    mediaType: "image",
    createdAt: hoursAgo(4),
    expiresAt: hoursFromNow(20),
  },
  {
    id: "mock-story-3",
    author: MOCK_AUTHORS[4],
    mediaUrl: "https://picsum.photos/seed/gymbro-story-3/720/1280",
    mediaType: "image",
    createdAt: hoursAgo(6),
    expiresAt: hoursFromNow(18),
  },
  {
    id: "mock-story-4",
    author: MOCK_AUTHORS[5],
    mediaUrl: "https://picsum.photos/seed/gymbro-story-4/720/1280",
    mediaType: "image",
    createdAt: hoursAgo(9),
    expiresAt: hoursFromNow(15),
  },
  {
    id: "mock-story-5",
    author: MOCK_AUTHORS[6],
    mediaUrl: "https://picsum.photos/seed/gymbro-story-5/720/1280",
    mediaType: "image",
    createdAt: hoursAgo(12),
    expiresAt: hoursFromNow(12),
  },
  {
    id: "mock-story-6",
    author: MOCK_AUTHORS[7],
    mediaUrl: "https://picsum.photos/seed/gymbro-story-6/720/1280",
    mediaType: "image",
    createdAt: hoursAgo(15),
    expiresAt: hoursFromNow(9),
  },
];

export function isMockPostId(id: string): boolean {
  return id.startsWith("mock-");
}
