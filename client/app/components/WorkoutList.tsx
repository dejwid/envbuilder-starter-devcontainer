import { useState, useEffect } from 'react';
import { useWorkouts } from '../utils/useWorkouts';
import { type Workout } from '../utils/database';

interface WorkoutListProps {
  onStartWorkout?: (workoutId: string) => void;
}

export function WorkoutList({ onStartWorkout }: WorkoutListProps) {
  const { workouts, loading, error, isInitialized, loadWorkouts, removeWorkout, beginWorkout } = useWorkouts();
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    if (isInitialized) {
      loadWorkouts();
    }
  }, [isInitialized]);

  const handleDeleteWorkout = async (workoutId: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      try {
        await removeWorkout(workoutId);
      } catch (error) {
        console.error('Failed to delete workout:', error);
      }
    }
  };

  const handleStartWorkout = async (workoutId: string) => {
    try {
      const log = await beginWorkout(workoutId);
      onStartWorkout?.(log.id);
    } catch (error) {
      console.error('Failed to start workout:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading workouts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-12 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">My Workouts</h2>
        <div className="text-gray-400">
          {workouts.length} workout{workouts.length !== 1 ? 's' : ''} saved
        </div>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💪</div>
          <h3 className="text-xl font-semibold text-white mb-2">No workouts created yet</h3>
          <p className="text-gray-400">Create your first workout to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-[#f0ff65]/50 transition-all duration-300 hover:scale-105"
            >
              {/* Header bar */}
              <div className="h-1 bg-[#f0ff65]"></div>
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{workout.name}</h3>
                    <p className="text-gray-400 text-sm">
                      Created {new Date(workout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedWorkout(workout)}
                      className="text-gray-400 hover:text-[#f0ff65] transition-colors"
                      title="View details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete workout"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold text-[#f0ff65]">
                      {workout.exercises.length}
                    </div>
                    <div className="text-gray-400 text-sm">Exercises</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#f0ff65]">
                      {workout.exercises.reduce((total, ex) => total + ex.sets.length, 0)}
                    </div>
                    <div className="text-gray-400 text-sm">Total Sets</div>
                  </div>
                </div>

                {/* Exercise preview */}
                <div className="space-y-2 mb-6">
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{exercise.exerciseName}</span>
                      <span className="text-gray-400">
                        {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div className="text-gray-400 text-sm">
                      +{workout.exercises.length - 3} more exercise{workout.exercises.length - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Start button */}
                <button
                  onClick={() => handleStartWorkout(workout.id)}
                  className="w-full bg-[#f0ff65] text-black font-semibold py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105"
                >
                  Start Workout
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Workout Modal */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedWorkout.name}</h2>
                  <p className="text-gray-400">
                    Created {new Date(selectedWorkout.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedWorkout(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f0ff65]">{selectedWorkout.exercises.length}</div>
                  <div className="text-gray-400 text-sm">Exercises</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f0ff65]">
                    {selectedWorkout.exercises.reduce((total, ex) => total + ex.sets.length, 0)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Sets</div>
                </div>
              </div>

              {/* Exercises */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Exercises</h3>
                {selectedWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="text-white font-medium mb-3">{exercise.exerciseName}</h4>
                    <div className="space-y-2">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex} className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400 w-8">#{setIndex + 1}</span>
                          {set.reps && (
                            <span className="text-white">{set.reps} reps</span>
                          )}
                          {set.weight && (
                            <span className="text-white">{set.weight} kg</span>
                          )}
                          {set.duration && (
                            <span className="text-white">{set.duration}s</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {selectedWorkout.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-300">{selectedWorkout.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-end gap-4">
              <button
                onClick={() => setSelectedWorkout(null)}
                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleStartWorkout(selectedWorkout.id);
                  setSelectedWorkout(null);
                }}
                className="px-6 py-2 bg-[#f0ff65] text-black font-semibold rounded-lg hover:bg-[#f0ff65]/90 transition-colors"
              >
                Start Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}