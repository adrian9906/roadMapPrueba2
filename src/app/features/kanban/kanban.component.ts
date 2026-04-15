// src/app/modules/kanban/kanban.component.ts
import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/services/i18n.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { RoadmapService } from '../../core/services/roadmap.service';
import { LucideLightbulb, LucideTrendingUp, LucideTrophy } from '@lucide/angular';
import { TaskCardComponent } from '../../componets/task/task.card';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
@Component({
    selector: 'app-kanban',
    standalone: true,
    imports: [CommonModule, LucideLightbulb, LucideTrendingUp, LucideTrophy, TaskCardComponent, LucideTrophy, DragDropModule],
    template: `
    <main class="pt-20 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8" cdkDropListGroup>
        
        <section  [id]="'toLearnList'" class="bg-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6" 
        cdkDropList 
        [cdkDropListData]="roadmap.toLearnTasks()" 
        (cdkDropListDropped)="dropped($event)">
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.TO_LEARN') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full">
              {{ roadmap.toLearnTasks().length }} 
            </span>
          </div>
          
          <div class="flex flex-col gap-3 sm:gap-4">
            @for (task of roadmap.toLearnTasks(); track task.id) { 
              <app-task-card 
              cdkDrag
                [cdkDragData]="task"   
                [task]="task" 
                (edit)="editTask.emit($event)"
                (delete)="onDelete($event)"
                (move)="onMove($event)"
              />
            } @empty {
              <div class="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 p-4 text-center bg-surface-container-highest/30">
                <svg lucideLightbulb class="mb-2 text-on-surface-variant/50 w-8 h-8"></svg>
                <p class="font-sans text-sm text-on-surface-variant/70">{{ t('empty.TO_LEARN') }}</p>
              </div>
            }
          </div>
        </section>
        <section [id]="'inProgressList'" class="bg-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6" 
        cdkDropList 
        [cdkDropListData]="roadmap.inProgressTasks()" 
        (cdkDropListDropped)="dropped($event)">
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.IN_PROGRESS') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">
              {{ roadmap.inProgressTasks().length }} 
            </span>
          </div>
          
          <div class="flex flex-col gap-3 sm:gap-4">
            
          @for (task of roadmap.inProgressTasks(); track task.id) {
              <app-task-card 
                cdkDrag
                [cdkDragData]="task"
                [task]="task" 
                (edit)="editTask.emit($event)"
                (delete)="onDelete($event)"
                (move)="onMove($event)"
              />
            } @empty {
              <div class="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 p-4 text-center bg-surface-container-highest/30">
                <svg lucideTrendingUp class="mb-2 text-on-surface-variant/50 w-8 h-8"></svg>
                <p class="font-sans text-sm text-on-surface-variant/70">{{ t('empty.IN_PROGRESS') }}</p>
              </div>
            }
          </div>
        </section>
        <section [id]="'masteredList'" class="bg-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6" 
        cdkDropList 
        [cdkDropListData]="roadmap.masteredTasks()" 
        (cdkDropListDropped)="dropped($event)">
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-green-400"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.MASTERED') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full">
              {{ roadmap.masteredTasks().length }}
            </span>
          </div>
          
          <div class="flex flex-col gap-3 sm:gap-4">
            @for (task of roadmap.masteredTasks(); track task.id) {
              <app-task-card 
                cdkDrag
                [cdkDragData]="task"
                [task]="task" 
                (edit)="editTask.emit($event)"
                (delete)="onDelete($event)"
                (move)="onMove($event)"
              />
            } @empty {
              <div class="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 p-4 text-center bg-surface-container-highest/30">
                <svg lucideTrophy class="mb-2 text-on-surface-variant/50 w-8 h-8"></svg>
                <p class="font-sans text-sm text-on-surface-variant/70">{{ t('empty.MASTERED') }}</p>
              </div>
            }
          </div>
        </section>

      </div>
    </main>
  `,
    styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #d4d4d8;
      border-radius: 20px;
    }
    :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #2d2d35;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #d4d4d8;
      border-radius: 20px;
    }
    :host-context(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #2d2d35;
    }
  `]
})
export class KanbanComponent {
    roadmap = inject(RoadmapService);
    private i18n = inject(I18nService);

    editTask = output<Task>();

    t(key: string): string {
        return this.i18n.translate(key);
    }

    onDelete(id: string) {
        this.roadmap.deleteTask(id);
    }

    onMove(event: { id: string, status: TaskStatus }) {
        this.roadmap.updateTaskStatus(event.id, event.status);
    }
    dropped(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }
}