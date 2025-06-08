import { useState } from 'react';
import { getAllExercises, type Exercise } from '../utils/exercises';
import { useWorkouts } from '../utils/useWorkouts';
import { type WorkoutExercise, type WorkoutSet } from '../utils/database';

interface WorkoutCreatorProps {
  onClose: () => void;
  onWorkoutCreated?: () => void;
}

export function WorkoutCreator({ onClose, onWorkoutCreated }: WorkoutCreatorProps) {
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseSets, setExerciseSets] = useState<Record<string, WorkoutSet[]>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { addWorkout, isInitialized, loading, error } = useWorkouts();
  const allExercises = getAllExercises();

  const filteredExercises = allExercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addExercise = (exercise: Exercise) => {
    if (!selectedExercises.find(e => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise]);
      setExerciseSets({
        ...exerciseSets,
        [exercise.id]: [{ reps: 10, weight: 0, completed: false }]
      });
    }
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(e => e.id !== exerciseId));
    const newSets = { ...exerciseSets };
    delete newSets[exerciseId];
    setExerciseSets(newSets);
  };

  const addSet = (exerciseId: string) => {
    const currentSets = exerciseSets[exerciseId] || [];
    const lastSet = currentSets[currentSets.length - 1];
    setExerciseSets({
      ...exerciseSets,
      [exerciseId]: [
        ...currentSets,
        { 
          reps: lastSet?.reps || 10, 
          weight: lastSet?.weight || 0, 
          completed: false 
        }
      ]
    });
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    const currentSets = exerciseSets[exerciseId] || [];
    if (currentSets.length > 1) {
      setExerciseSets({
        ...exerciseSets,
        [exerciseId]: currentSets.filter((_, index) => index !== setIndex)
      });
    }
  };

  const updateSet = (exerciseId: string, setIndex: number, field: keyof WorkoutSet, value: number) => {
    const currentSets = exerciseSets[exerciseId] || [];
    const updatedSets = currentSets.map((set, index) =>
      index === setIndex ? { ...set, [field]: value } : set
    );
    setExerciseSets({
      ...exerciseSets,
      [exerciseId]: updatedSets
    });
  };

  const createWorkout = async () => {
    if (!workoutName.trim() || selectedExercises.length === 0 || !isInitialized) {
      return;
    }

    setIsCreating(true);
    try {
      const workoutExercises: WorkoutExercise[] = selectedExercises.map(exercise => ({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: exerciseSets[exercise.id] || []
      }));

      await addWorkout(workoutName.trim(), workoutExercises);
      onWorkoutCreated?.();
      onClose();
    } catch (error) {
      console.error('Failed to create workout:', error);
      alert('Failed to create workout: ' + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-white mb-2">Initializing Database...</h2>
          <p className="text-gray-400">Please wait while we set up your workout database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Database Error</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Create New Workout</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Workout Name */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Enter workout name..."
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#f0ff65]"
            />
          </div>
        </div>

        <div className="flex h-[calc(90vh-200px)]">
          {/* Exercise Selection */}
          <div className="w-1/2 p-6 border-r border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Select Exercises</h3>
            
            {/* Search */}
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#f0ff65]"
            />

            {/* Exercise List */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100%-120px)]">
              {filteredExercises.map(exercise => (
                <div
                  key={exercise.id}
                  className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => addExercise(exercise)}
                >
                  <h4 className="text-white font-medium">{exercise.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {exercise.primaryMuscles.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Exercises */}
          <div className="w-1/2 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Selected Exercises ({selectedExercises.length})
            </h3>

            <div className="space-y-4 overflow-y-auto max-h-[calc(100%-60px)]">
              {selectedExercises.map(exercise => (
                <div key={exercise.id} className="p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{exercise.name}</h4>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Sets */}
                  <div className="space-y-2">
                    {(exerciseSets[exercise.id] || []).map((set, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm w-8">#{setIndex + 1}</span>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={set.reps || ''}
                          onChange={(e) => updateSet(exercise.id, setIndex, 'reps', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-[#f0ff65]"
                        />
                        <span className="text-gray-400 text-sm">reps</span>
                        <input
                          type="number"
                          placeholder="Weight"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(exercise.id, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-[#f0ff65]"
                        />
                        <span className="text-gray-400 text-sm">kg</span>
                        {(exerciseSets[exercise.id] || []).length > 1 && (
                          <button
                            onClick={() => removeSet(exercise.id, setIndex)}
                            className="text-red-400 hover:text-red-300 transition-colors ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addSet(exercise.id)}
                      className="text-[#f0ff65] hover:text-[#f0ff65]/80 transition-colors text-sm"
                    >
                      + Add Set
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createWorkout}
            disabled={!workoutName.trim() || selectedExercises.length === 0 || isCreating || !isInitialized}
            className="px-6 py-2 bg-[#f0ff65] text-black font-semibold rounded-lg hover:bg-[#f0ff65]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : !isInitialized ? 'Database Loading...' : 'Create Workout'}
          </button>
        </div>
      </div>
    </div>
  );
}