import { CTAButton } from "./CTAButton";
import { cn } from "@/lib/utils";
import React from "react";

export interface HeroCTAProps {
  primaryAction: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  className?: string;
  align?: "center" | "left" | "right";
}

export function HeroCTA({
  primaryAction,
  secondaryAction,
  className,
  align = "center",
}: HeroCTAProps) {
  const alignments = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end",
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 px-4",
        alignments[align],
        className
      )}
    >
      <CTAButton
        onClick={primaryAction.onClick}
        href={primaryAction.href}
        variant="primary"
        size="lg"
        icon={primaryAction.icon}
      >
        {primaryAction.label}
      </CTAButton>
      {secondaryAction && (
        <CTAButton
          onClick={secondaryAction.onClick}
          href={secondaryAction.href}
          variant="secondary"
          size="lg"
          icon={secondaryAction.icon}
        >
          {secondaryAction.label}
        </CTAButton>
      )}
    </div>
  );
}
