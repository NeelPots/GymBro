import { HomeView } from "@/components/home/HomeView";
import { getExercises } from "@/services/movements/getExercises";

export default async function HomePage() {
  const exercises = await getExercises();
  return <HomeView exercises={exercises} />;
}
