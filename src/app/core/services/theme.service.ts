import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly STORAGE_KEY = 'devroadmap_theme';
    private platformId = inject(PLATFORM_ID);

    private _theme = signal<Theme>('dark'); // Default to dark mode for developers
    public theme = this._theme.asReadonly();

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
            if (stored === 'light' || stored === 'dark') {
                this._theme.set(stored);
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this._theme.set(prefersDark ? 'dark' : 'light');
            }
        }

        effect(() => {
            const currentTheme = this._theme();
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(this.STORAGE_KEY, currentTheme);
                if (currentTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        });
    }

    public toggleTheme() {
        this._theme.update(t => t === 'dark' ? 'light' : 'dark');
    }

    public setTheme(theme: Theme) {
        this._theme.set(theme);
    }
}
