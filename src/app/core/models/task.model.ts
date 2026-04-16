export type TaskStatus = 'TO_LEARN' | 'IN_PROGRESS' | 'MASTERED';
export type TaskCategory = 'Backend' | 'Frontend' | 'DevOps' | 'Mobile' | 'Database' | 'Testing' | 'UI/UX' | 'Other'; // Nuevas categorías

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    category: TaskCategory; // ¡Nuevo campo!
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}