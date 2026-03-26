# metrics

Métricas del dominio **Solution/Diagram**.

## Alcance

Esta librería contiene cálculos de métricas sobre el diagrama/modelo:

- redundancia
- recovery cost
- access pattern
- completude / porcentaje de queries manejadas

## Qué se permite agregar

- Cálculos determinísticos basados en `Node<TableData>[]`, `Edge[]` y/o `Query[]`.
- Optimización interna (caching) siempre que no cambie la semántica.

## Qué NO se permite agregar

- Llamadas a red / API.
- Lógica de UI.
- Dependencias a features/pages.

## Ejemplos

```ts
import { getRedundancyMetrics } from "@fsd/entities/solution/lib/metrics";

const redundancy = getRedundancyMetrics(nodes);
```
