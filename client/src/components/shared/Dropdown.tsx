import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
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
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div
          tabIndex={-1}
          className="dropdown-content absolute top-full left-0 bg-white rounded-xl z-50 min-w-[280px] p-2 shadow-xl border border-gray-100 pt-3 -mt-1"
          onClick={handleItemClick}
        >
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
}
