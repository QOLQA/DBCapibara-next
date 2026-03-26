---
name: ""
overview: ""
todos: []
isProject: false
---

# Plan: Migración de components/ a shared (FSD)

## Estado actual

- **Ubicación:** `components/` en la raíz del proyecto (fuera de `src/`).
- **Contenido:**
  - `components/ui/` — 18 componentes shadcn (button, modal, chart, sidebar, input, select, etc.).
  - `components/icons/` — HeaderIcons, TableOptionsIcons, SidebarIcons.
  - `components/managedDropdownMenu.tsx` — wrapper de DropdownMenu con contexto de dropdown único.
- **Dependencias externas:**
  - `@/lib/utils` — función `cn` (clsx + twMerge).
  - `@/contexts/dropdown-context` — DropdownProvider, useDropdownContext (usado por ManagedDropdownMenu).
  - `@/hooks/use-mobile` — useIsMobile (usado por sidebar).
- **Consumidores:** features (analysis, modeling-solution, solution-versioning, queries, project-management), pages (projects, modeling), app/layout, y entre los propios componentes.

## Objetivo FSD

Según [frontend-fsd], **shared** contiene la base técnica: `api`, `ui` (kit), `lib`. Todo el código FSD está bajo `src/`. Mover `components/` a `src/shared` cumple la regla y centraliza el kit de UI.

## Estructura destino en `src/shared/`

```
src/shared/
├── ui/                          # Kit de UI (ya existe MoreButton)
│   ├── button.tsx
│   ├── modal.tsx
│   ├── chart.tsx
│   ├── sidebar.tsx
│   ├── input.tsx
│   ├── InputField.tsx
│   ├── select.tsx
│   ├── card.tsx
│   ├── label.tsx
│   ├── dialog.tsx
│   ├── separator.tsx
│   ├── dropdown-menu.tsx
│   ├── breadcrumb.tsx
│   ├── sheet.tsx
│   ├── skeleton.tsx
│   ├── tooltip.tsx
│   ├── switch.tsx
│   ├── avatar.tsx
│   ├── collapsible.tsx
│   ├── sonner.tsx
│   ├── ManagedDropdownMenu.tsx
│   ├── MoreButton/
│   └── icons/
│       ├── HeaderIcons.tsx
│       ├── SidebarIcons.tsx
│       └── TableOptionsIcons.tsx
├── lib/
│   ├── cn.ts                   # Re-exportar cn (migrar desde lib/utils)
│   ├── dropdown-context.tsx    # Migrar desde contexts/
│   ├── use-mobile.ts           # Migrar desde hooks/
│   ├── analytics/
│   ├── conversions/
│   └── utils/
└── api/
```

## 1. Migrar dependencias a shared

### 1.1 `lib/utils` (cn) → `src/shared/lib/cn.ts`

- Crear `src/shared/lib/cn.ts` con el contenido actual de `lib/utils/index.ts` (función `cn`).
- Añadir export en `src/shared/lib/index.ts` si existe, o crear barrel.

### 1.2 `contexts/dropdown-context` → `src/shared/lib/dropdown-context.tsx`

- Mover `contexts/dropdown-context.tsx` a `src/shared/lib/dropdown-context.tsx`.
- Exportar desde la API pública de shared (o desde lib).

### 1.3 `hooks/use-mobile` → `src/shared/lib/use-mobile.ts`

- Mover `hooks/use-mobile.ts` a `src/shared/lib/use-mobile.ts`.
- Actualizar imports en sidebar y cualquier otro consumidor.

## 2. Migrar componentes UI

### 2.1 Componentes `components/ui/*` → `src/shared/ui/`

- Copiar cada archivo de `components/ui/` a `src/shared/ui/` (mismo nombre).
- Actualizar imports internos:
  - `@/lib/utils` → `@fsd/shared/lib/cn` o `@fsd/shared/lib` (según barrel).
  - `@/components/ui/*` → `@fsd/shared/ui/*` (entre componentes del kit).
  - `@/hooks/use-mobile` → `@fsd/shared/lib/use-mobile`.

### 2.2 Icons `components/icons/*` → `src/shared/ui/icons/`

- Crear `src/shared/ui/icons/` y mover HeaderIcons, SidebarIcons, TableOptionsIcons.
- Crear `src/shared/ui/icons/index.ts` con re-exports.

### 2.3 ManagedDropdownMenu

- Mover `components/managedDropdownMenu.tsx` → `src/shared/ui/ManagedDropdownMenu.tsx`.
- Actualizar imports: `@/contexts/dropdown-context` → `@fsd/shared/lib/dropdown-context`, `@/components/ui/dropdown-menu` → `@fsd/shared/ui/dropdown-menu`.

## 3. API pública de shared

Crear o actualizar `src/shared/index.ts` (o barrels por segmento):

```ts
// Re-exports principales
export { cn } from "./lib/cn";
export { DropdownProvider, useDropdownContext } from "./lib/dropdown-context";
export { useIsMobile } from "./lib/use-mobile";

export { Button, buttonVariants } from "./ui/button";
export { Modal } from "./ui/modal";
// ... resto de componentes según uso
```

O mantener imports directos por ruta: `@fsd/shared/ui/button`, `@fsd/shared/ui/icons/HeaderIcons`, etc.

## 4. Actualizar consumidores

| Archivo                                   | Cambios                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                          | `@/components/ui/sonner` → `@fsd/shared/ui/sonner`; `@/contexts/dropdown-context` → `@fsd/shared/lib/dropdown-context`  |
| `src/features/analysis/ui/*`              | `@/components/ui/chart` → `@fsd/shared/ui/chart`; `@/components/icons/HeaderIcons` → `@fsd/shared/ui/icons/HeaderIcons` |
| `src/features/modeling-solution/ui/*`     | Actualizar todos los imports de `@/components/*` a `@fsd/shared/*`                                                      |
| `src/features/solution-versioning/ui/*`   | Idem                                                                                                                    |
| `src/features/queries/ui/*`               | Idem                                                                                                                    |
| `src/features/project-management/*/ui/*`  | Idem                                                                                                                    |
| `src/pages/*`                             | Idem                                                                                                                    |
| `src/shared/ui/MoreButton/MoreButton.tsx` | `@/components/ui/button` → `@fsd/shared/ui/button`                                                                      |

## 5. Actualizar components.json (shadcn)

Si se sigue usando `npx shadcn add`, actualizar aliases:

```json
{
	"aliases": {
		"components": "@fsd/shared/ui",
		"utils": "@fsd/shared/lib/cn",
		"ui": "@fsd/shared/ui",
		"lib": "@fsd/shared/lib",
		"hooks": "@fsd/shared/lib"
	}
}
```

O evaluar si shadcn debe apuntar a `src/shared/ui` para futuros adds.

## 6. Limpieza

- Eliminar `components/` completo.
- Eliminar `contexts/dropdown-context.tsx` (ya en shared).
- Eliminar `hooks/use-mobile.ts` (ya en shared).
- Eliminar `lib/utils/` (o vaciarlo si hay más; `cn` ya en shared).
- Verificar que no queden imports a `@/components`, `@/contexts/dropdown-context`, `@/hooks/use-mobile`, `@/lib/utils` (excepto si se mantiene compatibilidad temporal).

## 7. Orden de implementación

1. Crear `src/shared/lib/cn.ts` (copiar de lib/utils).
2. Mover `contexts/dropdown-context.tsx` → `src/shared/lib/dropdown-context.tsx`.
3. Mover `hooks/use-mobile.ts` → `src/shared/lib/use-mobile.ts`.
4. Mover `components/ui/*` → `src/shared/ui/*` y actualizar sus imports internos.
5. Mover `components/icons/*` → `src/shared/ui/icons/*`.
6. Mover `components/managedDropdownMenu.tsx` → `src/shared/ui/ManagedDropdownMenu.tsx`.
7. Actualizar `src/shared/ui/MoreButton/MoreButton.tsx` para usar `@fsd/shared/ui/button`.
8. Actualizar todos los consumidores en features, pages, app.
9. Actualizar `components.json` si aplica.
10. Eliminar `components/`, `contexts/dropdown-context.tsx`, `hooks/use-mobile.ts`, `lib/utils` (o los archivos migrados).

## Resumen

| Origen                               | Destino                                 |
| ------------------------------------ | --------------------------------------- |
| `components/ui/*`                    | `src/shared/ui/*`                       |
| `components/icons/*`                 | `src/shared/ui/icons/*`                 |
| `components/managedDropdownMenu.tsx` | `src/shared/ui/ManagedDropdownMenu.tsx` |
| `lib/utils` (cn)                     | `src/shared/lib/cn.ts`                  |
| `contexts/dropdown-context.tsx`      | `src/shared/lib/dropdown-context.tsx`   |
| `hooks/use-mobile.ts`                | `src/shared/lib/use-mobile.ts`          |

Imports: `@/components/*` → `@fsd/shared/ui/*` (o ruta específica según barrel).
