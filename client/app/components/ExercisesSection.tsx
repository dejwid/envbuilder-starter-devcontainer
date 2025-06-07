import { useState } from "react";

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
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-white/60 focus:outline-none focus:border-[#f0ff65]"
          />
          <button className="bg-[#f0ff65] text-black px-6 py-3 rounded-r-lg hover:bg-[#f0ff65]/90 transition-colors">
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
            onClick={() => setActiveCategory(category.id)}
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

      {/* Pagination Arrows */}
      <div className="flex justify-end space-x-2">
        <button className="p-2 bg-[#f0ff65] text-black rounded-lg hover:bg-[#f0ff65]/90 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="p-2 bg-[#f0ff65] text-black rounded-lg hover:bg-[#f0ff65]/90 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}