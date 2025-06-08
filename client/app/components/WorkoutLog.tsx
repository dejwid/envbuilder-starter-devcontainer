import { useState, useEffect } from 'react';
import { useWorkouts } from '../utils/useWorkouts';
import { formatDuration, calculateWorkoutProgress } from '../utils/workoutService';
import { type WorkoutLog as WorkoutLogType } from '../utils/database';

export function WorkoutLog() {
  const { workoutLogs, loading, error, isInitialized, loadWorkoutLogs, removeWorkoutLog } = useWorkouts();
  const [selectedLog, setSelectedLog] = useState<WorkoutLogType | null>(null);

  useEffect(() => {
    if (isInitialized) {
      loadWorkoutLogs();
    }
  }, [isInitialized]);

  const handleDeleteLog = async (logId: string) => {
    if (confirm('Are you sure you want to delete this workout log?')) {
      try {
        await removeWorkoutLog(logId);
      } catch (error) {
        console.error('Failed to delete workout log:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Loading workout logs...</div>
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
        <h2 className="text-2xl lg:text-3xl font-bold text-white">Workout Log</h2>
        <div className="text-gray-400">
          {workoutLogs.length} workout{workoutLogs.length !== 1 ? 's' : ''} completed
        </div>
      </div>

      {workoutLogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-white mb-2">No workouts logged yet</h3>
          <p className="text-gray-400">Complete your first workout to see it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-[#f0ff65]/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedLog(log)}
            >
              {/* Status bar */}
              <div className={`h-1 ${log.completedAt ? 'bg-green-500' : 'bg-[#f0ff65]'}`}></div>
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg">{log.workoutName}</h3>
                    <p className="text-gray-400 text-sm">
                      {formatDate(log.startedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.completedAt && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                        Completed
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLog(log.id);
                      }}
                      className="text-gray-400 hover:text-red-400 transition-colors"
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
                      {log.exercises.length}
                    </div>
                    <div className="text-gray-400 text-sm">Exercises</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#f0ff65]">
                      {log.duration ? formatDuration(log.duration) : 'In Progress'}
                    </div>
                    <div className="text-gray-400 text-sm">Duration</div>
                  </div>
                </div>

                {/* Progress */}
                {!log.completedAt && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">Progress</span>
                      <span className="text-[#f0ff65] text-sm">{calculateWorkoutProgress(log)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#f0ff65] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateWorkoutProgress(log)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Exercise preview */}
                <div className="space-y-2">
                  {log.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{exercise.exerciseName}</span>
                      <span className="text-gray-400">
                        {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                  {log.exercises.length > 3 && (
                    <div className="text-gray-400 text-sm">
                      +{log.exercises.length - 3} more exercise{log.exercises.length - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Notes preview */}
                {log.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm line-clamp-2">{log.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Log Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedLog.workoutName}</h2>
                  <p className="text-gray-400">{formatDate(selectedLog.startedAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
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
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f0ff65]">{selectedLog.exercises.length}</div>
                  <div className="text-gray-400 text-sm">Exercises</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f0ff65]">
                    {selectedLog.duration ? formatDuration(selectedLog.duration) : 'In Progress'}
                  </div>
                  <div className="text-gray-400 text-sm">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#f0ff65]">
                    {selectedLog.exercises.reduce((total, ex) => total + ex.sets.length, 0)}
                  </div>
                  <div className="text-gray-400 text-sm">Total Sets</div>
                </div>
              </div>

              {/* Exercises */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Exercises</h3>
                {selectedLog.exercises.map((exercise, index) => (
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
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            set.completed 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-gray-600/20 text-gray-400'
                          }`}>
                            {set.completed ? 'Completed' : 'Skipped'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {selectedLog.notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-gray-300">{selectedLog.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}