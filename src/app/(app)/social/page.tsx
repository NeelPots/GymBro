import { Users } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function SocialPage() {
  return (
    <div className="pt-2">
      <ComingSoon
        icon={Users}
        title="Gym community feed"
        description="Posts, 24-hour stories, and progress updates from the community - a space to share what you're working on, separate from your training data."
        phase="Phase 3"
      />
    </div>
  );
}
