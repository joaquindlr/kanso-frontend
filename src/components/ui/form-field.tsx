import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
      {children}
    </div>
  );
}
