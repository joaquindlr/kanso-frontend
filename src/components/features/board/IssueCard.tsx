import React from 'react';
import { Bookmark, Bug, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import type { Issue } from '@/types/board';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSearchParams } from 'react-router-dom';

interface IssueCardProps {
  issue: Issue;
  isOverlay?: boolean;
}

export const IssueCardContent: React.FC<IssueCardProps & { isDragging?: boolean }> = ({ issue, isDragging }) => {
  const isDone = issue.status === 'DONE' || issue.status === 'DEPLOYED';

  return (
    <div
      className={`bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group cursor-grab relative ${isDragging ? 'shadow-2xl ring-2 ring-primary/50 cursor-grabbing z-50' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {issue.type === 'STORY' ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium border border-border">
              <Bookmark className="w-3.5 h-3.5" />
              User Story
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-medium border border-border">
              <Bug className="w-3.5 h-3.5" />
              Bug
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {issue.severity === 'CRITICAL' && (
            <div className="px-2 py-1 rounded bg-destructive text-destructive-foreground text-xs font-medium border border-border">
              Critical
            </div>
          )}
          {issue.severity === 'HIGH' && (
            <div className="px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-medium border border-border">
              High
            </div>
          )}
          {issue.severity === 'MEDIUM' && (
            <div className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-medium border border-border">
              Medium
            </div>
          )}
          {issue.severity === 'LOW' && (
            <div className="px-2 py-1 rounded bg-accent text-accent-foreground text-xs font-medium border border-border">
              Low
            </div>
          )}
          {isDone && <CheckCircle2 className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      <h4 className={`text-sm font-medium mb-1 ${isDone ? 'text-muted-foreground' : 'text-foreground'}`}>
        {issue.title}
      </h4>
      <p className="text-muted-foreground text-xs font-medium">{issue.key}</p>



      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          {issue.epic ? (
            <span 
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-border"
              style={issue.epic.color ? { 
                backgroundColor: `${issue.epic.color}20`, 
                color: issue.epic.color, 
                borderColor: `${issue.epic.color}50` 
              } : {}}
            >
              {issue.epic.title}
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              Sin epica
            </span>
          )}
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue, isOverlay }) => {
  if (isOverlay) {
    return <IssueCardContent issue={issue} isDragging={true} />;
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id, data: { type: 'Issue', issue } });

  const [, setSearchParams] = useSearchParams();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    if (!isDragging) {
      setSearchParams({ issue: issue.id });
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={handleClick}>
      <IssueCardContent issue={issue} isDragging={isDragging} />
    </div>
  );
};
