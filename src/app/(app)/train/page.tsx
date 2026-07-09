import { Dumbbell } from "lucide-react";
import { ComingSoon } from "@/components/shared/ComingSoon";

export default function TrainPage() {
  return (
    <div className="pt-2">
      <ComingSoon
        icon={Dumbbell}
        title="AI program builder"
        description="Pick a goal - build strength, lose fat, gain muscle, stay lean - or describe what you want in your own words, and get a program built from the exercise library."
        phase="Phase 1"
      />
    </div>
  );
}
