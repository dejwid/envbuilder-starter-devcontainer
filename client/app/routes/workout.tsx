import { useState } from "react";
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

const availableExercises = [
  "Bench Press", "Squats", "Deadlifts", "Overhead Press", "Barbell Rows",
  "Pull-ups", "Dips", "Bicep Curls", "Tricep Extensions", "Lateral Raises",
  "Leg Press", "Leg Curls", "Leg Extensions", "Calf Raises", "Lunges",
  "Incline Bench Press", "Decline Bench Press", "Chest Flyes", "Lat Pulldowns",
  "Cable Rows", "Face Pulls", "Shrugs", "Upright Rows", "Hammer Curls",
  "Preacher Curls", "Close Grip Bench Press", "Skull Crushers", "Dumbbell Press"
];

export function meta() {
  return [
    { title: "New Workout - Fitness Club" },
    { name: "description", content: "Start a new workout session" },
  ];
}

export default function Workout() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startWorkout = () => {
    setWorkoutStarted(true);
    setStartTime(new Date());
  };

  const addExercise = () => {
    if (!selectedExercise.trim()) return;
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: selectedExercise,
      sets: []
    };
    
    setExercises([...exercises, newExercise]);
    setSelectedExercise("");
  };

  const addSet = (exerciseId: string) => {
    const newSet: Set = {
      id: Date.now().toString(),
      kg: 0,
      reps: 0
    };
    
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: [...exercise.sets, newSet] }
        : exercise
    ));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'kg' | 'reps', value: number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? {
            ...exercise,
            sets: exercise.sets.map(set => 
              set.id === setId ? { ...set, [field]: value } : set
            )
          }
        : exercise
    ));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: exercise.sets.filter(set => set.id !== setId) }
        : exercise
    ));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
  };

  const moveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    const currentIndex = exercises.findIndex(ex => ex.id === exerciseId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === exercises.length - 1)
    ) return;

    const newExercises = [...exercises];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newExercises[currentIndex], newExercises[targetIndex]] = [newExercises[targetIndex], newExercises[currentIndex]];
    setExercises(newExercises);
  };

  const finishWorkout = () => {
    if (exercises.length === 0) return;
    
    const workout = {
      id: Date.now().toString(),
      date: startTime || new Date(),
      exercises: exercises,
      duration: startTime ? Math.round((Date.now() - startTime.getTime()) / 1000 / 60) : 0
    };
    
    // Save to localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    savedWorkouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(savedWorkouts));
    
    // Reset state
    setExercises([]);
    setWorkoutStarted(false);
    setStartTime(null);
    
    alert('Workout saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            {workoutStarted ? 'Current Workout' : 'Start New Workout'}
          </h1>

          {!workoutStarted ? (
            <div className="text-center py-16">
              <div className="mb-8">
                <span className="text-6xl mb-4 block">🏋️‍♀️</span>
                <p className="text-white/80 text-lg mb-8">Ready to start your workout?</p>
              </div>
              <button
                onClick={startWorkout}
                className="bg-[#f0ff65] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Start Workout
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Workout Timer */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[#f0ff65] font-semibold">
                    Started: {startTime?.toLocaleTimeString()}
                  </div>
                  <div className="text-white">
                    Exercises: {exercises.length}
                  </div>
                </div>
              </div>

              {/* Add Exercise */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Add Exercise</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      list="exercises"
                      value={selectedExercise}
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      placeholder="Search or type exercise name..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#f0ff65]"
                    />
                    <datalist id="exercises">
                      {availableExercises.map(exercise => (
                        <option key={exercise} value={exercise} />
                      ))}
                    </datalist>
                  </div>
                  <button
                    onClick={addExercise}
                    className="bg-[#f0ff65] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Exercises List */}
              {exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{exercise.name}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveExercise(exercise.id, 'up')}
                        disabled={exerciseIndex === 0}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveExercise(exercise.id, 'down')}
                        disabled={exerciseIndex === exercises.length - 1}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeExercise(exercise.id)}
                        className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Sets */}
                  <div className="space-y-3">
                    {exercise.sets.length > 0 && (
                      <div className="grid grid-cols-4 gap-4 text-sm text-white/60 font-medium">
                        <div>Set</div>
                        <div>Weight (kg)</div>
                        <div>Reps</div>
                        <div>Actions</div>
                      </div>
                    )}
                    
                    {exercise.sets.map((set, setIndex) => (
                      <div key={set.id} className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-white font-medium">{setIndex + 1}</div>
                        <input
                          type="number"
                          value={set.kg || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'kg', Number(e.target.value))}
                          placeholder="0"
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#f0ff65]"
                        />
                        <input
                          type="number"
                          value={set.reps || ''}
                          onChange={(e) => updateSet(exercise.id, set.id, 'reps', Number(e.target.value))}
                          placeholder="0"
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#f0ff65]"
                        />
                        <button
                          onClick={() => removeSet(exercise.id, set.id)}
                          className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors w-fit"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => addSet(exercise.id)}
                      className="w-full py-3 bg-white/10 border-2 border-dashed border-white/30 rounded-lg text-white/60 hover:bg-white/20 hover:border-[#f0ff65]/50 hover:text-[#f0ff65] transition-all"
                    >
                      + Add Set
                    </button>
                  </div>
                </div>
              ))}

              {/* Finish Workout */}
              {exercises.length > 0 && (
                <div className="text-center pt-6">
                  <button
                    onClick={finishWorkout}
                    className="bg-green-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Finish Workout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}