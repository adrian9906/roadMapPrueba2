import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class RoadmapService {
    private readonly STORAGE_KEY = 'devroadmap_tasks';
    private platformId = inject(PLATFORM_ID);

    private _tasks = signal<Task[]>([]);

    public tasks = this._tasks.asReadonly();

    public toLearnTasks = computed(() => this._tasks().filter(t => t.status === 'TO_LEARN').sort((a, b) => b.updatedAt - a.updatedAt));
    public inProgressTasks = computed(() => this._tasks().filter(t => t.status === 'IN_PROGRESS').sort((a, b) => b.updatedAt - a.updatedAt));
    public masteredTasks = computed(() => this._tasks().filter(t => t.status === 'MASTERED').sort((a, b) => b.updatedAt - a.updatedAt));

    constructor() {
        this.loadInitialData();
        effect(() => {
            const currentTasks = this._tasks();
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentTasks));
            }
        });
    }

    private loadInitialData() {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                try {
                    this._tasks.set(JSON.parse(stored));
                    return;
                } catch (e) {
                    console.error('Failed to parse stored tasks', e);
                }
            }
        }

        this._tasks.set([
            {
                id: this.generateId(),
                title: 'Learn Angular Signals',
                description: 'Understand how to use signals for state management in Angular 18+.',
                status: 'MASTERED',
                tags: ['Angular', 'State Management'],
                createdAt: Date.now() - 100000,
                updatedAt: Date.now() - 100000,
            },
            {
                id: this.generateId(),
                title: 'Master Tailwind CSS v4',
                description: 'Explore the new features and configuration in Tailwind CSS v4.',
                status: 'IN_PROGRESS',
                tags: ['CSS', 'Tailwind'],
                createdAt: Date.now() - 50000,
                updatedAt: Date.now() - 50000,
            },
            {
                id: this.generateId(),
                title: 'Explore RxJS Interoperability',
                description: 'Learn how to mix RxJS observables with Angular Signals effectively.',
                status: 'TO_LEARN',
                tags: ['RxJS', 'Angular'],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            }
        ]);
    }

    public addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
        const newTask: Task = {
            ...task,
            id: this.generateId(),
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        this._tasks.update(tasks => [...tasks, newTask]);
    }

    public updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) {
        this._tasks.update(tasks => tasks.map(task =>
            task.id === id
                ? { ...task, ...updates, updatedAt: Date.now() }
                : task
        ));
    }

    public updateTaskStatus(id: string, status: TaskStatus) {
        this.updateTask(id, { status });
    }

    public deleteTask(id: string) {
        this._tasks.update(tasks => tasks.filter(task => task.id !== id));
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}
