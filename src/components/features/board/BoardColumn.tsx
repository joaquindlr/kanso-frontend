import React from 'react';
import { IssueCard } from './IssueCard';
import type { Issue } from '@/types/board';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface BoardColumnProps {
  id: string;
  title: string;
  issues: Issue[];
  dotColor?: string; // e.g., 'bg-indigo-500'
}

export const BoardColumn: React.FC<BoardColumnProps> = ({ id, title, issues, dotColor }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: { type: 'Column', id },
  });

  return (
    <div className="flex flex-col flex-1 min-w-[300px] max-w-[350px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          {dotColor && <div className={`w-2 h-2 rounded-full ${dotColor}`} />}
          <h3 className="text-slate-200 font-semibold text-sm">{title}</h3>
        </div>
        <div className="bg-[#2A2B36] text-slate-400 text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] text-center">
          {issues.length}
        </div>
      </div>

      {/* Cards Container */}
      <div 
        ref={setNodeRef} 
        className={`flex flex-col gap-3 min-h-[150px] rounded-lg transition-colors ${isOver ? 'bg-[#1C1D24]/50' : ''}`}
      >
        <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </SortableContext>

        {/* Drop Zone Placeholder */}
        {issues.length === 0 && (
          <div className="border-2 border-dashed border-[#2A2B36] rounded-lg p-6 flex items-center justify-center text-indigo-400/50 text-sm font-medium hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-colors cursor-pointer mt-1">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
};
