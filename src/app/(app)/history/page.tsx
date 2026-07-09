import { HistoryView } from "@/components/history/HistoryView";
import { getExercises } from "@/services/movements/getExercises";

export default async function HistoryPage() {
  const exercises = await getExercises();
  return <HistoryView exercises={exercises} />;
}
