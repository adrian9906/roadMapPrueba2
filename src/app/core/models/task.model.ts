export type TaskStatus = 'TO_LEARN' | 'IN_PROGRESS' | 'MASTERED';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    tags: string[];
    createdAt: number;
    updatedAt: number;
}
