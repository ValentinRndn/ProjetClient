import { CTAButton } from "./CTAButton";
import React from "react";

export interface HeroCTAProps {
  primaryAction: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function HeroCTA({
  primaryAction,
  secondaryAction,
  className,
}: HeroCTAProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 ${
        className || ""
      }`}
    >
      <CTAButton
        onClick={primaryAction.onClick}
        href={primaryAction.href}
        variant="primary"
      >
        {primaryAction.label}
      </CTAButton>
      {secondaryAction && (
        <CTAButton
          onClick={secondaryAction.onClick}
          href={secondaryAction.href}
          variant="secondary"
        >
          {secondaryAction.label}
        </CTAButton>
      )}
    </div>
  );
}
