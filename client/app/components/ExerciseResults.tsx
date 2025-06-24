import { useState, useEffect } from "react";
import { getAllExercises, getExerciseImagePath, type Exercise } from "../utils/exercises";

interface ExerciseResultsProps {
  exercises?: Exercise[];
  searchTerm?: string;
  category?: string;
}

export function ExerciseResults({ exercises, searchTerm = "", category = "all" }: ExerciseResultsProps) {
  const [displayedExercises, setDisplayedExercises] = useState<Exercise[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 6;

  useEffect(() => {
    let filteredExercises = exercises || getAllExercises();
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filteredExercises = filteredExercises.filter(exercise =>
        exercise.name.toLowerCase().includes(term) ||
        exercise.primaryMuscles.some(muscle => muscle.toLowerCase().includes(term)) ||
        exercise.secondaryMuscles.some(muscle => muscle.toLowerCase().includes(term)) ||
        exercise.equipment?.toLowerCase().includes(term) ||
        exercise.category.toLowerCase().includes(term)
      );
    }
    
    setDisplayedExercises(filteredExercises);
    setCurrentPage(1); // Reset to first page when filters change
  }, [exercises, searchTerm, category]);

  const totalPages = Math.ceil(displayedExercises.length / exercisesPerPage);
  const currentExercises = displayedExercises.slice(0, currentPage * exercisesPerPage);

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getExerciseTags = (exercise: Exercise) => {
    const tags = [...exercise.primaryMuscles];
    if (exercise.equipment) {
      tags.push(exercise.equipment);
    }
    tags.push(exercise.category);
    return tags.slice(0, 4); // Limit to 4 tags for display
  };
  return (
    <section className="px-6 lg:px-12 py-16">
      {/* Section Title */}
      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
        Showing Results
      </h2>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-[#f0ff65]/50 transition-all duration-300 hover:scale-105"
          >
            {/* Red bar indicator */}
            <div className="h-1 bg-[#f0ff65]"></div>
            
            {/* Exercise Image */}
            <div className="h-48 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <img src={getExerciseImagePath(exercise)} alt={exercise.name} className="w-full h-full object-cover" />
            </div>
            
            {/* Exercise Content */}
            <div className="p-6">
              {/* Tags Container with fixed height */}
              <div className="mb-4 min-h-[2.5rem] flex items-start">
                <div className="flex flex-wrap gap-2">
                  {getExerciseTags(exercise).map((tag, index) => (
                    <span
                      key={tag}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        index === 0
                          ? "bg-[#f0ff65]/20 text-[#f0ff65] border border-[#f0ff65]/30"
                          : index === 1
                          ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                          : index === 2
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Exercise Name */}
              <h3 className="text-white font-semibold text-lg leading-tight">
                {exercise.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {currentPage < totalPages && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="bg-[#f0ff65] text-black font-semibold px-8 py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105"
          >
            Load More Exercises
          </button>
        </div>
      )}
    </section>
  );
}