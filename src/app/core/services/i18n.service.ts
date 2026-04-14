import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'pt';

export const TRANSLATIONS = {
    en: {
        'app.title': 'DevRoadmap',
        'app.subtitle': 'Track your learning journey',
        'status.TO_LEARN': 'To Learn',
        'status.IN_PROGRESS': 'In Progress',
        'status.MASTERED': 'Mastered',
        'action.add': 'Add Goal',
        'action.edit': 'Edit',
        'action.delete': 'Delete',
        'action.save': 'Save',
        'action.cancel': 'Cancel',
        'form.title.new': 'New Goal',
        'form.title.edit': 'Edit Goal',
        'form.field.title': 'Title',
        'form.field.description': 'Description',
        'form.field.status': 'Status',
        'form.field.tags': 'Tags (comma separated)',
        'empty.TO_LEARN': 'Nothing to learn yet. Add a new goal!',
        'empty.IN_PROGRESS': 'Not working on anything right now.',
        'empty.MASTERED': 'Keep learning to master new skills!',
        'theme.dark': 'Dark Mode',
        'theme.light': 'Light Mode',
        'lang.en': 'English',
        'lang.pt': 'Português',
    },
    pt: {
        'app.title': 'DevRoadmap',
        'app.subtitle': 'Acompanhe a sua jornada de aprendizagem',
        'status.TO_LEARN': 'A Aprender',
        'status.IN_PROGRESS': 'Em Progresso',
        'status.MASTERED': 'Dominado',
        'action.add': 'Adicionar Objetivo',
        'action.edit': 'Editar',
        'action.delete': 'Eliminar',
        'action.save': 'Guardar',
        'action.cancel': 'Cancelar',
        'form.title.new': 'Novo Objetivo',
        'form.title.edit': 'Editar Objetivo',
        'form.field.title': 'Título',
        'form.field.description': 'Descrição',
        'form.field.status': 'Estado',
        'form.field.tags': 'Tags (separadas por vírgula)',
        'empty.TO_LEARN': 'Nada para aprender ainda. Adicione um novo objetivo!',
        'empty.IN_PROGRESS': 'Não está a trabalhar em nada de momento.',
        'empty.MASTERED': 'Continue a aprender para dominar novas competências!',
        'theme.dark': 'Modo Escuro',
        'theme.light': 'Modo Claro',
        'lang.en': 'English',
        'lang.pt': 'Português',
    }
};

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private readonly STORAGE_KEY = 'devroadmap_lang';
    private platformId = inject(PLATFORM_ID);

    private _currentLang = signal<Language>('en');
    public currentLang = this._currentLang.asReadonly();

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem(this.STORAGE_KEY) as Language;
            if (stored === 'en' || stored === 'pt') {
                this._currentLang.set(stored);
            } else {
                const browserLang = navigator.language.startsWith('pt') ? 'pt' : 'en';
                this._currentLang.set(browserLang);
            }
        }

        effect(() => {
            const lang = this._currentLang();
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem(this.STORAGE_KEY, lang);
                document.documentElement.lang = lang;
            }
        });
    }

    public setLanguage(lang: Language) {
        this._currentLang.set(lang);
    }

    public toggleLanguage() {
        this._currentLang.update(lang => lang === 'en' ? 'pt' : 'en');
    }

    public translate(key: string): string {
        return (TRANSLATIONS[this._currentLang()] as Record<string, string>)[key] || key;
    }
}
