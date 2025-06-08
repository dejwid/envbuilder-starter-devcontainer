import { useState, useEffect } from "react";
import { Header, Footer } from "../components";
import { useWorkouts } from "../utils/useWorkouts";
import { type WorkoutExercise } from "../utils/database";

export function meta() {
  return [
    { title: "RxDB Demo - Fitness Club" },
    { name: "description", content: "Demo of RxDB workout functionality" },
  ];
}

export default function Demo() {
  const {
    isInitialized,
    workouts,
    workoutLogs,
    loading,
    error,
    addWorkout,
    beginWorkout,
    finishWorkout,
    clearError
  } = useWorkouts();

  const [demoWorkoutName, setDemoWorkoutName] = useState("Demo Push Workout");

  const createDemoWorkout = async () => {
    const demoExercises: WorkoutExercise[] = [
      {
        exerciseId: "push-up",
        exerciseName: "Push-ups",
        sets: [
          { reps: 10, weight: 0, completed: false },
          { reps: 12, weight: 0, completed: false },
          { reps: 8, weight: 0, completed: false }
        ]
      },
      {
        exerciseId: "bench-press",
        exerciseName: "Bench Press",
        sets: [
          { reps: 8, weight: 60, completed: false },
          { reps: 6, weight: 65, completed: false },
          { reps: 4, weight: 70, completed: false }
        ]
      }
    ];

    try {
      await addWorkout(demoWorkoutName, demoExercises);
      alert("Demo workout created successfully!");
    } catch (err) {
      alert("Failed to create workout: " + (err as Error).message);
    }
  };

  const startDemoWorkout = async () => {
    if (workouts.length === 0) {
      alert("Please create a workout first!");
      return;
    }

    try {
      const log = await beginWorkout(workouts[0].id);
      alert(`Workout started! Log ID: ${log.id}`);
    } catch (err) {
      alert("Failed to start workout: " + (err as Error).message);
    }
  };

  const completeDemoWorkout = async () => {
    const activeLog = workoutLogs.find(log => !log.completedAt);
    if (!activeLog) {
      alert("No active workout to complete!");
      return;
    }

    try {
      await finishWorkout(activeLog.id, "Great workout session!");
      alert("Workout completed successfully!");
    } catch (err) {
      alert("Failed to complete workout: " + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-2">Initializing RxDB...</h2>
            <p className="text-gray-400">Setting up your workout database</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              RxDB Workout Demo
            </h1>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-red-300 font-semibold">Error</h3>
                    <p className="text-red-200">{error}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-300 hover:text-red-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Database Status */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Database Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${isInitialized ? 'text-green-400' : 'text-red-400'}`}>
                    {isInitialized ? '✅' : '❌'}
                  </div>
                  <div className="text-gray-400 text-sm">Database</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f0ff65]">{workouts.length}</div>
                  <div className="text-gray-400 text-sm">Saved Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f0ff65]">{workoutLogs.length}</div>
                  <div className="text-gray-400 text-sm">Workout Logs</div>
                </div>
              </div>
            </div>

            {/* Demo Actions */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Demo Actions</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={demoWorkoutName}
                    onChange={(e) => setDemoWorkoutName(e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#f0ff65]"
                    placeholder="Workout name..."
                  />
                  <button
                    onClick={createDemoWorkout}
                    disabled={!isInitialized}
                    className="bg-[#f0ff65] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#f0ff65]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Demo Workout
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={startDemoWorkout}
                    disabled={!isInitialized || workouts.length === 0}
                    className="bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Workout
                  </button>
                  <button
                    onClick={completeDemoWorkout}
                    disabled={!isInitialized || !workoutLogs.some(log => !log.completedAt)}
                    className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Complete Workout
                  </button>
                </div>
              </div>
            </div>

            {/* Workouts List */}
            {workouts.length > 0 && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Saved Workouts</h2>
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <div key={workout.id} className="bg-gray-800 rounded-lg p-4">
                      <h3 className="text-white font-medium">{workout.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {workout.exercises.length} exercises • Created {new Date(workout.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Workout Logs */}
            {workoutLogs.length > 0 && (
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Workout Logs</h2>
                <div className="space-y-3">
                  {workoutLogs.map((log) => (
                    <div key={log.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">{log.workoutName}</h3>
                          <p className="text-gray-400 text-sm">
                            Started: {new Date(log.startedAt).toLocaleString()}
                          </p>
                          {log.completedAt && (
                            <p className="text-green-400 text-sm">
                              Completed: {new Date(log.completedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs ${
                          log.completedAt 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {log.completedAt ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}