import { useState } from "react";

export function Header() {
  const [activeLink, setActiveLink] = useState("Home");

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#f0ff65] rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-lg">💪</span>
        </div>
        <span className="text-white font-bold text-xl">Fitness Club</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {[
          { name: "Home", href: "/" },
          { name: "Exercises", href: "/" },
          { name: "Workout", href: "/workout" },
          { name: "Log", href: "/log" }
        ].map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setActiveLink(link.name)}
            className={`relative text-white font-medium transition-colors hover:text-[#f0ff65] ${
              activeLink === link.name ? "text-[#f0ff65]" : ""
            }`}
          >
            {link.name}
            {activeLink === link.name && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#f0ff65]"></div>
            )}
          </a>
        ))}
      </nav>

      {/* Mobile menu button */}
      <button className="md:hidden text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
}