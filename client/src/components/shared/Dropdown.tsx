import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  trigger: React.ReactNode;
  items: React.ReactNode[];
}

export function Dropdown({
  className,
  trigger,
  items,
  ...props
}: React.ComponentProps<"div"> & DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Désactiver le hover sur mobile
    if (isMobile) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Désactiver le hover sur mobile
    if (isMobile) return;
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={cn("dropdown relative", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Trigger avec indicateur de dropdown */}
      <div
        onClick={handleToggle}
        className={cn(
          "cursor-pointer flex items-center justify-between gap-2",
          isMobile && "px-4 py-3 rounded-xl hover:bg-[#ebf2fa] transition-colors"
        )}
      >
        <span>{trigger}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#6d74b5] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {/* Contenu du dropdown */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-out",
          isMobile
            ? isOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0"
            : isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
        )}
      >
        <div
          tabIndex={-1}
          className={cn(
            "bg-white z-50",
            isMobile
              ? "pl-4 py-2 border-l-2 border-[#6d74b5] ml-4 mt-1"
              : "absolute top-full left-0 min-w-[280px] rounded-xl shadow-xl border border-gray-100 p-2 pt-3 -mt-1"
          )}
          onClick={handleItemClick}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                isMobile && "py-2 text-[#1c2942]/80 hover:text-[#6d74b5] transition-colors"
              )}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
