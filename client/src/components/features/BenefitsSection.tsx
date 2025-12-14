import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BenefitCard } from "./BenefitCard";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

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
      <span className="bg-gradient-to-r from-[#6d74b5] to-[#1c2942] bg-clip-text text-transparent">
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
        "py-20 sm:py-28 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden",
        sectionClassName
      )}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6d74b5]/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#fdf1f7] rounded-full blur-3xl opacity-50" />
      </div>

      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative", className)}>
        <SectionHeader
          badge={badge}
          title={title || defaultTitle}
          description={description || defaultDescription}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BenefitCard
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                variant="gradient"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
