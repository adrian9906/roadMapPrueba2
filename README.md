# DevRoadMap

## English

A learning board and task management application built with Angular 21.

### Description

DevRoadMap lets you organize learning tasks by status (`TO_LEARN`, `IN_PROGRESS`, `MASTERED`) and by category (`Backend`, `Frontend`, `DevOps`, `Mobile`, `Database`, `Testing`, `UI/UX`, `Other`). It includes dynamic filters, task editing, and a server-side rendering (SSR) ready experience.

### Why these libraries were chosen
- **Tailwind CSS 4** and **tailwind-animations**: selected for utility-first styling and fast development with built-in animations without overriding global styles.
- **@lucide/angular**: lightweight declarative icons for clean, accessible interfaces.
- **PrimeNG** and **@primeuix/themes**: included as a UI component foundation and theme option if the visual layer is extended.
- **UUID**: generates unique identifiers for tasks, ensuring consistency for in-memory objects and `localStorage`.

### Project structure

The project is organized as follows:

- `src/`
  - `main.ts`: Angular client bootstrap.
  - `main.server.ts`: SSR entry for server rendering.
  - `server.ts`: Express server for SSR.
  - `styles.css`: global styles.
  - `app/`
    - `app.ts`: root application component.
    - `app.routes.ts` / `app.routes.server.ts`: routing and navigation.
    - `app.config.ts` / `app.config.server.ts`: application configuration.
    - `core/`
      - `models/task.model.ts`: type definitions for tasks, statuses, and categories.
      - `services/roadmap.service.ts`: core storage, filtering, and persistence logic.
      - `services/i18n.service.ts`: internationalization service with translations and language detection.
    - `componets/`
      - `task/task.card.ts`: reusable task card.
      - `task/task.form.ts`: task creation/edit form.
    - `features/`
      - `dashboard/dashboard.component.ts`: overview and metrics.
      - `kanban/kanban.component.ts`: Kanban board with state and category filtering.

This structure separates responsibilities clearly: services manage state and persistence, models define data, and components represent UI.

### Why this architecture was chosen

- `core/`: hosts shared services and models used across the app.
- `features/`: groups main views such as the Kanban board and dashboard.
- `components/`: contains reusable UI pieces that can be used across multiple screens.
- Separating `app.routes.*` and `app.config.*` helps keep client and server configuration clearly distinct.

### Use of Signals

The application uses `signals` to manage reactive state without an external state library.

Signals were chosen because they simplify reactivity and offer better performance compared to `BehaviorSubject` or `NgRx` patterns for this app size.

### Internationalization

The `I18nService` manages translations in English and Portuguese. It also stores the selected language in `localStorage` and updates the `lang` attribute on `document.documentElement`.

### Persistence and SSR

- Task data is stored in `localStorage` by `RoadmapService`.
- The service detects whether it is running in the browser with `isPlatformBrowser(PLATFORM_ID)` before using `localStorage`.
- On the server, sample data is provided so SSR can render initial content.

### Useful scripts

- `npm start`: runs the app in development mode.
- `npm run build`: builds the app for production.
- `npm run watch`: rebuilds automatically during development.
- `npm test`: runs unit tests.
- `npm run serve:ssr:devRoadMap`: starts the SSR app from `dist/`.

### How to run locally

```bash
npm install
npm start
```

Then open `http://localhost:4200/`.

### What to review first

1. `src/app/core/services/roadmap.service.ts`: task logic, signals, and persistence.
2. `src/app/features/kanban/kanban.component.ts`: category filters, grouping logic, and Kanban UI.
3. `src/app/core/services/i18n.service.ts`: translation and language persistence.
4. `src/app/core/models/task.model.ts`: task types, statuses, and categories.

## Português

Uma aplicação de painel de aprendizado e gerenciamento de tarefas construída com Angular 21.

### Descrição

O DevRoadMap permite organizar tarefas de aprendizado por status (`TO_LEARN`, `IN_PROGRESS`, `MASTERED`) e por categoria (`Backend`, `Frontend`, `DevOps`, `Mobile`, `Database`, `Testing`, `UI/UX`, `Other`). Inclui filtros dinâmicos, edição de tarefas e suporte preparado para renderização no servidor (SSR).

### Por que essas bibliotecas foram escolhidas
- **Tailwind CSS 4** e **tailwind-animations**: escolhidas para um estilo utilitário e desenvolvimento rápido com animações prontas sem sobrescrever estilos globais.
- **@lucide/angular**: ícones leves e declarativos para interfaces limpas e acessíveis.
- **PrimeNG** e **@primeuix/themes**: incluídos como base para componentes de UI e temas caso a camada visual seja ampliada.
- **UUID**: gera identificadores únicos para tarefas, garantindo consistência para objetos em memória e `localStorage`.

### Estrutura do projeto

O projeto está organizado da seguinte forma:

- `src/`
  - `main.ts`: bootstrap do cliente Angular.
  - `main.server.ts`: entrada SSR para renderização no servidor.
  - `server.ts`: servidor Express para SSR.
  - `styles.css`: estilos globais.
  - `app/`
    - `app.ts`: componente raiz da aplicação.
    - `app.routes.ts` / `app.routes.server.ts`: rotas e navegação.
    - `app.config.ts` / `app.config.server.ts`: configuração da aplicação.
    - `core/`
      - `models/task.model.ts`: definições de tipo para tarefas, status e categorias.
      - `services/roadmap.service.ts`: lógica principal de armazenamento, filtros e persistência.
      - `services/i18n.service.ts`: serviço de internacionalização com traduções e detecção de idioma.
    - `componets/`
      - `task/task.card.ts`: cartão de tarefa reutilizável.
      - `task/task.form.ts`: formulário de criação/edição de tarefas.
    - `features/`
      - `dashboard/dashboard.component.ts`: visão geral e métricas.
      - `kanban/kanban.component.ts`: quadro Kanban com filtro por status e categoria.

Essa estrutura separa responsabilidades claramente: serviços gerenciam estado e persistência, modelos definem dados e componentes representam a UI.

### Por que essa arquitetura foi escolhida

- `core/`: hospeda serviços compartilhados e modelos usados em toda a aplicação.
- `features/`: agrupa as principais views, como o quadro Kanban e o dashboard.
- `components/`: contém peças reutilizáveis de UI que podem ser usadas em várias telas.
- Separar `app.routes.*` e `app.config.*` ajuda a manter as configurações do cliente e do servidor claramente distintas.

### Uso de Signals

A aplicação usa `signals` para gerenciar estado reativo sem uma biblioteca externa de estado.

Signals foram escolhidos porque simplificam a reatividade e oferecem melhor desempenho em comparação a padrões baseados em `BehaviorSubject` ou `NgRx` para este tamanho de app.

### Internacionalização

O `I18nService` gerencia traduções em inglês e português. Também armazena o idioma selecionado em `localStorage` e atualiza o atributo `lang` de `document.documentElement`.

### Persistência e SSR

- Os dados das tarefas são salvos em `localStorage` pelo `RoadmapService`.
- O serviço detecta se está executando no navegador com `isPlatformBrowser(PLATFORM_ID)` antes de usar `localStorage`.
- No servidor, dados de exemplo são fornecidos para que o SSR possa renderizar conteúdo inicial.

### Scripts úteis

- `npm start`: executa a aplicação em modo de desenvolvimento.
- `npm run build`: constrói a aplicação para produção.
- `npm run watch`: reconstrói automaticamente em desenvolvimento.
- `npm test`: executa testes unitários.
- `npm run serve:ssr:devRoadMap`: inicia a aplicação SSR a partir de `dist/`.

### Como executar localmente

```bash
npm install
npm start
```

Em seguida, abra `http://localhost:4200/`.

### O que revisar primeiro

1. `src/app/core/services/roadmap.service.ts`: lógica de tarefas, signals e persistência.
2. `src/app/features/kanban/kanban.component.ts`: filtros de categoria, lógica de agrupamento e UI do Kanban.
3. `src/app/core/services/i18n.service.ts`: tradução e persistência de idioma.
4. `src/app/core/models/task.model.ts`: tipos de tarefa, status e categorias.
