import { useState } from "react";
import { Header, Footer, WorkoutCreator, WorkoutList } from "../components";

export function meta() {
  return [
    { title: "Workouts - Fitness Club" },
    { name: "description", content: "Create and manage your workouts" },
  ];
}

export default function Workout() {
  const [showCreator, setShowCreator] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const handleWorkoutCreated = () => {
    setShowCreator(false);
    setActiveTab('list');
  };

  const handleStartWorkout = (logId: string) => {
    // Navigate to workout session or show success message
    alert(`Workout started! Log ID: ${logId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header with tabs */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Workouts
              </h1>
              <button
                onClick={() => setShowCreator(true)}
                className="bg-[#f0ff65] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105"
              >
                Create New Workout
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-8">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'list'
                    ? 'bg-[#f0ff65] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                My Workouts
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === 'create'
                    ? 'bg-[#f0ff65] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Quick Create
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'list' ? (
              <WorkoutList onStartWorkout={handleStartWorkout} />
            ) : (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Workout Creator</h2>
                <p className="text-gray-400 mb-6">
                  Use the "Create New Workout" button above for the full workout builder, 
                  or create a simple workout here by selecting exercises.
                </p>
                <button
                  onClick={() => setShowCreator(true)}
                  className="bg-[#f0ff65] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105"
                >
                  Open Workout Builder
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Workout Creator Modal */}
      {showCreator && (
        <WorkoutCreator
          onClose={() => setShowCreator(false)}
          onWorkoutCreated={handleWorkoutCreated}
        />
      )}
    </div>
  );
}