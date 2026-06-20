import React from 'react';
import { BoardColumn } from '@/components/features/board/BoardColumn';
import type { Issue, IssueStatus } from '@/types/board';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { IssueCard } from '@/components/features/board/IssueCard';

const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    key: 'PROJ-101',
    title: 'Implement Authentication Flow',
    type: 'story',
    priority: 'high',
    status: 'new',
    position: '00001',
    assignee: { id: 'u1', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  },
  {
    id: '2',
    key: 'PROJ-104',
    title: 'Navigation bar collapses incorrectly on mobile',
    type: 'bug',
    priority: 'medium',
    status: 'new',
    position: '00002',
    assignee: { id: 'u2', name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  },
  {
    id: '3',
    key: 'PROJ-105',
    title: 'Update project dependencies',
    type: 'story',
    priority: 'low',
    status: 'new',
    position: '00003',
  },
  {
    id: '4',
    key: 'PROJ-098',
    title: 'Design System Integration',
    type: 'story',
    priority: 'high',
    status: 'in_progress',
    position: '00001',
    subtasksTotal: 4,
    subtasksCompleted: 2,
    assignee: { id: 'u3', name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=3' },
  },
  {
    id: '5',
    key: 'PROJ-099',
    title: 'Refactor Dashboard layout',
    type: 'story',
    priority: 'medium',
    status: 'in_progress',
    position: '00002',
    subtasksTotal: 6,
    subtasksCompleted: 1,
    assignee: { id: 'u1', name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  },
  {
    id: '6',
    key: 'PROJ-001',
    title: 'Initial Repository Setup',
    type: 'story',
    priority: 'high',
    status: 'done',
    position: '00001',
  },
  {
    id: '7',
    key: 'PROJ-002',
    title: 'Configure ESLint and Prettier',
    type: 'story',
    priority: 'medium',
    status: 'done',
    position: '00002',
  },
  {
    id: '8',
    key: 'PROJ-003',
    title: 'Set up CI/CD pipeline',
    type: 'story',
    priority: 'high',
    status: 'done',
    position: '00003',
  },
  {
    id: '9',
    key: 'PROJ-004',
    title: 'Create README documentation',
    type: 'story',
    priority: 'low',
    status: 'done',
    position: '00004',
  },
  {
    id: '10',
    key: 'PROJ-005',
    title: 'Define database schema',
    type: 'story',
    priority: 'high',
    status: 'done',
    position: '00005',
  },
];

export const Dashboard = () => {
  const [issues, setIssues] = React.useState<Issue[]>(MOCK_ISSUES);
  const [activeIssue, setActiveIssue] = React.useState<Issue | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const newIssues = React.useMemo(() => issues.filter((i) => i.status === 'new'), [issues]);
  const inProgressIssues = React.useMemo(() => issues.filter((i) => i.status === 'in_progress'), [issues]);
  const doneIssues = React.useMemo(() => issues.filter((i) => i.status === 'done'), [issues]);
  const deployedIssues = React.useMemo(() => issues.filter((i) => i.status === 'deployed'), [issues]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const issue = issues.find((i) => i.id === active.id);
    if (issue) setActiveIssue(issue);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveIssue = active.data.current?.type === 'Issue';
    const isOverIssue = over.data.current?.type === 'Issue';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveIssue) return;

    if (isActiveIssue && isOverIssue) {
      setIssues((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);

        if (activeIndex === overIndex && prev[activeIndex].status === prev[overIndex].status) {
          return prev;
        }

        if (prev[activeIndex].status !== prev[overIndex].status) {
          const newIssues = [...prev];
          newIssues[activeIndex] = { ...newIssues[activeIndex], status: prev[overIndex].status };
          return arrayMove(newIssues, activeIndex, overIndex);
        }

        return arrayMove(prev, activeIndex, overIndex);
      });
    }

    if (isActiveIssue && isOverColumn) {
      setIssues((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        if (prev[activeIndex].status !== overId) {
          const newIssues = [...prev];
          newIssues[activeIndex] = { ...newIssues[activeIndex], status: overId as IssueStatus };
          return newIssues;
        }
        return prev;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setIssues((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      const overIndex = prev.findIndex((t) => t.id === overId);
      
      let newIssues = prev;
      if (overIndex !== -1) {
         newIssues = arrayMove(newIssues, activeIndex, overIndex);
      }

      const statusMap = new Map<string, number>();
      return newIssues.map(issue => {
        const currentCount = statusMap.get(issue.status) || 0;
        statusMap.set(issue.status, currentCount + 1);
        return { ...issue, position: String(currentCount + 1).padStart(5, '0') };
      });
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex gap-2 overflow-x-auto pb-4 h-full">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <BoardColumn id="new" title="Nuevo" issues={newIssues} />
          <BoardColumn id="in_progress" title="En progreso" issues={inProgressIssues} dotColor="bg-primary" />
          <BoardColumn id="done" title="Hecho" issues={doneIssues} />
          <BoardColumn id="deployed" title="Desplegado" issues={deployedIssues} dotColor="bg-foreground" />
          
          <DragOverlay>
            {activeIssue ? <IssueCard issue={activeIssue} isOverlay={true} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
