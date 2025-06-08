import { Header, Footer, WorkoutLog } from "../components";

export function meta() {
  return [
    { title: "Workout Log - Fitness Club" },
    { name: "description", content: "View your workout history" },
  ];
}

export default function Log() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <WorkoutLog />
      </main>
      
      <Footer />
    </div>
  );
}