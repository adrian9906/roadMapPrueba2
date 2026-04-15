import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideMap, LucideSun } from '@lucide/angular'
import { I18nService } from '../../core/services/i18n.service';
import { ThemeService } from '../../core/services/theme.service';

import { RoadmapService } from '../../core/services/roadmap.service';
import { Task } from '../../core/models/task.model';
import { TaskFormComponent } from "../../componets/task/task.form";
import { KanbanComponent } from '../kanban/kanban.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideMap, LucideSun, KanbanComponent, TaskFormComponent],
  template: `
    <div class="flex h-screen w-full overflow-hidden animate-fade-in animate-delay-300 bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-elegant-bg dark:text-elegant-text font-sans">
      <div  class="w-full flex flex-row">
      <div class="flex flex-1 flex-col h-full overflow-hidden">
        <div class="mb-10 flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight text-indigo-600 dark:text-elegant-accent">
              
        <header class="fixed top-0 w-full z-50 bg-zinc-50 border-b border-zinc-200 text-zinc-900 dark:bg-gray-950 dark:border-gray-600 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full no-border tonal-layering">
            <div class="flex items-end justify-start gap-8">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white dark:bg-elegant-accent">
                  <svg lucideMap class="!h-[20px] !w-[20px] !text-[20px]"></svg>
                </div>
                <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent font-headline uppercase tracking-wider">{{ t('app.title') }}</h1>
              </div>
          <div class="flex items-center gap-5">
            <button 
              (click)="toggleLang()"
              class="rounded-[4px] bg-zinc-100 px-2.5 py-1 font-mono text-[12px] text-zinc-600 hover:bg-zinc-200 dark:bg-elegant-border dark:text-elegant-text-muted dark:hover:bg-elegant-card transition-colors"
            [title]="i18n.currentLang() === 'en' ? t('lang.pt') : t('lang.en')"
              >
              {{ i18n.currentLang() === 'en' ? 'EN | PT' : 'PT | EN' }}
            </button>
            <button 
               (click)="toggleTheme()" 
              class="flex items-center justify-center rounded-lg p-1 text-zinc-600 hover:bg-zinc-100 dark:text-elegant-text-muted dark:hover:bg-elegant-card transition-colors"
              [title]="theme.theme() === 'dark' ? t('theme.light') : t('theme.dark')"
              >
              <svg lucideSun class="!h-[20px] !w-[20px] !text-[20px] text-black dark:text-white">{{ theme.theme() === 'dark' ? 'light_mode' : 'dark_mode' }}</svg>
            </button>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-8 mt-20">
          <div class="mx-auto h-full w-full max-w-7xl flex flex-col">
            <div class="mb-6 flex items-end justify-between">
              <div>
                <h2 class="mb-2 font-sans text-[28px] font-bold tracking-tight text-zinc-900 dark:text-elegant-text">Frontend Mastery</h2>
                <p class="font-sans text-sm text-zinc-500 dark:text-elegant-text-muted">Projected completion: Dec 2024 &bull; 12 modules remaining</p>
              </div>
              
              <button 
              (click)="openAddModal()"
                class="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-elegant-accent dark:hover:bg-blue-600 dark:focus:ring-offset-elegant-bg"
              >
                + {{ t('action.add') }}
              </button>
            </div>
            <app-kanban class="flex-1" (editTask)="openEditModal($event)"></app-kanban>
          </div>
        </main>
      </div>
        <!-- Task Modal -->
      @if (isModalOpen()) {
        <app-task-form 
          [task]="editingTask()" 
          (save)="onSaveTask($event)" 
          (closeForm)="closeModal()"
        />
      }
    </div>
  `
})
export class DashboardComponent {
  i18n = inject(I18nService);
  theme = inject(ThemeService);
  private roadmap = inject(RoadmapService);
  isModalOpen = signal(false);
  editingTask = signal<Task | null>(null);
  t(key: string): string {
    return this.i18n.translate(key);
  }
  toggleTheme() {
    this.theme.toggleTheme();
  }

  toggleLang() {
    this.i18n.toggleLanguage();
  }
  openAddModal() {
    this.editingTask.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(task: Task) {
    this.editingTask.set(task);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingTask.set(null);
  }

  onSaveTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const currentTask = this.editingTask();
    if (currentTask) {
      this.roadmap.updateTask(currentTask.id, taskData);
    } else {
      this.roadmap.addTask(taskData);
    }
    this.closeModal();
  }

}
