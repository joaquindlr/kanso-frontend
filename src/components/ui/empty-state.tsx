import React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center border rounded-xl border-dashed">
      <Icon className="size-10 text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-4">
        {description}
      </p>
      {children}
    </div>
  );
}
