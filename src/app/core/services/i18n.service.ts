import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'en' | 'pt';

export const TRANSLATIONS = {
    en: {
        'app.title': 'DevRoadmap',
        'app.subtitle': 'Track your learning journey',
        'app.your_tasks': 'Your Tasks',
        'app.manage_tasks': 'Manage your learning goals and track progress',
        'status.TO_LEARN': 'To Learn',
        'status.IN_PROGRESS': 'In Progress',
        'status.MASTERED': 'Mastered',
        'filter.all_statuses': 'All statuses',
        'filter.all_categories': 'All categories',
        'action.add': 'Add Goal',
        'action.add_task': 'Add Task',
        'action.edit': 'Edit',
        'action.delete': 'Delete',
        'action.save': 'Save',
        'action.cancel': 'Cancel',
        'form.title.new': 'Add New Task',
        'form.title.edit': 'Edit Task',
        'form.field.title': 'Title',
        'form.field.description': 'Description',
        'form.field.status': 'Status',
        'form.field.category': 'Category',
        'form.field.tags': 'Tags (comma separated)',
        'form.field.title_placeholder': 'Enter task title',
        'form.field.description_placeholder': 'Enter task description',
        'form.field.tags_placeholder': 'Enter tags separated by commas',
        'category.BACKEND': 'Backend',
        'category.FRONTEND': 'Frontend',
        'category.DEVOPS': 'DevOps',
        'category.MOBILE': 'Mobile',
        'category.DATABASE': 'Database',
        'category.TESTING': 'Testing',
        'category.UI/UX': 'UI/UX',
        'category.OTHER': 'Other',
        'empty.TO_LEARN': 'Nothing to learn yet. Add a new goal!',
        'empty.IN_PROGRESS': 'Not working on anything right now.',
        'empty.MASTERED': 'Keep learning to master new skills!',
        'hero.title_part1': 'Master Your',
        'hero.title_part2': 'Dev',
        'hero.title_part3': 'Journey',
        'hero.subtitle': 'Track your learning progress, set goals, and achieve mastery in your development career.',
        'hero.roadmaps_active': 'Active Roadmaps',
        'theme.dark': 'Dark Mode',
        'theme.light': 'Light Mode',
        'lang.en': 'English',
        'lang.pt': 'Português',
        'lang.switch_to_en': 'Switch to English',
        'lang.switch_to_pt': 'Switch to Portuguese',
    },
    pt: {
        'app.title': 'DevRoadmap',
        'app.subtitle': 'Acompanhe a sua jornada de aprendizagem',
        'app.your_tasks': 'Suas Tarefas',
        'app.manage_tasks': 'Gerencie suas metas de aprendizado e acompanhe o progresso',
        'status.TO_LEARN': 'A Aprender',
        'status.IN_PROGRESS': 'Em Progresso',
        'status.MASTERED': 'Dominado',
        'filter.all_statuses': 'Todos os estados',
        'filter.all_categories': 'Todas as categorias',
        'action.add': 'Adicionar Objetivo',
        'action.add_task': 'Adicionar Tarefa',
        'action.edit': 'Editar',
        'action.delete': 'Eliminar',
        'action.save': 'Guardar',
        'action.cancel': 'Cancelar',
        'form.title.new': 'Adicionar Nova Tarefa',
        'form.title.edit': 'Editar Tarefa',
        'form.field.title': 'Título',
        'form.field.description': 'Descrição',
        'form.field.status': 'Estado',
        'form.field.category': 'Categoria',
        'form.field.tags': 'Tags (separadas por vírgula)',
        'form.field.title_placeholder': 'Digite o título da tarefa',
        'form.field.description_placeholder': 'Digite a descrição da tarefa',
        'form.field.tags_placeholder': 'Digite tags separadas por vírgulas',
        'category.BACKEND': 'Backend',
        'category.FRONTEND': 'Frontend',
        'category.DEVOPS': 'DevOps',
        'category.MOBILE': 'Mobile',
        'category.DATABASE': 'Banco de Dados',
        'category.TESTING': 'Teste',
        'category.UI/UX': 'UI/UX',
        'category.OTHER': 'Outro',
        'empty.TO_LEARN': 'Nada para aprender ainda. Adicione um novo objetivo!',
        'empty.IN_PROGRESS': 'Não está a trabalhar em nada de momento.',
        'empty.MASTERED': 'Continue a aprender para dominar novas competências!',
        'hero.title_part1': 'Domine Sua',
        'hero.title_part2': 'Dev',
        'hero.title_part3': 'Jornada',
        'hero.subtitle': 'Acompanhe seu progresso de aprendizado, defina metas e alcance a maestria em sua carreira de desenvolvimento.',
        'hero.roadmaps_active': 'Roadmaps Ativos',
        'theme.dark': 'Modo Escuro',
        'theme.light': 'Modo Claro',
        'lang.en': 'English',
        'lang.pt': 'Português',
        'lang.switch_to_en': 'Mudar para Inglês',
        'lang.switch_to_pt': 'Mudar para Português',
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
