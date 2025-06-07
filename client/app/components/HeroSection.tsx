import heroImage from "../routes/home/hero.jpg";

export function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row lg:min-h-[80vh] lg:items-center">
      {/* Left Side - Text Content */}
      <div className="flex-1 px-6 lg:px-12 py-12 lg:py-24 order-1 lg:order-1">
        <div className="max-w-xl">
          {/* Subheading */}
          <p className="text-[#f0ff65] font-bold text-sm uppercase tracking-wider mb-4">
            Fitness Club
          </p>
          
          {/* Main Heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Sweat, Smile<br />
            <span className="text-[#f0ff65]">And Repeat</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Check out the most effective exercises personalized to you
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/workout"
              className="bg-[#f0ff65] text-black font-semibold px-8 py-4 rounded-lg hover:bg-[#f0ff65]/90 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
            >
              Start Workout
            </a>
            <a
              href="/log"
              className="bg-white/10 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20 text-center"
            >
              View Log
            </a>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="flex-1 relative h-[300px] lg:min-h-[80vh] order-2 lg:order-2">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B2A] to-[#1e3a5f] rounded-lg lg:rounded-l-3xl lg:rounded-r-none overflow-hidden">
          <img
            src={heroImage}
            alt="Fitness woman walking"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}