-- Phase 3: in-app social feed - posts, 24h stories, likes, comments.
-- Fully public feed (no followers model) per the confirmed roadmap decision.

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  caption text,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts are publicly readable"
  on public.posts for select
  using (true);

create policy "users can create their own posts"
  on public.posts for insert
  with check (user_id = auth.uid());

create policy "users can delete their own posts"
  on public.posts for delete
  using (user_id = auth.uid());

create index posts_created_at_idx on public.posts (created_at desc);

-- ---------- stories ----------
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

alter table public.stories enable row level security;

create policy "stories are publicly readable"
  on public.stories for select
  using (true);

create policy "users can create their own stories"
  on public.stories for insert
  with check (user_id = auth.uid());

create policy "users can delete their own stories"
  on public.stories for delete
  using (user_id = auth.uid());

create index stories_expires_at_idx on public.stories (expires_at desc);

-- ---------- post_likes ----------
create table public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

alter table public.post_likes enable row level security;

create policy "likes are publicly readable"
  on public.post_likes for select
  using (true);

create policy "users can like as themselves"
  on public.post_likes for insert
  with check (user_id = auth.uid());

create policy "users can unlike their own like"
  on public.post_likes for delete
  using (user_id = auth.uid());

-- ---------- post_comments ----------
create table public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

create policy "comments are publicly readable"
  on public.post_comments for select
  using (true);

create policy "users can comment as themselves"
  on public.post_comments for insert
  with check (user_id = auth.uid());

create policy "users can delete their own comments"
  on public.post_comments for delete
  using (user_id = auth.uid());

create index post_comments_post_id_idx on public.post_comments (post_id, created_at);

-- ---------- storage: social-media bucket ----------
insert into storage.buckets (id, name, public)
values ('social-media', 'social-media', true)
on conflict (id) do nothing;

create policy "social media is publicly readable"
  on storage.objects for select
  using (bucket_id = 'social-media');

create policy "users can upload to their own folder in social-media"
  on storage.objects for insert
  with check (bucket_id = 'social-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users can delete their own files in social-media"
  on storage.objects for delete
  using (bucket_id = 'social-media' and (storage.foldername(name))[1] = auth.uid()::text);
