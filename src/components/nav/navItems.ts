import { Home, Dumbbell, LineChart, Users } from "lucide-react";

export const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/train", label: "Train", icon: Dumbbell },
  { href: "/history", label: "History", icon: LineChart },
  { href: "/social", label: "Social", icon: Users },
] as const;
