"use client";

import { useEffect, useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { systemAudio } from "@/lib/gamification/audio";
import {
  getFriends,
  getPendingRequests,
  respondToRequest,
  searchProfiles,
  sendFriendRequest,
  type FriendProfile,
  type PendingRequest,
} from "@/services/social/friends";

interface FriendsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** "FRIENDS" sheet - search hunters, send/accept requests, see accepted friends' rank. */
export function FriendsPanel({ open, onOpenChange }: FriendsPanelProps) {
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [pending, setPending] = useState<PendingRequest[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !isSupabaseConfigured) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([getFriends(), getPendingRequests()])
      .then(([f, p]) => {
        setFriends(f);
        setPending(p);
        setError(null);
      })
      .catch(() => setError("Sign in to see your hunters."))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (query.trim().length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    const id = setTimeout(() => {
      searchProfiles(query).then(setResults).catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[85vh] max-w-xl overflow-y-auto rounded-t-2xl border-t border-signal/25 bg-surface-2 px-5 pt-2 pb-8 hud-panel">
        <SheetHeader className="px-0">
          <SheetTitle className="flex items-center gap-2 font-display text-lg hud-glow-text">
            <Users size={18} className="text-signal" />
            Friends
          </SheetTitle>
        </SheetHeader>

        {!isSupabaseConfigured ? (
          <p className="px-0 text-xs text-muted-foreground">
            Friends require a connected account. This device is running in local mode.
          </p>
        ) : (
          <div className="flex flex-col gap-5 px-0">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hunters by username"
                className="pl-8"
              />
            </div>

            {results.length > 0 && (
              <section className="flex flex-col gap-1.5">
                {results.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-md border border-border bg-background/30 px-3 py-2">
                    <span className="font-mono text-xs">{r.username ?? r.displayName ?? "Hunter"}</span>
                    <button
                      type="button"
                      onClick={() => {
                        systemAudio.click();
                        void sendFriendRequest(r.id);
                        setQuery("");
                      }}
                      className="flex items-center gap-1 rounded-md border border-signal/30 px-2 py-1 font-mono text-[10px] text-signal transition-colors hover:bg-signal/10"
                    >
                      <UserPlus size={11} />
                      Add
                    </button>
                  </div>
                ))}
              </section>
            )}

            {pending.length > 0 && (
              <section>
                <h3 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Requests</h3>
                <div className="flex flex-col gap-1.5">
                  {pending.map((p) => (
                    <div key={p.friendshipId} className="flex items-center justify-between rounded-md border border-signal/20 bg-signal/5 px-3 py-2">
                      <span className="font-mono text-xs">{p.from.username ?? p.from.displayName ?? "Hunter"}</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            systemAudio.questComplete();
                            void respondToRequest(p.friendshipId, true).then(() =>
                              setPending((prev) => prev.filter((r) => r.friendshipId !== p.friendshipId)),
                            );
                          }}
                          className="rounded-md border border-progress/40 px-2 py-1 font-mono text-[10px] text-progress transition-colors hover:bg-progress/10"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void respondToRequest(p.friendshipId, false).then(() =>
                              setPending((prev) => prev.filter((r) => r.friendshipId !== p.friendshipId)),
                            );
                          }}
                          className="rounded-md border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Your Hunters {friends.length > 0 && `(${friends.length})`}
              </h3>
              {loading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
              ) : error ? (
                <p className="text-xs text-muted-foreground">{error}</p>
              ) : friends.length === 0 ? (
                <p className="text-xs text-muted-foreground">No hunters added yet. Search above to send a request.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {friends.map((f) => (
                    <div key={f.id} className="flex items-center justify-between rounded-md border border-border bg-background/30 px-3 py-2">
                      <span className="font-mono text-xs">{f.username ?? f.displayName ?? "Hunter"}</span>
                      <span className="font-mono text-[10px] text-signal">Lv.{f.level} - {f.rankTitle}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
