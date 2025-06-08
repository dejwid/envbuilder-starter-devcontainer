import { getDatabase, type Workout, type WorkoutLog, type WorkoutExercise } from './database';
import { v4 as uuidv4 } from 'uuid';

// Workout CRUD operations
export const createWorkout = async (name: string, exercises: WorkoutExercise[]): Promise<Workout> => {
  console.log('createWorkout: Getting database...');
  const db = getDatabase();
  console.log('createWorkout: Database obtained:', !!db);
  
  const workout: Workout = {
    id: uuidv4(),
    name,
    exercises,
    createdAt: new Date().toISOString()
  };

  await db.workouts.insert(workout);
  return workout;
};

export const getWorkouts = async (): Promise<Workout[]> => {
  const db = getDatabase();
  const workouts = await db.workouts.find().exec();
  return workouts.map((doc: any) => doc.toJSON());
};

export const getWorkoutById = async (id: string): Promise<Workout | null> => {
  const db = getDatabase();
  const workout = await db.workouts.findOne(id).exec();
  return workout ? workout.toJSON() : null;
};

export const updateWorkout = async (id: string, updates: Partial<Workout>): Promise<Workout | null> => {
  const db = getDatabase();
  const workout = await db.workouts.findOne(id).exec();
  
  if (!workout) {
    return null;
  }

  await workout.update({
    $set: updates
  });

  return workout.toJSON();
};

export const deleteWorkout = async (id: string): Promise<boolean> => {
  const db = getDatabase();
  const workout = await db.workouts.findOne(id).exec();
  
  if (!workout) {
    return false;
  }

  await workout.remove();
  return true;
};

// Workout Log CRUD operations
export const startWorkout = async (workoutId: string): Promise<WorkoutLog> => {
  const db = getDatabase();
  const workout = await getWorkoutById(workoutId);
  
  if (!workout) {
    throw new Error('Workout not found');
  }

  const workoutLog: WorkoutLog = {
    id: uuidv4(),
    workoutId: workout.id,
    workoutName: workout.name,
    exercises: workout.exercises.map(exercise => ({
      ...exercise,
      sets: exercise.sets.map(set => ({
        ...set,
        completed: false
      }))
    })),
    startedAt: new Date().toISOString()
  };

  await db.workoutlogs.insert(workoutLog);
  return workoutLog;
};

export const completeWorkout = async (logId: string, notes?: string): Promise<WorkoutLog | null> => {
  const db = getDatabase();
  const log = await db.workoutlogs.findOne(logId).exec();
  
  if (!log) {
    return null;
  }

  const completedAt = new Date().toISOString();
  const startedAt = new Date(log.startedAt);
  const duration = Math.floor((new Date(completedAt).getTime() - startedAt.getTime()) / 1000);

  await log.update({
    $set: {
      completedAt,
      duration,
      notes: notes || ''
    }
  });

  return log.toJSON();
};

export const updateWorkoutLog = async (logId: string, updates: Partial<WorkoutLog>): Promise<WorkoutLog | null> => {
  const db = getDatabase();
  const log = await db.workoutlogs.findOne(logId).exec();
  
  if (!log) {
    return null;
  }

  await log.update({
    $set: updates
  });

  return log.toJSON();
};

export const getWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const db = getDatabase();
  const logs = await db.workoutlogs.find().sort({ startedAt: -1 }).exec();
  return logs.map((doc: any) => doc.toJSON());
};

export const getWorkoutLogById = async (id: string): Promise<WorkoutLog | null> => {
  const db = getDatabase();
  const log = await db.workoutlogs.findOne(id).exec();
  return log ? log.toJSON() : null;
};

export const deleteWorkoutLog = async (id: string): Promise<boolean> => {
  const db = getDatabase();
  const log = await db.workoutlogs.findOne(id).exec();
  
  if (!log) {
    return false;
  }

  await log.remove();
  return true;
};

// Helper functions
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
};

export const calculateWorkoutProgress = (log: WorkoutLog): number => {
  const totalSets = log.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  const completedSets = log.exercises.reduce(
    (total, exercise) => total + exercise.sets.filter(set => set.completed).length,
    0
  );
  
  return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
};