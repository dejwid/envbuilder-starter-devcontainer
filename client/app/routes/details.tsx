import { useState, useEffect } from "react";
import { Header } from "../components";

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
    { title: "Workout Details - Fitness Club" },
    { name: "description", content: "View detailed workout information" },
  ];
}

export default function Details() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        // Get workoutId from URL path
        const pathParts = window.location.pathname.split('/');
        const workoutId = pathParts[pathParts.length - 1];
        
        const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
        const foundWorkout = savedWorkouts.find((w: any) => w.id === workoutId);
        
        if (foundWorkout) {
          setWorkout({
            ...foundWorkout,
            date: new Date(foundWorkout.date)
          });
        }
      } catch (error) {
        console.error('Failed to load workout:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, []);

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">⏳</div>
            <p className="text-white/80">Loading workout details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white">
        <Header />
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-white mb-4">Workout Not Found</h1>
            <p className="text-white/80 mb-8">The requested workout could not be found.</p>
            <a
              href="/log"
              className="bg-[#f0ff65] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-colors"
            >
              Back to Log
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <a
              href="/log"
              className="inline-flex items-center text-[#f0ff65] hover:text-[#f0ff65]/80 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Log
            </a>
          </div>

          {/* Workout Header */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Workout Details
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-white/60">Date</p>
                <p className="text-white font-medium">{formatDate(workout.date)}</p>
              </div>
              <div>
                <p className="text-white/60">Time</p>
                <p className="text-white font-medium">{formatTime(workout.date)}</p>
              </div>
              <div>
                <p className="text-white/60">Duration</p>
                <p className="text-white font-medium">{workout.duration} minutes</p>
              </div>
              <div>
                <p className="text-white/60">Exercises</p>
                <p className="text-white font-medium">{workout.exercises.length}</p>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="space-y-6">
            {workout.exercises.map((exercise, exerciseIndex) => (
              <div key={exercise.id} className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {exerciseIndex + 1}. {exercise.name}
                  </h2>
                  <div className="text-sm text-white/60">
                    {exercise.sets.length} sets
                  </div>
                </div>
                
                {exercise.sets.length > 0 && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm text-white/60 font-medium border-b border-white/10 pb-2">
                      <div>Set</div>
                      <div>Weight (kg)</div>
                      <div>Reps</div>
                    </div>
                    
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-white font-medium">{setIndex + 1}</div>
                        <div className="text-[#f0ff65] font-medium">{set.kg}</div>
                        <div className="text-[#f0ff65] font-medium">{set.reps}</div>
                      </div>
                    ))}
                    
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/60">Total Sets: </span>
                          <span className="text-white font-medium">{exercise.sets.length}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Volume: </span>
                          <span className="text-[#f0ff65] font-medium">
                            {exercise.sets.reduce((total, set) => total + (set.kg * set.reps), 0)} kg
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Workout Summary */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Workout Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0ff65] mb-1">
                  {workout.exercises.length}
                </div>
                <div className="text-white/60 text-sm">Exercises</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0ff65] mb-1">
                  {getTotalSets(workout)}
                </div>
                <div className="text-white/60 text-sm">Total Sets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0ff65] mb-1">
                  {getTotalVolume(workout)}
                </div>
                <div className="text-white/60 text-sm">Total Volume (kg)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#f0ff65] mb-1">
                  {workout.duration}
                </div>
                <div className="text-white/60 text-sm">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}