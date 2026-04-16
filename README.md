# DevRoadMap

Aplicación de tablero de aprendizaje y gestión de tareas construida con Angular 21.

## Descripción

DevRoadMap es una aplicación que permite organizar tareas de aprendizaje por estado (`TO_LEARN`, `IN_PROGRESS`, `MASTERED`) y por categoría (`Backend`, `Frontend`, `DevOps`, `Mobile`, `Database`, `Testing`, `UI/UX`, `Other`). Incluye filtros dinámicos, edición de tareas y una experiencia preparada para SSR.

## Por qué se eligieron estas librerías

- **Angular 21**: seleccionada por su soporte nativo de `signals`, mejor rendimiento reactivo y capacidades modernas de SSR.
- **@angular/ssr** y **Express**: para habilitar renderizado del lado del servidor, mejorar el SEO y entregar una carga inicial más rápida.
- **Tailwind CSS 4** y **tailwind-animations**: elegidas para un diseño utilitario y rápido, con animaciones listas para usar sin sobrescribir estilos globales.
- **@lucide/angular**: iconografía ligera y declarativa, ideal para interfaces limpias y accesibles.
- **PrimeNG** y **@primeuix/themes**: incluidas como base para componentes UI y temas si se decide ampliar la capa de interfaz visual.
- **UUID**: genera identificadores únicos para las tareas, asegurando consistencia en objetos manejados en memoria y en `localStorage`.
- **Vitest**: runner moderno para pruebas unitarias con soporte rápido y configuración ligera.

## Estructura del proyecto

El proyecto está organizado de esta forma principal:

- `src/`
  - `main.ts`: arranque cliente de Angular.
  - `main.server.ts`: entrada SSR para renderizado en servidor.
  - `server.ts`: servidor Express para SSR.
  - `styles.css`: estilo global.
  - `app/`
    - `app.ts`: componente raíz de la aplicación.
    - `app.routes.ts` / `app.routes.server.ts`: rutas y navegación.
    - `app.config.ts` / `app.config.server.ts`: configuración de la app.
    - `core/`
      - `models/task.model.ts`: definiciones de tipos para tareas, estados y categorías.
      - `services/roadmap.service.ts`: lógica principal de almacenamiento, filtros y persistencia.
      - `services/i18n.service.ts`: servicio de internacionalización con traducciones y detección de idioma.
    - `componets/`
      - `task/task.card.ts`: tarjeta de tarea reusable.
      - `task/task.form.ts`: formulario de creación/edición de tareas.
    - `features/`
      - `dashboard/dashboard.component.ts`: vista general y métricas.
      - `kanban/kanban.component.ts`: tablero Kanban con filtro por estado y categoría.

Esta estructura separa responsabilidades claras: los servicios gestionan estado y persistencia, los modelos definen datos y los componentes representan UI.

## Por qué se escogió esta arquitectura

- `core/`: aloja servicios y modelos compartidos en toda la aplicación.
- `features/`: agrupa vistas principales como el panel Kanban y el dashboard.
- `components/`: contiene piezas reutilizables de UI que pueden ser usadas en múltiples pantallas.
- Separar `app.routes.*` y `app.config.*` ayuda a mantener configuraciones del cliente y del servidor claramente diferenciadas.

## Uso de Signals

La aplicación usa `signals` para manejar estado reactivo sin una librería externa de estado.

- En `RoadmapService`:
  - `tasks = signal<Task[]>([])` guarda el estado principal de tareas.
  - `toLearnTasks`, `inProgressTasks` y `masteredTasks` son `computed()` derivados de `tasks`.
  - Esto mantiene la lógica de negocio encapsulada y evita cálculos redundantes.
- En `KanbanComponent`:
  - `filterCategorySignal` y `filterStatusSignal` son señales que activan filtrado reactivo.
  - Los métodos de agrupado (`groupTasksByCategory`) se recalculan automáticamente cuando cambia el estado.
- En `I18nService`:
  - `currentLang` es una señal que permite cambiar idioma sin depender de `NgZone`.

Las señales fueron elegidas porque simplifican la reactividad, reducen boilerplate y ofrecen mejor rendimiento frente a patrones basados en `BehaviorSubject` o `NgRx` para este tamaño de app.

## Internacionalización

El servicio `I18nService` administra traducciones en inglés y portugués. También guarda el idioma seleccionado en `localStorage` y ajusta el atributo `lang` de `document.documentElement`.

## Persistencia y SSR

- Los datos de tareas se guardan en `localStorage` desde `RoadmapService`.
- El servicio detecta si está ejecutándose en navegador con `isPlatformBrowser(PLATFORM_ID)` antes de usar `localStorage`.
- En servidor, se proveen datos de ejemplo para que SSR renderice contenido inicial.

## Scripts útiles

- `npm start`: ejecuta la aplicación en modo desarrollo.
- `npm run build`: construye la aplicación para producción.
- `npm run watch`: reconstruye automáticamente en desarrollo.
- `npm test`: ejecuta pruebas de unidad.
- `npm run serve:ssr:devRoadMap`: inicia la aplicación SSR desde `dist/`.

## Cómo ejecutar localmente

```bash
npm install
npm start
```

Después abre `http://localhost:4200/`.

## Qué revisar primero

1. `src/app/core/services/roadmap.service.ts`: lógica de tareas, señales y persistencia.
2. `src/app/features/kanban/kanban.component.ts`: filtros de categorías, funciones de agrupado y UI Kanban.
3. `src/app/core/services/i18n.service.ts`: traducción y persistencia de idioma.
4. `src/app/core/models/task.model.ts`: tipos, estados y categorías de tareas.

## Posibles mejoras futuras

- Añadir pruebas unitarias para servicios y componentes.
- Implementar rutas de API real en lugar de `localStorage`.
- Ampliar la interfaz con componentes de PrimeNG o Material.
- Añadir soporte completo para más idiomas.
- Añadir validación de formulario y manejo avanzado de errores.
