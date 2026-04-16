import { Component, input, output, inject, AfterViewInit, OnDestroy, PLATFORM_ID } from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Task, TaskStatus } from '../../core/models/task.model';
import { I18nService } from '../../core/services/i18n.service';
import { LucideChevronLeft, LucideChevronRight, LucidePencil, LucideTrash } from '@lucide/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, LucidePencil, LucideTrash, LucideChevronLeft, LucideChevronRight, DragDropModule],
  template: `
    <div [attr.data-task-id]="task().id"
  data-task-card
  [class]="'group relative flex flex-col gap-3 rounded-xl hover:-translate-y-1 duration-200 border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-elegant-border dark:bg-elegant-card ' + getStatusBorderClass(task().status)">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <span class="font-mono text-[10px] uppercase text-indigo-600 dark:text-elegant-accent">
            {{ task().tags[0] || 'Task' }}
          </span>
          <h3 class="font-sans text-[15px] font-semibold leading-[1.4] text-zinc-900 dark:text-elegant-text">
            {{ task().title }}
          </h3>
        </div>
        <div class="flex opacity-0 transition-opacity group-hover:opacity-100">
          <button (click)="edit.emit(task())" class="rounded p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-elegant-border dark:hover:text-elegant-text" [title]="t('action.edit')">
            <svg lucidePencil class="!h-[16px] !w-[16px] !text-[16px]"></svg>
          </button>
          <button (click)="delete.emit(task().id)" class="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400" [title]="t('action.delete')">
            <svg lucideTrash class="!h-[16px] !w-[16px] !text-[16px]"></svg>
          </button>
        </div>
      </div>
      
      <p class="font-sans text-sm text-zinc-500 dark:text-elegant-text-muted line-clamp-2">
        {{ task().description }}
      </p>

      <div class="mt-auto pt-1 flex items-center justify-between">
        <div class="text-[11px] text-zinc-500 dark:text-elegant-text-muted">
          Updated &bull; {{ task().updatedAt | date:'MMM d' }}
        </div>
        
        <div class="flex items-center gap-1">
          @if (task().status !== 'TO_LEARN') {
            <button (click)="move.emit({id: task().id, status: getPrevStatus(task().status)})" class="flex items-center rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-elegant-border dark:hover:text-elegant-text">
              <svg lucideChevronLeft class="!h-[16px] !w-[16px] !text-[16px]"></svg>
            </button>
          }
          @if (task().status !== 'MASTERED') {
            <button (click)="move.emit({id: task().id, status: getNextStatus(task().status)})" class="flex items-center rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-elegant-border dark:hover:text-elegant-text">
              <svg lucideChevronRight class="!h-[16px] !w-[16px] !text-[16px]"></svg>
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class TaskCardComponent implements AfterViewInit, OnDestroy {
  task = input.required<Task>();
  edit = output<Task>();
  delete = output<string>();
  move = output<{ id: string, status: TaskStatus }>();
  private observer: IntersectionObserver | null = null;
  private cardsAnimated = new Set<string>();
  private platformId = inject(PLATFORM_ID);
  private i18n = inject(I18nService);
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.setupCardsAnimation();
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupCardsAnimation() {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target as HTMLElement;
        const taskId = card.dataset['taskId'];

        if (entry.isIntersecting && taskId && !this.cardsAnimated.has(taskId)) {
          this.cardsAnimated.add(taskId);
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = '';
          card.classList.add('animate-fade-in-up');
          card.classList.add('animate-delay-500');
        }
      });
    }, options);

    // Observar todas las cards
    setTimeout(() => {
      document.querySelectorAll('[data-task-card]').forEach(card => {
        this.observer?.observe(card);
      });
    }, 100);
  }
  t(key: string): string {
    return this.i18n.translate(key);
  }

  getStatusBorderClass(status: TaskStatus): string {
    switch (status) {
      case 'TO_LEARN': return 'border-l-[3px] border-l-indigo-500 dark:border-l-elegant-accent';
      case 'IN_PROGRESS': return 'border-l-[3px] border-l-amber-500 dark:border-l-elegant-warning';
      case 'MASTERED': return 'border-l-[3px] border-l-emerald-500 dark:border-l-elegant-success';
    }
  }

  getPrevStatus(status: TaskStatus): TaskStatus {
    if (status === 'MASTERED') return 'IN_PROGRESS';
    return 'TO_LEARN';
  }

  getNextStatus(status: TaskStatus): TaskStatus {
    if (status === 'TO_LEARN') return 'IN_PROGRESS';
    return 'MASTERED';
  }
}
