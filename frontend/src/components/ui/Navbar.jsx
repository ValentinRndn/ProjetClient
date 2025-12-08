import React from "react";

export function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden bg-white">
              <img
                src={logo}
                alt="Logo Vizion Academy"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-sm sm:text-base text-gray-900">
              Vizion
              <br />
              Academy
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <MainNav />
          </nav>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
