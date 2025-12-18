import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
    <>
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
                  className="px-3 py-2 text-sm font-medium text-[#1c2942]/70 hover:text-[#6d74b5] transition-colors rounded-lg hover:bg-[#ebf2fa]"
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
              className="lg:hidden p-2 rounded-xl text-[#1c2942] hover:bg-[#ebf2fa] transition-colors"
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
      </nav>

      {/* Mobile Menu - Rendered via Portal to avoid stacking context issues */}
      {createPortal(
        <>
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-9998"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          <div
            className={cn(
              "lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl z-9999",
              "transform transition-transform duration-300 ease-out",
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div
              className="h-full flex flex-col"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === "A" || target.closest("a")) {
                  setIsMobileMenuOpen(false);
                }
              }}
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#ebf2fa]">
                <span className="text-lg font-semibold text-[#1c2942]">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-[#1c2942] hover:bg-[#ebf2fa] transition-colors"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-1">
                  {navCenter?.map((item, index) => (
                    <div
                      key={`nav-mobile-center-${index}`}
                      className="text-[#1c2942] font-medium"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="px-4 py-4 border-t border-[#ebf2fa] bg-[#f8fafc]">
                <div className="flex flex-col gap-3">
                  {navEnd?.map((item, index) => (
                    <div key={`nav-mobile-end-${index}`} className="*:w-full">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
