import { Component, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideCircleX } from '@lucide/angular';
import { Task, TaskCategory, TaskStatus } from '../../core/models/task.model'; // Importar TaskCategory
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideCircleX],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-0">
      <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-200 dark:bg-elegant-card dark:ring-elegant-border transition-all transform scale-100 opacity-100">
        <div class="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-elegant-border">
          <h2 class="font-sans text-lg font-semibold text-zinc-900 dark:text-elegant-text">
            {{ task() ? t('form.title.edit') : t('form.title.new') }}
          </h2>
          <button (click)="closeForm.emit()" class="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-elegant-border dark:hover:text-elegant-text transition-colors">
            <svg lucideCircleX class="!h-[20px] !w-[20px] !text-[20px]"></svg>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6">
          <div class="space-y-5">
            <div>
              <label for="task-title" class="mb-1.5 block font-sans text-sm font-medium text-zinc-700 dark:text-elegant-text-muted">
                {{ t('form.field.title') }}
              </label>
              <input
                id="task-title"
                type="text"
                formControlName="title"
                class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-elegant-border dark:bg-elegant-bg dark:text-elegant-text dark:placeholder-zinc-600 dark:focus:border-elegant-accent dark:focus:ring-elegant-accent"
                [placeholder]="t('form.field.title_placeholder')"
              />
            </div>

            <div>
              <label for="task-description" class="mb-1.5 block font-sans text-sm font-medium text-zinc-700 dark:text-elegant-text-muted">
                {{ t('form.field.description') }}
              </label>
              <textarea
                id="task-description"
                formControlName="description"
                rows="3"
                class="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-elegant-border dark:bg-elegant-bg dark:text-elegant-text dark:placeholder-zinc-600 dark:focus:border-elegant-accent dark:focus:ring-elegant-accent"
                [placeholder]="t('form.field.description_placeholder')"
              ></textarea>
            </div>

            <div>
              <label for="task-status" class="mb-1.5 block font-sans text-sm font-medium text-zinc-700 dark:text-elegant-text-muted">
                {{ t('form.field.status') }}
              </label>
              <select
                id="task-status"
                formControlName="status"
                class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-elegant-border dark:bg-elegant-bg dark:text-elegant-text dark:focus:border-elegant-accent dark:focus:ring-elegant-accent"
              >
                <option value="TO_LEARN">{{ t('status.TO_LEARN') }}</option>
                <option value="IN_PROGRESS">{{ t('status.IN_PROGRESS') }}</option>
                <option value="MASTERED">{{ t('status.MASTERED') }}</option>
              </select>
            </div>

            <!-- NUEVO: Campo de Categoría -->
            <div>
              <label for="task-category" class="mb-1.5 block font-sans text-sm font-medium text-zinc-700 dark:text-elegant-text-muted">
                {{ t('form.field.category') }}
              </label>
              <select
                id="task-category"
                formControlName="category"
                class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-elegant-border dark:bg-elegant-bg dark:text-elegant-text dark:focus:border-elegant-accent dark:focus:ring-elegant-accent"
              >
                @for (category of categories; track category) {
                  <option [value]="category">{{ t('category.' + category.toUpperCase()) }}</option>
                }
              </select>
            </div>

            <div>
              <label for="task-tags" class="mb-1.5 block font-sans text-sm font-medium text-zinc-700 dark:text-elegant-text-muted">
                {{ t('form.field.tags') }}
              </label>
              <input
                id="task-tags"
                type="text"
                formControlName="tags"
                class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 font-sans text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-elegant-border dark:bg-elegant-bg dark:text-elegant-text dark:placeholder-zinc-600 dark:focus:border-elegant-accent dark:focus:ring-elegant-accent"
                [placeholder]="t('form.field.tags_placeholder')"
              />
            </div>
          </div>

          <div class="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              (click)="closeForm.emit()"
              class="rounded-lg px-4 py-2 font-sans text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-elegant-text-muted dark:hover:bg-elegant-border transition-colors"
            >
              {{ t('action.cancel') }}
            </button>
            <button
              type="submit"
              [disabled]="form.invalid"
              class="rounded-lg bg-indigo-600 px-4 py-2 font-sans text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-elegant-accent dark:hover:bg-blue-600 dark:focus:ring-offset-elegant-bg transition-colors"
            >
              {{ t('action.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TaskFormComponent implements OnInit {
  task = input<Task | null>(null);
  save = output<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>();
  closeForm = output<void>();

  private fb = inject(FormBuilder);
  private i18n = inject(I18nService);

  // Lista de categorías para el selector
  categories: TaskCategory[] = ['Backend', 'Frontend', 'DevOps', 'Mobile', 'Database', 'Testing', 'UI/UX', 'Other'];

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    status: ['TO_LEARN', Validators.required],
    category: [this.categories[0], Validators.required], // ¡Nuevo campo! Default a la primera categoría
    tags: ['']
  });

  ngOnInit() {
    const t = this.task();
    if (t) {
      this.form.patchValue({
        title: t.title,
        description: t.description,
        status: t.status,
        category: t.category, // ¡Asignar valor a la categoría!
        tags: t.tags.join(', ')
      });
    }
  }

  t(key: string): string {
    return this.i18n.translate(key);
  }

  onSubmit() {
    if (this.form.valid) {
      const value = this.form.value;
      this.save.emit({
        title: value.title,
        description: value.description,
        status: value.status,
        category: value.category, // ¡Incluir la categoría!
        tags: value.tags ? value.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []
      });
    }
  }
}