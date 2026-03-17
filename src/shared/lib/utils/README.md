# utils

**Nota FSD:** evitar carpetas genéricas tipo `utils`. Esta carpeta existe por legado y contiene helpers **acotados** usados por el diagrama (edges/colores/keys). En una variante “FSD estricta” debería renombrarse a un propósito explícito (ej. `diagram`).

## Alcance actual

- Helpers para edges.
- Colores e índices de submodelos.
- Helpers de parsing para keys.

## Qué se permite agregar

- Solo helpers del mismo ámbito (diagram/canvas) que no dependan de features/pages.

## Qué NO se permite agregar

- Helpers genéricos sin foco.
- Lógica de UI.
- Lógica de dominio fuera de “diagram helpers”.

