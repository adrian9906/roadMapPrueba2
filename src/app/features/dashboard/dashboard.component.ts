import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideMap, LucideSun, LucideMoon } from '@lucide/angular';
import { I18nService } from '../../core/services/i18n.service';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RoadmapService } from '../../core/services/roadmap.service';
import { Task } from '../../core/models/task.model';
import { TaskFormComponent } from "../../componets/task/task.form";
import { KanbanComponent } from '../kanban/kanban.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideMap, LucideSun, FormsModule, ToggleSwitchModule, KanbanComponent, TaskFormComponent, LucideMoon],
  template: `
    <div class="flex min-h-screen w-full animate-fade-in animate-delay-300 bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-elegant-bg dark:text-elegant-text font-sans">
      <div class="w-full flex flex-row">
        <div class="flex flex-1 flex-col h-full">
          <header class="fixed top-0 w-full z-50 bg-zinc-50 border-b border-zinc-200 text-zinc-900 dark:bg-gray-950 dark:border-gray-600 backdrop-blur-xl flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 w-full no-border tonal-layering">
            <div class="flex items-end justify-start gap-4 sm:gap-8">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white dark:bg-elegant-accent">
                <svg lucideMap class="!h-[20px] !w-[20px] !text-[20px]"></svg>
              </div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent font-headline uppercase tracking-wider">{{ t('app.title') }}</h1>
            </div>
            <div class="flex items-center gap-3 sm:gap-5">
              <button
                (click)="toggleLang()"
                class="rounded-[4px] bg-zinc-100 px-2.5 py-1 font-mono text-[12px] text-zinc-600 hover:bg-zinc-200 dark:bg-elegant-border dark:text-elegant-text-muted dark:hover:bg-elegant-card transition-colors"
                [title]="i18n.currentLang() === 'en' ? t('lang.switch_to_pt') : t('lang.switch_to_en')"
              >
                {{ i18n.currentLang() === 'en' ? 'EN | PT' : 'PT | EN' }}
              </button>
              <div class="theme-control">
                <p-toggleswitch
                  [(ngModel)]="isDarkMode"
                  (onChange)="toggleTheme()"
                  styleClass="theme-toggle-custom"
                >
                  <ng-template pTemplate="handle" let-checked="checked">
                    <span class="flex items-center justify-center w-full h-full">
                      @if (checked) {
                        <svg lucideMoon class="w-4 h-4 text-yellow-400"></svg>
                      } @else {
                        <svg lucideSun class="w-4 h-4 text-slate-600"></svg>
                      }
                    </span>
                  </ng-template>
                </p-toggleswitch>
              </div>
            </div>
          </header>

          <main class="flex-1 overflow-y-auto  pt-20 pb-8"> 
            <section
              class="relative w-full h-[500px] sm:h-[500px] overflow-hidden flex items-center justify-center bg-cover bg-center"
              [style.background-image]="'url(' + backgroundImage + ')'"
            >
             
              <div class="absolute inset-0 bg-primary/10 blur-[120px] rounded-full z-0"></div>
              <div class="absolute inset-0 bg-black/30 z-0"></div> 

              <div class="container mx-auto px-4 sm:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 items-center gap-8 sm:gap-16 text-white">
                <div>
                  <h1 class="font-headline text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-4 sm:mb-6 leading-tight sm:leading-none">
                    {{ t('hero.title_part1') }} <span class="text-primary italic">{{ t('hero.title_part2') }}</span> <br/>{{ t('hero.title_part3') }}
                  </h1>
                  <p class="text-base sm:text-xl max-w-lg font-light leading-relaxed mb-6 sm:mb-10">
                    {{ t('hero.subtitle') }}
                  </p>
                  <div class="flex gap-4">
                    <div class="bg-surface-container-highest/50 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 rounded-xl flex items-center gap-3 sm:gap-4 border border-white/5">
                      <!-- Aquí podrías añadir más información si la tuvieras -->
                    </div>
                  </div>
                </div>
                <div class="flex justify-center items-center mt-8 md:mt-0"> <!-- Margen superior para móvil -->
                  <!-- Progress Visualization -->
                  <div class="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
                    <svg class="w-full h-full transform -rotate-90">
                      <circle class="text-gray-700" cx="160" cy="160" fill="transparent" r="140" stroke="currentColor" stroke-width="8"></circle>
                      <circle class="text-primary drop-shadow-[0_0_12px_rgba(0,218,243,0.6)]" cx="160" cy="160" fill="transparent" r="140" stroke="currentColor" stroke-dasharray="880" stroke-dashoffset="280" stroke-width="8"></circle>
                    </svg>
                    <div class="absolute flex flex-col items-center">
                      <span class="text-5xl sm:text-6xl font-headline font-bold text-primary">{{ activeRoadmapsCount() }}</span>
                      <span class="uppercase tracking-widest text-xs sm:text-sm text-white/80">{{ t('hero.roadmaps_active') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="mx-auto h-full w-full max-w-7xl flex flex-col pt-8">
              <div class="mb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-0">
                <div>
                  <h2 class="mb-1 sm:mb-2 font-sans text-2xl sm:text-[28px] font-bold tracking-tight text-on-surface">{{t('app.your_tasks')}}</h2>
                  <p class="font-sans text-sm text-on-surface">{{t('app.manage_tasks')}}</p>
                </div>

                <button
                  (click)="openAddModal()"
                  class="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-elegant-accent dark:hover:bg-blue-600 dark:focus:ring-offset-elegant-bg"
                >
                  + {{ t('action.add_task') }}
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
    </div>
  `,
  styles: [`
    .theme-control {
      display: flex;
      align-items: center;
    }
    :host ::ng-deep .theme-toggle-custom .p-toggleswitch-slider {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
    }

    /* Modo OSCURO (toggle checked) */
    :host ::ng-deep .theme-toggle-custom.p-toggleswitch-checked .p-toggleswitch-slider {
      background: #e2e8f0 !important; /* Gris claro - Puedes cambiar este color */
    }

    /* Estilos para el mesh-gradient con la imagen de fondo */
    .mesh-gradient-section { /* Esta clase ya no es necesaria con los cambios directos */
      position: relative;
      overflow: hidden;
      background-size: cover;
      background-position: center;
    }
  `]
})
export class DashboardComponent {
  i18n = inject(I18nService);
  theme = inject(ThemeService);
  isDarkMode = computed(() => this.theme.theme() === 'dark');
  private roadmap = inject(RoadmapService);

  isModalOpen = signal(false);
  editingTask = signal<Task | null>(null);

  activeRoadmapsCount = computed(() => {
    let count = 0;
    if (this.roadmap.toLearnTasks().length > 0) count++;
    if (this.roadmap.inProgressTasks().length > 0) count++;
    if (this.roadmap.masteredTasks().length > 0) count++;
    return count;
  });

  backgroundImage: string = 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2047&q=80';

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