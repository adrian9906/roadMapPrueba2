import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core'; // Importar PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Importar isPlatformBrowser
import { Task, TaskStatus, TaskCategory } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class RoadmapService {
    private tasks = signal<Task[]>([]);
    private platformId = inject(PLATFORM_ID);


    toLearnTasks = computed(() => this.tasks().filter(task => task.status === 'TO_LEARN'));
    inProgressTasks = computed(() => this.tasks().filter(task => task.status === 'IN_PROGRESS'));
    masteredTasks = computed(() => this.tasks().filter(task => task.status === 'MASTERED'));

    constructor() {
        this.loadTasks();
    }

    private loadTasks() {
        if (isPlatformBrowser(this.platformId)) {
            const storedTasks = localStorage.getItem('roadmapTasks');
            if (storedTasks) {
                this.tasks.set(JSON.parse(storedTasks));
            } else {

                this.tasks.set([
                    { id: uuidv4(), title: 'Learn Angular Signals', description: 'Understand how signals work in Angular 16+ for reactive programming.', status: 'IN_PROGRESS', category: 'Frontend', tags: ['Angular', 'Signals', 'RxJS'], createdAt: new Date(), updatedAt: new Date() },
                    { id: uuidv4(), title: 'Build a REST API with Node.js', description: 'Develop a simple RESTful API using Express and MongoDB.', status: 'TO_LEARN', category: 'Backend', tags: ['Node.js', 'Express', 'MongoDB'], createdAt: new Date(), updatedAt: new Date() },
                    { id: uuidv4(), title: 'Setup CI/CD Pipeline', description: 'Implement a CI/CD pipeline for automated testing and deployment.', status: 'MASTERED', category: 'DevOps', tags: ['GitLab CI', 'Docker'], createdAt: new Date(), updatedAt: new Date() },
                    { id: uuidv4(), title: 'Design Database Schema', description: 'Create an optimized schema for a new e-commerce application.', status: 'TO_LEARN', category: 'Database', tags: ['SQL', 'PostgreSQL'], createdAt: new Date(), updatedAt: new Date() },
                    { id: uuidv4(), title: 'Implement Responsive Design', description: 'Ensure the application is fully responsive on all devices.', status: 'IN_PROGRESS', category: 'Frontend', tags: ['CSS', 'TailwindCSS', 'Responsive'], createdAt: new Date(), updatedAt: new Date() },
                    { id: uuidv4(), title: 'Deploy to AWS S3', description: 'Host the static frontend application on AWS S3.', status: 'TO_LEARN', category: 'DevOps', tags: ['AWS', 'S3'], createdAt: new Date(), updatedAt: new Date() },
                    { id: uuidv4(), title: 'Unit Testing with Jest', description: 'Write unit tests for backend services using Jest.', status: 'IN_PROGRESS', category: 'Testing', tags: ['Node.js', 'Jest', 'TDD'], createdAt: new Date(), updatedAt: new Date() },
                ]);
            }
        } else {
            this.tasks.set([
                { id: uuidv4(), title: 'Learn Angular Signals (SSR)', description: 'Understand how signals work in Angular 16+ for reactive programming.', status: 'IN_PROGRESS', category: 'Frontend', tags: ['Angular', 'Signals', 'RxJS'], createdAt: new Date(), updatedAt: new Date() },
                { id: uuidv4(), title: 'Build a REST API with Node.js (SSR)', description: 'Develop a simple RESTful API using Express and MongoDB.', status: 'TO_LEARN', category: 'Backend', tags: ['Node.js', 'Express', 'MongoDB'], createdAt: new Date(), updatedAt: new Date() },
            ]);
        }
    }

    private saveTasks() {
        // Solo guardar en localStorage si estamos en el navegador
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('roadmapTasks', JSON.stringify(this.tasks()));
        }
    }

    addTask(newTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
        const newTask: Task = {
            ...newTaskData,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.tasks.update(tasks => [...tasks, newTask]);
        this.saveTasks();
    }

    updateTask(id: string, updatedTaskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
        this.tasks.update(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, ...updatedTaskData, updatedAt: new Date() } : task
            )
        );
        this.saveTasks();
    }

    deleteTask(id: string) {
        this.tasks.update(tasks => tasks.filter(task => task.id !== id));
        this.saveTasks();
    }

    updateTaskStatus(id: string, newStatus: TaskStatus) {
        this.tasks.update(tasks =>
            tasks.map(task =>
                task.id === id ? { ...task, status: newStatus, updatedAt: new Date() } : task
            )
        );
        this.saveTasks();
    }
}