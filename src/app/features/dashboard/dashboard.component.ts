import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideMap } from '@lucide/angular'
import { I18nService } from '../../core/services/i18n.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, LucideMap],
    template: `
    <div class="flex h-screen w-full overflow-hidden bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-elegant-bg dark:text-elegant-text font-sans">
      <div  class="w-full flex flex-row">
      <div class="flex flex-1 flex-col h-full overflow-hidden">
        <div class="mb-10 flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight text-indigo-600 dark:text-elegant-accent">
              
        <header class="fixed top-0 w-full z-50 bg-[#0b1326]/60 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full no-border tonal-layering">
            <div class="flex items-end justify-start gap-8">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#00daf3] to-[#009fb2] text-white dark:bg-elegant-accent">
                  <svg lucideMap class="!h-[20px] !w-[20px] !text-[20px]"></svg>
                </div>
                <h1 class="text-xl font-bold bg-gradient-to-r from-[#00daf3] to-[#009fb2] bg-clip-text text-transparent font-headline uppercase tracking-wider">{{ t('app.title') }}</h1>
              </div>
          <div class="flex items-center gap-5">
            <!-- Language Toggle -->
            <button 
              (click)="toggleLang()"
              class="rounded-[4px] bg-zinc-100 px-2.5 py-1 font-mono text-[12px] text-zinc-600 hover:bg-zinc-200 dark:bg-elegant-border dark:text-elegant-text-muted dark:hover:bg-elegant-card transition-colors"
            [title]="i18n.currentLang() === 'en' ? t('lang.pt') : t('lang.en')"
              >
              {{ i18n.currentLang() === 'en' ? 'EN | PT' : 'PT | EN' }}
            </button>

            <!-- Theme Toggle -->
            <button 
              (click)="toggleTheme()" 
              class="flex items-center justify-center rounded-lg p-1 text-zinc-600 hover:bg-zinc-100 dark:text-elegant-text-muted dark:hover:bg-elegant-card transition-colors"
            [title]="theme.theme() === 'dark' ? t('theme.light') : t('theme.dark')"
              >
              <svg lucideSun class="!h-[20px] !w-[20px] !text-[20px]"></svg>
            </button>

            <!-- User Profile Placeholder -->
            <div class="h-8 w-8 rounded-full border-2 border-indigo-600 bg-zinc-200 dark:border-elegant-accent dark:bg-[#444]"></div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto p-4 sm:p-8">
          <div class="mx-auto h-full w-full max-w-7xl flex flex-col">
            <div class="mb-6 flex items-end justify-between">
              <div>
                <h2 class="mb-2 font-sans text-[28px] font-bold tracking-tight text-zinc-900 dark:text-elegant-text">Frontend Mastery</h2>
                <p class="font-sans text-sm text-zinc-500 dark:text-elegant-text-muted">Projected completion: Dec 2024 &bull; 12 modules remaining</p>
              </div>
              
              <button 
                
                class="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-elegant-accent dark:hover:bg-blue-600 dark:focus:ring-offset-elegant-bg"
              >
                + {{ t('action.add') }}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  `
})
export class DashboardComponent {
    i18n = inject(I18nService);
    theme = inject(ThemeService);
    t(key: string): string {
        return this.i18n.translate(key);
    }
    toggleTheme() {
        this.theme.toggleTheme();
    }

    toggleLang() {
        this.i18n.toggleLanguage();
    }

}
