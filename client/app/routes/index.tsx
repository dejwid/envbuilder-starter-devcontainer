import type { Route } from "./+types/index";
import { Header, HeroSection, ExercisesSection, ExerciseResults, Footer } from "../components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fitness Club - Sweat, Smile and Repeat" },
    { name: "description", content: "Check out the most effective exercises personalized to you" },
  ];
}

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ExercisesSection />
        <ExerciseResults />
      </main>
      <Footer />
    </div>
  );
}