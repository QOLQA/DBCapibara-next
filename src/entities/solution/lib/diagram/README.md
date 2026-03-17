# diagram

Helpers del diagrama/graph para el dominio **Solution/Diagram**.

## Alcance

- Colores e índices de submodelos (`colors.ts`).
- Cálculo de posiciones para edges flotantes (`edges.ts`).
- Helpers para parsing de keys de nodos/submodelos (`keys.ts`).

## Qué se permite agregar

- Funciones puras relacionadas con layout/representación del grafo del modelo de Solution.
- Helpers que operen sobre los tipos de `entities/solution` y estructuras de nodos/edges.

## Qué NO se permite agregar

- Lógica de UI o componentes.
- Llamadas a API o acceso a stores globales.
- Helpers genéricos que no estén ligados al diagrama de Solution.

