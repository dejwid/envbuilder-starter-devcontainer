import { useState, useEffect } from 'react';
import { initDatabase, type Workout, type WorkoutLog, type WorkoutExercise } from './database';
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  startWorkout,
  completeWorkout,
  updateWorkoutLog,
  getWorkoutLogs,
  getWorkoutLogById,
  deleteWorkoutLog
} from './workoutService';

export const useWorkouts = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        console.log('useWorkouts: Starting initialization...');
        const db = await initDatabase();
        console.log('useWorkouts: Database initialized:', !!db);
        setIsInitialized(true);
        console.log('useWorkouts: Loading workouts...');
        await loadWorkouts();
        console.log('useWorkouts: Loading workout logs...');
        await loadWorkoutLogs();
        console.log('useWorkouts: Initialization complete');
      } catch (err) {
        console.error('useWorkouts: Initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const loadWorkouts = async () => {
    if (!isInitialized) {
      setError('Database not initialized');
      return;
    }
    try {
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workouts');
    }
  };

  const loadWorkoutLogs = async () => {
    if (!isInitialized) {
      setError('Database not initialized');
      return;
    }
    try {
      const data = await getWorkoutLogs();
      setWorkoutLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workout logs');
    }
  };

  const addWorkout = async (name: string, exercises: WorkoutExercise[]) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      const newWorkout = await createWorkout(name, exercises);
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workout');
      throw err;
    }
  };

  const editWorkout = async (id: string, updates: Partial<Workout>) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      const updatedWorkout = await updateWorkout(id, updates);
      if (updatedWorkout) {
        setWorkouts(prev => prev.map(w => w.id === id ? updatedWorkout : w));
      }
      return updatedWorkout;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workout');
      throw err;
    }
  };

  const removeWorkout = async (id: string) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      const success = await deleteWorkout(id);
      if (success) {
        setWorkouts(prev => prev.filter(w => w.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workout');
      throw err;
    }
  };

  const beginWorkout = async (workoutId: string) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      const newLog = await startWorkout(workoutId);
      setWorkoutLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start workout');
      throw err;
    }
  };

  const finishWorkout = async (logId: string, notes?: string) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      const completedLog = await completeWorkout(logId, notes);
      if (completedLog) {
        setWorkoutLogs(prev => prev.map(log => log.id === logId ? completedLog : log));
      }
      return completedLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete workout');
      throw err;
    }
  };

  const updateLog = async (logId: string, updates: Partial<WorkoutLog>) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      const updatedLog = await updateWorkoutLog(logId, updates);
      if (updatedLog) {
        setWorkoutLogs(prev => prev.map(log => log.id === logId ? updatedLog : log));
      }
      return updatedLog;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workout log');
      throw err;
    }
  };

  const removeWorkoutLog = async (id: string) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      const success = await deleteWorkoutLog(id);
      if (success) {
        setWorkoutLogs(prev => prev.filter(log => log.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workout log');
      throw err;
    }
  };

  const getWorkout = async (id: string) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      return await getWorkoutById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get workout');
      throw err;
    }
  };

  const getWorkoutLog = async (id: string) => {
    if (!isInitialized) {
      throw new Error('Database not initialized');
    }
    try {
      return await getWorkoutLogById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get workout log');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return {
    // State
    isInitialized,
    workouts,
    workoutLogs,
    loading,
    error,
    
    // Actions
    addWorkout,
    editWorkout,
    removeWorkout,
    getWorkout,
    beginWorkout,
    finishWorkout,
    updateLog,
    removeWorkoutLog,
    getWorkoutLog,
    loadWorkouts,
    loadWorkoutLogs,
    clearError
  };
};