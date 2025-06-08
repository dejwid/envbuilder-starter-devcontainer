import { useState } from "react";
import { getAllExercises, getExercisesByUICategory, searchExercises, getExerciseImagePath, type Exercise } from "../utils/exercises";

const exerciseCategories = [
  { id: "all", name: "All", icon: "🏋️" },
  { id: "back", name: "Back", icon: "💪" },
  { id: "cardio", name: "Cardio", icon: "❤️" },
  { id: "chest", name: "Chest", icon: "🫁" },
  { id: "lower-arms", name: "Lower Arms", icon: "💪" },
  { id: "lower-legs", name: "Lower Legs", icon: "🦵" },
  { id: "neck", name: "Neck", icon: "🧠" },
  { id: "shoulders", name: "Shoulders", icon: "💪" },
  { id: "upper-arms", name: "Upper Arms", icon: "💪" },
  { id: "upper-legs", name: "Upper Legs", icon: "🦵" },
  { id: "waist", name: "Waist", icon: "⭕" },
];

export function ExercisesSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const exercisesPerPage = 6;

  // Get filtered exercises
  const getFilteredExercises = (): Exercise[] => {
    if (searchTerm.trim()) {
      return searchExercises(searchTerm);
    }
    return getExercisesByUICategory(activeCategory);
  };

  const filteredExercises = getFilteredExercises();
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);
  const currentExercises = filteredExercises.slice(
    currentPage * exercisesPerPage,
    (currentPage + 1) * exercisesPerPage
  );

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page when searching
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(0); // Reset to first page when changing category
  };

  return (
    <section className="px-6 lg:px-12 py-16 bg-black/10 backdrop-blur-sm">
      {/* Section Title */}
      <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-12">
        Awesome Exercises You Should Know
      </h2>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-12">
        <div className="flex">
          <input
            type="text"
            placeholder="Search Exercises"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-white/60 focus:outline-none focus:border-[#f0ff65]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#f0ff65] text-black px-6 py-3 rounded-r-lg hover:bg-[#f0ff65]/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Exercise Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {exerciseCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
              activeCategory === category.id
                ? "border-[#f0ff65] bg-[#f0ff65]/10"
                : "border-white/20 bg-white/5 hover:border-[#f0ff65]/50"
            }`}
          >
            {/* Active indicator */}
            {activeCategory === category.id && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#f0ff65] rounded-t-lg"></div>
            )}
            
            {/* Icon */}
            <div className="text-3xl mb-2 text-center">
              {category.icon}
            </div>
            
            {/* Category name */}
            <p className="text-white text-sm font-medium text-center">
              {category.name}
            </p>
          </button>
        ))}
      </div>

      {/* Exercises Grid */}
      {currentExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-[#f0ff65]/50 transition-all duration-300 hover:scale-105"
            >
              {/* Exercise Image */}
              <div className="aspect-video bg-white/5 relative overflow-hidden">
                {exercise.images && exercise.images.length > 0 ? (
                  <img
                    src={getExerciseImagePath(exercise, 0)}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      e.currentTarget.style.display = 'none';
                      const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = 'flex';
                      }
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-4xl" style={{ display: exercise.images?.length ? 'none' : 'flex' }}>
                  🏋️
                </div>
                
                {/* Difficulty Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exercise.level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                    exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {exercise.level}
                  </span>
                </div>
              </div>

              {/* Exercise Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {exercise.name}
                </h3>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {exercise.primaryMuscles.slice(0, 2).map((muscle) => (
                    <span
                      key={muscle}
                      className="px-2 py-1 bg-[#f0ff65]/20 text-[#f0ff65] rounded-full text-xs"
                    >
                      {muscle}
                    </span>
                  ))}
                  {exercise.primaryMuscles.length > 2 && (
                    <span className="px-2 py-1 bg-white/10 text-white/60 rounded-full text-xs">
                      +{exercise.primaryMuscles.length - 2}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{exercise.equipment || 'Body only'}</span>
                  <span className="capitalize">{exercise.category}</span>
                </div>

                <div className="mt-3">
                  <a
                    href={`/exercise/${exercise.id}`}
                    className="block w-full text-center bg-[#f0ff65] text-black font-semibold py-2 rounded-lg hover:bg-[#f0ff65]/90 transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white/60 text-lg">No exercises found</p>
          <p className="text-white/40 text-sm">Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm">
            Showing {currentPage * exercisesPerPage + 1}-{Math.min((currentPage + 1) * exercisesPerPage, filteredExercises.length)} of {filteredExercises.length} exercises
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-2 bg-[#f0ff65] text-black rounded-lg hover:bg-[#f0ff65]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-white/60 text-sm px-3">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 bg-[#f0ff65] text-black rounded-lg hover:bg-[#f0ff65]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}