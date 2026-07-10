import { ExerciseLibraryView } from "@/components/exercises/ExerciseLibraryView";
import { getExercises } from "@/services/movements/getExercises";

export default async function ExercisesPage() {
  const exercises = await getExercises();
  return <ExerciseLibraryView exercises={exercises} />;
}
