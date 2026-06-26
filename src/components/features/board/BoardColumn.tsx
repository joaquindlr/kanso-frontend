import React, { useState, useRef, useEffect } from 'react';
import { IssueCard } from './IssueCard';
import type { Issue } from '@/types/board';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

interface BoardColumnProps {
  id: string;
  title: string;
  issues: Issue[];
  dotColor?: string;
  onCreateIssue?: (title: string, description?: string) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({ id, title, issues, dotColor, onCreateIssue }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { type: 'Column', id },
  });

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    if (id !== 'NEW') return;

    const handleOpenCreateIssue = () => {
      setIsCreating(true);
    };

    window.addEventListener('openCreateIssue', handleOpenCreateIssue);
    return () => window.removeEventListener('openCreateIssue', handleOpenCreateIssue);
  }, [id]);

  const handleCreate = () => {
    if (newTitle.trim()) {
      onCreateIssue?.(newTitle.trim(), newDescription.trim() || undefined);
    }
    setNewTitle('');
    setNewDescription('');
    setIsCreating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewTitle('');
      setNewDescription('');
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-[250px] bg-muted/50 rounded-xl p-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          {dotColor && <div className={`w-2 h-2 rounded-full ${dotColor}`} />}
          <h3 className="text-foreground font-semibold text-sm">{title}</h3>
          {onCreateIssue && (
            <button
              onClick={() => setIsCreating(true)}
              className="p-1 rounded-md hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground transition-colors ml-1"
              title="Create new issue"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {issues.length}
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className={`flex flex-col gap-3 min-h-[150px] rounded-lg transition-colors ${isOver ? 'bg-accent/50' : ''}`}
      >
        {isCreating && (
          <div className="bg-card border border-border rounded-lg p-3 shadow-sm flex flex-col gap-2">
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Título..."
              className="text-sm font-medium bg-transparent border-none outline-none placeholder:text-muted-foreground/50 w-full"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              type="text"
              placeholder="Descripción (opcional)..."
              className="text-xs text-muted-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/50 w-full"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </SortableContext>

        {issues.length === 0 && !isCreating && (
          <div className="border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center text-muted-foreground/50 text-sm font-medium hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-pointer mt-1">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};
