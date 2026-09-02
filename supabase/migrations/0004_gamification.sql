-- Phase 7: System HUD cloud sync (hunter_state) and a friends graph, layered
-- onto the existing account/profile system - no separate passcode scheme.

-- ---------- hunter_state ----------
-- One JSON blob per hunter mirroring the client's local QuestState. Simpler
-- than normalizing every field, and matches how the client already treats
-- the whole thing as one localStorage-serialized object.
create table public.hunter_state (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.hunter_state enable row level security;

create policy "users can read their own hunter state"
  on public.hunter_state for select
  using (user_id = auth.uid());

create policy "users can upsert their own hunter state"
  on public.hunter_state for insert
  with check (user_id = auth.uid());

create policy "users can update their own hunter state"
  on public.hunter_state for update
  using (user_id = auth.uid());

-- ---------- friendships ----------
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  constraint friendships_no_self_friend check (requester_id <> addressee_id),
  constraint friendships_unique_pair unique (requester_id, addressee_id)
);

alter table public.friendships enable row level security;

create policy "participants can read their own friendships"
  on public.friendships for select
  using (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "users can send friend requests as themselves"
  on public.friendships for insert
  with check (requester_id = auth.uid());

create policy "participants can update a friendship (e.g. accept)"
  on public.friendships for update
  using (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "participants can delete a friendship (e.g. decline/remove)"
  on public.friendships for delete
  using (requester_id = auth.uid() or addressee_id = auth.uid());

create index friendships_addressee_idx on public.friendships (addressee_id, status);
create index friendships_requester_idx on public.friendships (requester_id, status);
