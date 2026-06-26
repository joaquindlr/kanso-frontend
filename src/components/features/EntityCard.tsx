import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface EntityCardProps {
  title: string;
  description?: string;
  totalTasks: number;
  completedTasks: number;
  icon: React.ReactNode;
}

export function EntityCard({
  title,
  description,
  totalTasks,
  completedTasks,
  icon,
}: EntityCardProps) {
  const total = Number(totalTasks) || 0;
  const completed = Number(completedTasks) || 0;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className="flex flex-col border-border/50 bg-card/50 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 p-8 pb-4">
        <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-semibold text-lg leading-none tracking-tight line-clamp-1 flex-1">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-6 p-8 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
          {description || "Sin descripción proporcionada."}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center text-muted-foreground gap-1.5 font-medium">
              <CheckCircle2 className="size-4" />
              {completed}/{total} Tareas
            </span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
