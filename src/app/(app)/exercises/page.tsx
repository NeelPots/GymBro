import { ExerciseLibraryView } from "@/components/exercises/ExerciseLibraryView";
import { getExercises } from "@/services/movements/getExercises";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const exercises = await getExercises();
  const { category } = await searchParams;
  return <ExerciseLibraryView exercises={exercises} initialCategory={category} />;
}
