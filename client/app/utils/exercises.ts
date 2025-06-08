import exercisesData from '../exercises/exercises.json';

export interface Exercise {
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

// Load all exercises from the JSON file
export const getAllExercises = (): Exercise[] => {
  return exercisesData as Exercise[];
};

// Get exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return exercisesData.find(exercise => exercise.id === id) as Exercise | undefined;
};

// Get exercises by category
export const getExercisesByCategory = (category: string): Exercise[] => {
  if (category === 'all') {
    return exercisesData as Exercise[];
  }
  return exercisesData.filter(exercise => exercise.category === category) as Exercise[];
};

// Get exercises by primary muscle
export const getExercisesByMuscle = (muscle: string): Exercise[] => {
  return exercisesData.filter(exercise => 
    exercise.primaryMuscles.some(m => m.toLowerCase().includes(muscle.toLowerCase()))
  ) as Exercise[];
};

// Search exercises by name
export const searchExercises = (searchTerm: string): Exercise[] => {
  if (!searchTerm.trim()) {
    return exercisesData as Exercise[];
  }
  
  const term = searchTerm.toLowerCase();
  return exercisesData.filter(exercise =>
    exercise.name.toLowerCase().includes(term) ||
    exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(term)) ||
    exercise.secondaryMuscles.some(muscle => muscle.toLowerCase().includes(term)) ||
    exercise.equipment?.toLowerCase().includes(term) ||
    exercise.category.toLowerCase().includes(term)
  ) as Exercise[];
};

// Get unique categories
export const getCategories = (): string[] => {
  const categories = new Set(exercisesData.map(exercise => exercise.category));
  return Array.from(categories).sort();
};

// Get unique equipment types
export const getEquipmentTypes = (): string[] => {
  const equipment = new Set(
    exercisesData
      .map(exercise => exercise.equipment)
      .filter(eq => eq !== null)
  );
  return Array.from(equipment).sort();
};

// Get unique muscle groups
export const getMuscleGroups = (): string[] => {
  const muscles = new Set([
    ...exercisesData.flatMap(exercise => exercise.primaryMuscles),
    ...exercisesData.flatMap(exercise => exercise.secondaryMuscles)
  ]);
  return Array.from(muscles).sort();
};

// Get exercise image path
export const getExerciseImagePath = (exercise: Exercise, imageIndex: number = 0): string => {
  if (exercise.images && exercise.images[imageIndex]) {
    return `/exercises/${exercise.images[imageIndex]}`;
  }
  return '';
};

// Map muscle groups to categories for filtering
export const muscleToCategory: Record<string, string> = {
  'abdominals': 'waist',
  'obliques': 'waist',
  'biceps': 'upper-arms',
  'triceps': 'upper-arms',
  'forearms': 'lower-arms',
  'chest': 'chest',
  'lats': 'back',
  'middle back': 'back',
  'lower back': 'back',
  'traps': 'back',
  'shoulders': 'shoulders',
  'quadriceps': 'upper-legs',
  'hamstrings': 'upper-legs',
  'glutes': 'upper-legs',
  'calves': 'lower-legs',
  'neck': 'neck'
};

// Get exercises by UI category (maps to muscle groups)
export const getExercisesByUICategory = (category: string): Exercise[] => {
  if (category === 'all') {
    return exercisesData as Exercise[];
  }
  
  if (category === 'cardio') {
    return exercisesData.filter(exercise => 
      exercise.category === 'cardio' || 
      exercise.category === 'plyometrics'
    ) as Exercise[];
  }
  
  // Map UI categories to muscle groups
  const muscleGroups = Object.entries(muscleToCategory)
    .filter(([_, cat]) => cat === category)
    .map(([muscle, _]) => muscle);
  
  return exercisesData.filter(exercise =>
    exercise.primaryMuscles.some(muscle => 
      muscleGroups.some(mg => muscle.toLowerCase().includes(mg))
    )
  ) as Exercise[];
};