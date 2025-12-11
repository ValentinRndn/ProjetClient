import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  navStart?: React.ReactNode[];
  navCenter?: React.ReactNode[];
  navEnd?: React.ReactNode[];
}

export function Navbar({ navStart, navCenter, navEnd }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300 ease-out",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50 py-2"
          : "bg-white py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Start */}
          <div className="flex items-center gap-3 shrink-0">
            {navStart?.map((item, index) => (
              <React.Fragment key={`nav-start-${index}`}>{item}</React.Fragment>
            ))}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navCenter?.map((item, index) => (
              <div
                key={`nav-center-${index}`}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
              >
                {item}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {navEnd?.map((item, index) => (
              <React.Fragment key={`nav-end-${index}`}>{item}</React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 ease-out",
          isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 py-4 space-y-2 bg-white border-t border-gray-100">
          {/* Mobile Navigation */}
          <div className="space-y-1">
            {navCenter?.map((item, index) => (
              <div
                key={`nav-mobile-center-${index}`}
                className="px-4 py-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </div>
            ))}
          </div>
          {/* Mobile Actions */}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {navEnd?.map((item, index) => (
              <div key={`nav-mobile-end-${index}`} onClick={() => setIsMobileMenuOpen(false)}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
