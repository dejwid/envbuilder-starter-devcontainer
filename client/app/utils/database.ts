import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

// Add plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

// Workout schema
export const workoutSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    name: {
      type: 'string',
      maxLength: 200
    },
    exercises: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          exerciseId: {
            type: 'string',
            maxLength: 100
          },
          exerciseName: {
            type: 'string',
            maxLength: 200
          },
          sets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                reps: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1000
                },
                weight: {
                  type: 'number',
                  minimum: 0,
                  maximum: 10000
                },
                duration: {
                  type: 'number',
                  minimum: 0,
                  maximum: 86400
                },
                completed: {
                  type: 'boolean'
                }
              },
              required: ['completed'],
              additionalProperties: false
            }
          }
        },
        required: ['exerciseId', 'exerciseName', 'sets'],
        additionalProperties: false
      }
    },
    createdAt: {
      type: 'string',
      format: 'date-time'
    },
    completedAt: {
      type: 'string',
      format: 'date-time'
    },
    duration: {
      type: 'number',
      minimum: 0,
      maximum: 86400
    },
    notes: {
      type: 'string',
      maxLength: 1000
    }
  },
  required: ['id', 'name', 'exercises', 'createdAt'],
  additionalProperties: false
};

// Workout log schema
export const workoutLogSchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    workoutId: {
      type: 'string',
      maxLength: 100
    },
    workoutName: {
      type: 'string',
      maxLength: 200
    },
    exercises: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          exerciseId: {
            type: 'string',
            maxLength: 100
          },
          exerciseName: {
            type: 'string',
            maxLength: 200
          },
          sets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                reps: {
                  type: 'number',
                  minimum: 0,
                  maximum: 1000
                },
                weight: {
                  type: 'number',
                  minimum: 0,
                  maximum: 10000
                },
                duration: {
                  type: 'number',
                  minimum: 0,
                  maximum: 86400
                },
                completed: {
                  type: 'boolean'
                }
              },
              required: ['completed'],
              additionalProperties: false
            }
          }
        },
        required: ['exerciseId', 'exerciseName', 'sets'],
        additionalProperties: false
      }
    },
    startedAt: {
      type: 'string',
      format: 'date-time'
    },
    completedAt: {
      type: 'string',
      format: 'date-time'
    },
    duration: {
      type: 'number',
      minimum: 0,
      maximum: 86400
    },
    notes: {
      type: 'string',
      maxLength: 1000
    }
  },
  required: ['id', 'workoutId', 'workoutName', 'exercises', 'startedAt'],
  additionalProperties: false
};

// Database instance
let dbInstance: any = null;

export const initDatabase = async () => {
  if (dbInstance) {
    console.log('Database already initialized, returning existing instance');
    return dbInstance;
  }

  try {
    console.log('Starting database initialization...');
    
    // Create database with LocalStorage storage
    console.log('Creating RxDB database with LocalStorage...');
    dbInstance = await createRxDatabase({
      name: 'workoutdb',
      storage: getRxStorageLocalstorage(),
      multiInstance: false
    });

    console.log('Database created, adding collections...');
    
    // Add collections
    await dbInstance.addCollections({
      workouts: {
        schema: workoutSchema
      },
      workoutlogs: {
        schema: workoutLogSchema
      }
    });

    console.log('Collections added successfully');
    console.log('Database initialized successfully with LocalStorage');
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    console.error('Error details:', error);
    dbInstance = null; // Reset on error
    throw error;
  }
};

export const getDatabase = () => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
};

// Types
export interface WorkoutSet {
  reps?: number;
  weight?: number;
  duration?: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  createdAt: string;
  completedAt?: string;
  duration?: number;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutName: string;
  exercises: WorkoutExercise[];
  startedAt: string;
  completedAt?: string;
  duration?: number;
  notes?: string;
}