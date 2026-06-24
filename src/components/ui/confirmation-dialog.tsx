import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm: () => void;
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  stopPropagation?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  onCancel,
  onConfirm,
  confirmVariant = "destructive",
  stopPropagation = false,
}: ConfirmationDialogProps) {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (stopPropagation) e.stopPropagation();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  const handleConfirmClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClick={handleClick} onPointerDown={handlePointerDown}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancelClick}>
            {cancelText}
          </Button>
          <Button 
            variant={confirmVariant} 
            className={
              confirmVariant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-destructive dark:text-destructive-foreground dark:hover:bg-destructive/90"
                : undefined
            }
            onClick={handleConfirmClick}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
