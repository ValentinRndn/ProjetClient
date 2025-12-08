import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BenefitCard } from "./BenefitCard";
import { cn } from "@/lib/utils";

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface BenefitsSectionProps {
  benefits: Benefit[];
  badge?: string;
  title?: React.ReactNode;
  description?: string;
  className?: string;
  sectionClassName?: string;
}

export function BenefitsSection({
  benefits,
  badge = "Nos avantages",
  title,
  description,
  className,
  sectionClassName,
}: BenefitsSectionProps) {
  const defaultTitle = (
    <>
      Pourquoi choisir{" "}
      <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
        Vizion Academy
      </span>{" "}
      ?
    </>
  );

  const defaultDescription =
    "Une plateforme pensée pour faciliter la collaboration entre écoles et experts";

  return (
    <section
      className={cn(
        "py-24 bg-gradient-to-b from-gray-50 to-white",
        sectionClassName
      )}
    >
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
        <SectionHeader
          badge={badge}
          title={title || defaultTitle}
          description={description || defaultDescription}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
