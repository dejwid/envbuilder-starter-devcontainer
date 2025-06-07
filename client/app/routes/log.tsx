import { useState, useEffect } from "react";
import { Header, Footer } from "../components";

interface Set {
  id: string;
  kg: number;
  reps: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Workout {
  id: string;
  date: Date;
  exercises: Exercise[];
  duration: number;
}

export function meta() {
  return [
    { title: "Workout Log - Fitness Club" },
    { name: "description", content: "View your workout history" },
  ];
}

export default function Log() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const loadWorkouts = async () => {
      const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      
      let workoutsToLoad = savedWorkouts;
      
      // If no saved workouts, load dummy data
      if (savedWorkouts.length === 0) {
        try {
          const response = await fetch('/log.json');
          const dummyData = await response.json();
          workoutsToLoad = dummyData;
          // Save dummy data to localStorage so it persists
          localStorage.setItem('workouts', JSON.stringify(dummyData));
        } catch (error) {
          console.error('Failed to load dummy workout data:', error);
        }
      }
      
      const parsedWorkouts = workoutsToLoad.map((workout: any) => ({
        ...workout,
        date: new Date(workout.date)
      }));
      
      setWorkouts(parsedWorkouts.sort((a: Workout, b: Workout) => b.date.getTime() - a.date.getTime()));
    };
    
    loadWorkouts();
  }, []);

  const deleteWorkout = (workoutId: string) => {
    const updatedWorkouts = workouts.filter(w => w.id !== workoutId);
    setWorkouts(updatedWorkouts);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  };

  const getTotalSets = (workout: Workout) => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };

  const getTotalVolume = (workout: Workout) => {
    return workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.reduce((exerciseTotal, set) => 
        exerciseTotal + (set.kg * set.reps), 0), 0);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Workout Log
            </h1>

            {workouts.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-8">
                <span className="text-6xl mb-4 block">📊</span>
                <p className="text-white/80 text-lg mb-4">No workouts logged yet</p>
                <p className="text-white/60">Start your first workout to see it here!</p>
              </div>
              <a
                href="/workout"
                className="inline-block bg-[#f0ff65] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Workout
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Workouts</h2>
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-black/20 backdrop-blur-sm rounded-lg p-6 transition-all hover:bg-black/30 border-2 border-transparent hover:border-white/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {formatDate(workout.date)}
                      </h3>
                      <p className="text-[#f0ff65] text-sm">
                        {formatTime(workout.date)} • {workout.duration} min
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkout(workout.id);
                      }}
                      className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-white/60">Exercises</p>
                      <p className="text-white font-medium">{workout.exercises.length}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Sets</p>
                      <p className="text-white font-medium">{getTotalSets(workout)}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Volume</p>
                      <p className="text-white font-medium">{getTotalVolume(workout)} kg</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-white/60 text-sm mb-2">Exercises:</p>
                    <div className="flex flex-wrap gap-2">
                      {workout.exercises.slice(0, 3).map((exercise) => (
                        <span
                          key={exercise.id}
                          className="px-2 py-1 bg-[#f0ff65]/20 text-[#f0ff65] rounded-full text-xs"
                        >
                          {exercise.name}
                        </span>
                      ))}
                      {workout.exercises.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs">
                          +{workout.exercises.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href={`/details/${workout.id}`}
                      className="bg-[#f0ff65] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#f0ff65]/90 transition-colors text-sm"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}