const exerciseData = [
  {
    id: 1,
    name: "Assisted Standing Triceps Extension (With Towel)",
    tags: ["Upper Arms", "Triceps", "Shoulders", "Core"],
    image: "🏋️‍♀️"
  },
  {
    id: 2,
    name: "Barbell Bicep Curls",
    tags: ["Upper Arms"],
    image: "💪"
  },
  {
    id: 3,
    name: "Push-ups",
    tags: ["Chest", "Upper Arms", "Shoulders"],
    image: "🤸‍♂️"
  },
  {
    id: 4,
    name: "Plank Hold",
    tags: ["Waist", "Core", "Shoulders", "Upper Arms"],
    image: "🧘‍♀️"
  },
  {
    id: 5,
    name: "Squats",
    tags: ["Upper Legs", "Lower Legs"],
    image: "🏃‍♀️"
  },
  {
    id: 6,
    name: "Deadlifts",
    tags: ["Back"],
    image: "🏋️"
  }
];

export function ExerciseResults() {
  return (
    <section className="px-6 lg:px-12 py-16">
      {/* Section Title */}
      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
        Showing Results
      </h2>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exerciseData.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-[#f0ff65]/50 transition-all duration-300 hover:scale-105"
          >
            {/* Red bar indicator */}
            <div className="h-1 bg-[#f0ff65]"></div>
            
            {/* Exercise Image */}
            <div className="h-48 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
              <span className="text-6xl">{exercise.image}</span>
            </div>
            
            {/* Exercise Content */}
            <div className="p-6">
              {/* Tags Container with fixed height */}
              <div className="mb-4 min-h-[2.5rem] flex items-start">
                <div className="flex flex-wrap gap-2">
                  {exercise.tags.map((tag, index) => (
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
      <div className="text-center mt-12">
        <button className="bg-[#f0ff65] text-black font-semibold px-8 py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105">
          Load More Exercises
        </button>
      </div>
    </section>
  );
}