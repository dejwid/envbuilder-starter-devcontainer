import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Header, Footer } from "../components";
import { getExerciseById, getExerciseImagePath, type Exercise } from "../utils/exercises";

export function meta() {
  return [
    { title: "Exercise Details - Fitness Club" },
    { name: "description", content: "View detailed exercise information" },
  ];
}

export default function ExerciseDetails() {
  const params = useParams();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.exerciseId) {
      const foundExercise = getExerciseById(params.exerciseId);
      setExercise(foundExercise || null);
    }
  }, [params.exerciseId]);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
        <Header />
        
        <main className="flex-1">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <div className="mb-8">
                  <span className="text-6xl mb-4 block">❓</span>
                  <p className="text-white/80 text-lg mb-4">Exercise not found</p>
                  <a
                    href="/"
                    className="inline-block bg-[#f0ff65] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-colors"
                  >
                    Back to Exercises
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  const nextImage = () => {
    if (exercise.images && exercise.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % exercise.images.length);
    }
  };

  const prevImage = () => {
    if (exercise.images && exercise.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + exercise.images.length) % exercise.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#36391a] to-transparent text-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <a
                href="/"
                className="inline-flex items-center text-[#f0ff65] hover:text-[#f0ff65]/80 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Exercises
              </a>
            </div>

            {/* Exercise Header */}
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {exercise.name}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  exercise.level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                  exercise.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {exercise.level}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium capitalize">
                  {exercise.category}
                </span>
                {exercise.equipment && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                    {exercise.equipment}
                  </span>
                )}
                {exercise.mechanic && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium capitalize">
                    {exercise.mechanic}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Exercise Images */}
              <div className="space-y-4">
                <div className="aspect-video bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden relative">
                  {exercise.images && exercise.images.length > 0 ? (
                    <>
                      <img
                        src={getExerciseImagePath(exercise, currentImageIndex)}
                        alt={`${exercise.name} - Step ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-6xl" style={{ display: 'none' }}>
                        🏋️
                      </div>
                      
                      {/* Image Navigation */}
                      {exercise.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          
                          {/* Image Indicators */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {exercise.images.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === currentImageIndex ? 'bg-[#f0ff65]' : 'bg-white/30'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🏋️
                    </div>
                  )}
                </div>

                {/* Exercise Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="text-[#f0ff65] font-semibold mb-2">Primary Muscles</h3>
                    <div className="space-y-1">
                      {exercise.primaryMuscles.map((muscle) => (
                        <span key={muscle} className="block text-white/80 capitalize">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {exercise.secondaryMuscles.length > 0 && (
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4">
                      <h3 className="text-[#f0ff65] font-semibold mb-2">Secondary Muscles</h3>
                      <div className="space-y-1">
                        {exercise.secondaryMuscles.map((muscle) => (
                          <span key={muscle} className="block text-white/80 capitalize">
                            {muscle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Exercise Instructions */}
              <div className="space-y-6">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[#f0ff65] mb-4">Instructions</h3>
                  <div className="space-y-4">
                    {exercise.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#f0ff65] text-black rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-white/90 leading-relaxed">
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href="/workout"
                    className="block w-full text-center bg-[#f0ff65] text-black font-semibold py-3 rounded-lg hover:bg-[#f0ff65]/90 transition-colors"
                  >
                    Add to Workout
                  </a>
                  <a
                    href="/"
                    className="block w-full text-center bg-white/10 text-white font-semibold py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                  >
                    Browse More Exercises
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}