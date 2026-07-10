import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostAuthor } from "@/lib/types/domain";

export function authorLabel(author: PostAuthor): string {
  return author.displayName ?? author.username ?? "Someone";
}

export function AuthorAvatar({ author, size = "default" }: { author: PostAuthor; size?: "sm" | "default" | "lg" }) {
  const label = authorLabel(author);
  const initial = label.charAt(0).toUpperCase();

  return (
    <Avatar size={size}>
      {author.avatarUrl && <AvatarImage src={author.avatarUrl} alt={label} />}
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  );
}
