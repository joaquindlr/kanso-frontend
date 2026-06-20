export type IssueType = 'story' | 'bug';
export type IssuePriority = 'high' | 'medium' | 'low';
export type IssueStatus = 'new' | 'in_progress' | 'done' | 'deployed';

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Issue {
  id: string;
  key: string; // e.g., PROJ-101
  title: string;
  type: IssueType;
  priority: IssuePriority;
  assignee?: User;
  subtasksTotal?: number;
  subtasksCompleted?: number;
  status: IssueStatus;
  position: string;
}
