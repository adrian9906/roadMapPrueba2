import { Component, inject, output, signal, computed } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common'; // Importar KeyValuePipe
import { I18nService } from '../../core/services/i18n.service';
import { Task, TaskStatus, TaskCategory } from '../../core/models/task.model'; // Importar TaskCategory
import { RoadmapService } from '../../core/services/roadmap.service';
import { LucideLightbulb, LucideTrendingUp, LucideTrophy, LucideServer, LucidePalette, LucideSettings, LucideSmartphone, LucideDatabase, LucideBug, LucideLayout } from '@lucide/angular'; // Importar iconos de Lucide
import { TaskCardComponent } from '../../componets/task/task.card';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TaskCardComponent,
    KeyValuePipe,
    LucideLightbulb,
    LucideTrendingUp,
    LucideTrophy,
    LucideServer,
    LucidePalette,
    LucideSettings,
    LucideSmartphone,
    LucideDatabase,
    LucideBug,
    LucideLayout
  ],
  template: `
    <main class="pt-20 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-end justify-end mx-auto">
       <select
          class="p-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-elegant-accent dark:hover:bg-blue-600 dark:focus:ring-offset-elegant-bg text-white"
          [(ngModel)]="filterStatus"
          (change)="applyFilters()"
        >
          <option value="">{{ t('filter.all_statuses') }}</option>
          <option value="TO_LEARN">{{ t('status.TO_LEARN') }}</option>
          <option value="IN_PROGRESS">{{ t('status.IN_PROGRESS') }}</option>
          <option value="MASTERED">{{ t('status.MASTERED') }}</option>
        </select>
        <select
          class="p-2 border rounded-lg shadow-sm focus:ring-primary focus:border-primary bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-elegant-accent dark:hover:bg-blue-600 dark:focus:ring-offset-elegant-bg text-white"
          [(ngModel)]="filterCategory"
          (change)="applyFilters()"
        >
          <option value="">{{ t('filter.all_categories') }}</option>
          @for (category of allCategories; track category) {
            <option [value]="category">{{ t('category.' + category.toUpperCase()) }}</option>
          }
        </select>
      </div>

      <div class="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8" cdkDropListGroup>

        <!-- Columna TO_LEARN -->
        <section [id]="'toLearnList'" class="bg-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6"
          cdkDropList
          [cdkDropListData]="flattenedToLearnTasks()"
          (cdkDropListDropped)="dropped($event)">

          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.TO_LEARN') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full">
              {{ flattenedToLearnTasks().length }}
            </span>
          </div>

         
          @for (categoryGroup of groupedToLearnTasks() | keyvalue; track categoryGroup.key) {
            <div class="flex flex-col gap-3 sm:gap-4 mt-4 border-t border-dashed border-outline-variant/20 pt-4">
              <div class="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
                @switch (categoryGroup.key) {
                  @case ('Backend') { <svg lucideServer class="w-4 h-4"></svg> }
                  @case ('Frontend') { <svg lucidePalette class="w-4 h-4"></svg> }
                  @case ('DevOps') { <svg lucideSettings class="w-4 h-4"></svg> }
                  @case ('Mobile') { <svg lucideSmartphone class="w-4 h-4"></svg> }
                  @case ('Database') { <svg lucideDatabase class="w-4 h-4"></svg> }
                  @case ('Testing') { <svg lucideBug class="w-4 h-4"></svg> }
                  @case ('UI/UX') { <svg lucideLayout class="w-4 h-4"></svg> }
                  @default { <svg lucideLightbulb class="w-4 h-4"></svg> }
                }
                <span class="uppercase">{{ t('category.' + categoryGroup.key.toUpperCase()) }}</span>
                <span class="ml-auto bg-surface-container-highest text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                  {{ categoryGroup.value.length }}
                </span>
              </div>
              @for (task of categoryGroup.value; track task.id) {
                <app-task-card
                  cdkDrag
                  [cdkDragData]="task"
                  [task]="task"
                  (edit)="editTask.emit($event)"
                  (delete)="onDelete($event)"
                  (move)="onMove($event)"
                />
              }
            </div>
          }
          @if (flattenedToLearnTasks().length === 0) {
            <div class="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 p-4 text-center bg-surface-container-highest/30">
              <svg lucideLightbulb class="mb-2 text-on-surface-variant/50 w-8 h-8"></svg>
              <p class="font-sans text-sm text-on-surface-variant/70">{{ t('empty.TO_LEARN') }}</p>
            </div>
          }
        </section>
        <section [id]="'inProgressList'" class="bg-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6"
          cdkDropList
          [cdkDropListData]="flattenedInProgressTasks()"
          (cdkDropListDropped)="dropped($event)">

          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.IN_PROGRESS') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">
              {{ flattenedInProgressTasks().length }}
            </span>
          </div>

          
          @for (categoryGroup of groupedInProgressTasks() | keyvalue; track categoryGroup.key) {
            <div class="flex flex-col gap-3 sm:gap-4 mt-4 border-t border-dashed border-outline-variant/20 pt-4">
              <div class="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
                @switch (categoryGroup.key) {
                  @case ('Backend') { <svg lucideServer class="w-4 h-4"></svg> }
                  @case ('Frontend') { <svg lucidePalette class="w-4 h-4"></svg> }
                  @case ('DevOps') { <svg lucideSettings class="w-4 h-4"></svg> }
                  @case ('Mobile') { <svg lucideSmartphone class="w-4 h-4"></svg> }
                  @case ('Database') { <svg lucideDatabase class="w-4 h-4"></svg> }
                  @case ('Testing') { <svg lucideBug class="w-4 h-4"></svg> }
                  @case ('UI/UX') { <svg lucideLayout class="w-4 h-4"></svg> }
                  @default { <svg lucideTrendingUp class="w-4 h-4"></svg> }
                } 
                <span class="uppercase">{{ t('category.' + categoryGroup.key.toUpperCase()) }}</span>
                <span class="ml-auto bg-surface-container-highest text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                  {{ categoryGroup.value.length }}
                </span>
              </div>
              @for (task of categoryGroup.value; track task.id) {
                <app-task-card
                  cdkDrag
                  [cdkDragData]="task"
                  [task]="task"
                  (edit)="editTask.emit($event)"
                  (delete)="onDelete($event)"
                  (move)="onMove($event)"
                />
              }
            </div>
          }
          @if (flattenedInProgressTasks().length === 0) {
            <div class="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 p-4 text-center bg-surface-container-highest/30">
              <svg lucideTrendingUp class="mb-2 text-on-surface-variant/50 w-8 h-8"></svg>
              <p class="font-sans text-sm text-on-surface-variant/70">{{ t('empty.IN_PROGRESS') }}</p>
            </div>
          }
        </section>

        <section [id]="'masteredList'" class="bg-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6"
          cdkDropList
          [cdkDropListData]="flattenedMasteredTasks()"
          (cdkDropListDropped)="dropped($event)">

          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-green-400"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.MASTERED') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full">
              {{ flattenedMasteredTasks().length }}
            </span>
          </div>
          @for (categoryGroup of groupedMasteredTasks() | keyvalue; track categoryGroup.key) {
            <div class="flex flex-col gap-3 sm:gap-4 mt-4 border-t border-dashed border-outline-variant/20 pt-4">
              <div class="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
                @switch (categoryGroup.key) {
                  @case ('Backend') { <svg lucideServer class="w-4 h-4"></svg> }
                  @case ('Frontend') { <svg lucidePalette class="w-4 h-4"></svg> }
                  @case ('DevOps') { <svg lucideSettings class="w-4 h-4"></svg> }
                  @case ('Mobile') { <svg lucideSmartphone class="w-4 h-4"></svg> }
                  @case ('Database') { <svg lucideDatabase class="w-4 h-4"></svg> }
                  @case ('Testing') { <svg lucideBug class="w-4 h-4"></svg> }
                  @case ('UI/UX') { <svg lucideLayout class="w-4 h-4"></svg> }
                  @default { <svg lucideLightbulb class="w-4 h-4"></svg> }
                }
                <span class="uppercase">{{ t('category.' + categoryGroup.key.toUpperCase()) }}</span>
                <span class="ml-auto bg-surface-container-highest text-on-surface-variant text-xs font-bold px-2 py-0.5 rounded-full">
                  {{ categoryGroup.value.length }}
                </span>
              </div>
              @for (task of categoryGroup.value; track task.id) {
                <app-task-card
                  cdkDrag
                  [cdkDragData]="task"
                  [task]="task"
                  (edit)="editTask.emit($event)"
                  (delete)="onDelete($event)"
                  (move)="onMove($event)"
                />
              }
            </div>
          }
          @if (flattenedMasteredTasks().length === 0) {
            <div class="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 p-4 text-center bg-surface-container-highest/30">
              <svg lucideTrophy class="mb-2 text-on-surface-variant/50 w-8 h-8"></svg>
              <p class="font-sans text-sm text-on-surface-variant/70">{{ t('empty.MASTERED') }}</p>
            </div>
          }
        </section>

      </div>
    </main>
  `,
  styles: [`
    /* ... tus estilos de scrollbar existentes ... */
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
  filterCategorySignal = signal<TaskCategory | ''>('');
  filterStatusSignal = signal<string>('');

  allCategories: TaskCategory[] = ['Backend', 'Frontend', 'DevOps', 'Mobile', 'Database', 'Testing', 'UI/UX', 'Other'];
  groupedToLearnTasks = computed(() => this.groupTasksByCategory(
    this.applyFilterLogic(this.roadmap.toLearnTasks(), this.filterCategorySignal(), this.filterStatusSignal())
  ));

  groupedInProgressTasks = computed(() => this.groupTasksByCategory(
    this.applyFilterLogic(this.roadmap.inProgressTasks(), this.filterCategorySignal(), this.filterStatusSignal())
  ));

  groupedMasteredTasks = computed(() => this.groupTasksByCategory(
    this.applyFilterLogic(this.roadmap.masteredTasks(), this.filterCategorySignal(), this.filterStatusSignal())
  ));

  flattenedToLearnTasks = computed(() => this.applyFilterLogic(
    this.roadmap.toLearnTasks(), this.filterCategorySignal(), this.filterStatusSignal()
  ));

  flattenedInProgressTasks = computed(() => this.applyFilterLogic(
    this.roadmap.inProgressTasks(), this.filterCategorySignal(), this.filterStatusSignal()
  ));

  flattenedMasteredTasks = computed(() => this.applyFilterLogic(
    this.roadmap.masteredTasks(), this.filterCategorySignal(), this.filterStatusSignal()
  ));


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
      const movedTask: Task = event.item.data;
      const newStatusId = event.container.id;

      let newStatus: TaskStatus;
      if (newStatusId === 'toLearnList') {
        newStatus = "TO_LEARN";
      } else if (newStatusId === 'inProgressList') {
        newStatus = "IN_PROGRESS";
      } else if (newStatusId === 'masteredList') {
        newStatus = "MASTERED";
      } else {
        console.warn('Estado de destino desconocido:', newStatusId);
        return;
      }

      this.roadmap.updateTaskStatus(movedTask.id, newStatus);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  filterCategory: TaskCategory | '' = '';
  filterStatus: TaskStatus | '' = '';
  applyFilters() {
    this.filterCategorySignal.set(this.filterCategory);
    this.filterStatusSignal.set(this.filterStatus);
  }

  private applyFilterLogic(tasks: Task[], category: TaskCategory | '', status: string): Task[] {
    let filtered = tasks;

    // Filtro por categoría
    if (category) {
      filtered = filtered.filter(task => task.category === category);
    }

    // Filtro por estado
    if (status) {
      filtered = filtered.filter(task => task.status === status);
    }

    return filtered;
  }

  // Método para agrupar tareas por categoría
  private groupTasksByCategory(tasks: Task[]): { [key: string]: Task[] } {
    const grouped: { [key: string]: Task[] } = {};
    this.allCategories.forEach(cat => grouped[cat] = []); // Asegura que todas las categorías estén presentes, incluso si están vacías

    tasks.forEach(task => {
      if (!grouped[task.category]) {
        grouped[task.category] = [];
      }
      grouped[task.category].push(task);
    });

    return grouped;
  }
}