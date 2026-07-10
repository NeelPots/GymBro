import { notFound } from "next/navigation";
import { ExerciseDetailView } from "@/components/exercises/ExerciseDetailView";
import { getExerciseById } from "@/services/movements/getExerciseById";

export default async function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exercise = await getExerciseById(id);

  if (!exercise) {
    notFound();
  }

  return <ExerciseDetailView exercise={exercise} />;
}
