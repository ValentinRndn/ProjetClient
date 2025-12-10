import { Card, CardHeader, CardContent, CardFooter } from "./Card";
import React from "react";

export interface FormCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function FormCard({
  title,
  subtitle,
  icon,
  children,
  footer,
  className,
}: FormCardProps) {
  return (
    <Card variant="elevated" className={className}>
      <CardHeader>
        <div className="text-center">
          {icon && <div className="mb-4 flex justify-center">{icon}</div>}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
