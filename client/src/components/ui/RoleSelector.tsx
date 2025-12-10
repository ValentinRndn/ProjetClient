import { cn } from "@/lib/utils";
import React from "react";
import { Building2, UserCheck } from "lucide-react";

export interface RoleOption {
  value: "ECOLE" | "INTERVENANT";
  label: string;
  icon: React.ReactNode;
  description?: string;
}

interface RoleSelectorProps {
  value: "ECOLE" | "INTERVENANT";
  onChange: (role: "ECOLE" | "INTERVENANT") => void;
  disabled?: boolean;
  className?: string;
}

const roleOptions: RoleOption[] = [
  {
    value: "INTERVENANT",
    label: "Intervenant",
    icon: <UserCheck className="w-8 h-8" />,
  },
  {
    value: "ECOLE",
    label: "École",
    icon: <Building2 className="w-8 h-8" />,
  },
];

export function RoleSelector({
  value,
  onChange,
  disabled = false,
  className,
}: RoleSelectorProps) {
  return (
    <div className={cn("w-full", className)}>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Type de compte <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-4">
        {roleOptions.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !disabled && onChange(option.value)}
              disabled={disabled}
              className={cn(
                "relative p-6 rounded-xl border-2 transition-all",
                "flex flex-col items-center justify-center gap-3",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                isSelected
                  ? "bg-indigo-600 border-indigo-700 text-white shadow-lg"
                  : "bg-white border-gray-300 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(isSelected ? "text-white" : "text-indigo-600")}
              >
                {option.icon}
              </div>
              <span className="font-semibold text-base">{option.label}</span>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
