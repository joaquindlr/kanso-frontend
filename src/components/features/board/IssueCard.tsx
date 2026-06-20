import React from 'react';
import { Bookmark, Bug, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import type { Issue } from '@/types/board';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface IssueCardProps {
  issue: Issue;
  isOverlay?: boolean;
}

export const IssueCardContent: React.FC<IssueCardProps & { isDragging?: boolean }> = ({ issue, isDragging }) => {
  const isDone = issue.status === 'done' || issue.status === 'deployed';

  return (
    <div
      className={`bg-[#1C1D24] border border-[#2A2B36] rounded-lg p-4 hover:border-[#3A3B46] transition-colors group cursor-grab relative ${isDragging ? 'shadow-2xl ring-2 ring-indigo-500/50 cursor-grabbing z-50' : ''}`}
    >
      {/* Header Badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {issue.type === 'story' ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
              <Bookmark className="w-3.5 h-3.5" />
              User Story
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
              <Bug className="w-3.5 h-3.5" />
              Bug
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {issue.priority === 'high' && (
            <div className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-xs font-medium border border-orange-500/20">
              High
            </div>
          )}
          {issue.priority === 'medium' && (
            <div className="px-2 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
              Medium
            </div>
          )}
          {issue.priority === 'low' && (
            <div className="px-2 py-1 rounded bg-slate-500/10 text-slate-400 text-xs font-medium border border-slate-500/20">
              Low
            </div>
          )}
          {isDone && <CheckCircle2 className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {/* Title & Key */}
      <h4 className={`text-sm font-medium mb-1 ${isDone ? 'text-slate-400' : 'text-slate-200'}`}>
        {issue.title}
      </h4>
      <p className="text-slate-500 text-xs font-medium">{issue.key}</p>

      {/* Subtasks */}
      {issue.subtasksTotal !== undefined && issue.subtasksTotal > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Subtasks</span>
            <span>
              {issue.subtasksCompleted || 0}/{issue.subtasksTotal}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{
                width: `${((issue.subtasksCompleted || 0) / issue.subtasksTotal) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        {issue.assignee ? (
          <div className="w-6 h-6 rounded-full border border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center">
            {issue.assignee.avatarUrl ? (
              <img src={issue.assignee.avatarUrl} alt={issue.assignee.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-slate-300 font-medium">
                {issue.assignee.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border border-dashed border-slate-700 flex items-center justify-center">
             <span className="text-slate-600 text-[10px]">+1</span>
          </div>
        )}

        <button className="text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IssueCardContent issue={issue} isDragging={isDragging} />
    </div>
  );
};
