import { Component, inject, output, signal, computed } from '@angular/core'; // Importar signal y computed
import { CommonModule } from '@angular/common';
import { I18nService } from '../../core/services/i18n.service';
import { Task, TaskStatus } from '../../core/models/task.model';
import { RoadmapService } from '../../core/services/roadmap.service';
import { LucideLightbulb, LucideTrendingUp, LucideTrophy } from '@lucide/angular';
import { TaskCardComponent } from '../../componets/task/task.card';
import { CdkDragDrop, moveItemInArray, transferArrayItem, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms'; // ¡Importa FormsModule aquí!

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    LucideLightbulb,
    LucideTrendingUp,
    LucideTrophy,
    TaskCardComponent,
    LucideTrophy,
    DragDropModule,
    FormsModule // ¡Añade FormsModule a los imports!
  ],
  template: `
    <main class="pt-20 pb-20 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="mb-6 flex gap-4 items-end justify-end mx-auto">
        <!-- Si quisieras un filtro global por estado, aunque tu diseño ya separa por estado -->
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
      </div>

      <div class="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8" cdkDropListGroup>

        <section  [id]="'toLearnList'" class="bg-surface-container-low rounded-xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6"
        cdkDropList
        [cdkDropListData]="filteredToLearnTasks()"
        (cdkDropListDropped)="dropped($event)">
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.TO_LEARN') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full">
              {{ filteredToLearnTasks().length }}
            </span>
          </div>

          <div class="flex flex-col gap-3 sm:gap-4">
            @for (task of filteredToLearnTasks(); track task.id) {
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
        [cdkDropListData]="filteredInProgressTasks()"
        (cdkDropListDropped)="dropped($event)">
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.IN_PROGRESS') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20">
              {{ filteredInProgressTasks().length }}
            </span>
          </div>

          <div class="flex flex-col gap-3 sm:gap-4">

          @for (task of filteredInProgressTasks(); track task.id) {
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
        [cdkDropListData]="filteredMasteredTasks()"
        (cdkDropListDropped)="dropped($event)">
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-green-400"></span>
              <h2 class="font-headline font-bold text-base sm:text-lg uppercase tracking-widest text-on-surface">
                {{ t('status.MASTERED') }}
              </h2>
            </div>
            <span class="bg-surface-container-high text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full">
              {{ filteredMasteredTasks().length }}
            </span>
          </div>

          <div class="flex flex-col gap-3 sm:gap-4">
            @for (task of filteredMasteredTasks(); track task.id) {
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
export class KanbanComponent { // Ya no necesitamos OnInit
  roadmap = inject(RoadmapService);
  private i18n = inject(I18nService);

  editTask = output<Task>();

  // Usamos signals para los términos de búsqueda y filtro
  searchTermSignal = signal<string>('');
  filterStatusSignal = signal<string>(''); // Opcional si quieres un filtro global de estado

  // Computed signals para las tareas filtradas en cada columna
  filteredToLearnTasks = computed(() =>
    this.applyFilterLogic(
      this.roadmap.toLearnTasks(), // Accede al valor del signal
      this.searchTermSignal(),     // Accede al valor del signal
      this.filterStatusSignal()    // Accede al valor del signal
    )
  );

  filteredInProgressTasks = computed(() =>
    this.applyFilterLogic(
      this.roadmap.inProgressTasks(),
      this.searchTermSignal(),
      this.filterStatusSignal()
    )
  );

  filteredMasteredTasks = computed(() =>
    this.applyFilterLogic(
      this.roadmap.masteredTasks(),
      this.searchTermSignal(),
      this.filterStatusSignal()
    )
  );

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

  // Ahora, los métodos `applyFilters` actualizarán los signals directamente
  searchTerm: string = ''; // Usamos ngModel para enlazar al input
  filterStatus: string = ''; // Usamos ngModel para enlazar al select (opcional)

  applyFilters() {
    this.searchTermSignal.set(this.searchTerm.toLowerCase());
    this.filterStatusSignal.set(this.filterStatus); // Opcional
  }

  private applyFilterLogic(tasks: Task[], term: string, status: string): Task[] {
    let filtered = tasks;

    // Filtro por término de búsqueda
    if (term) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }

    // Filtro por estado (opcional, si lo habilitas)
    if (status) {
      filtered = filtered.filter(task => task.status === status);
    }

    return filtered;
  }
}