import { TrainView } from "@/components/train/TrainView";
import { getExercises } from "@/services/movements/getExercises";

export default async function TrainPage() {
  const exercises = await getExercises();
  return (
    <div className="pt-2">
      <TrainView exercises={exercises} />
    </div>
  );
}
