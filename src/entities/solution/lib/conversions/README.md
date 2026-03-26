# conversions

Transformaciones del dominio **Solution/Diagram** (mappers y normalización entre formatos).

## Alcance

- DTO/backend (`SolutionModel`, `VersionBackend`) → estructuras consumibles por el frontend (versions, nodes/edges).
- Frontend (`VersionFrontend`, `Node<TableData>`, `Edge`) → DTO/backend.

## Qué se permite agregar

- Mappers puros entre tipos del dominio (idealmente sin side-effects).
- Normalización/denormalización de estructuras de `versions/submodels/nodes/edges`.

## Qué NO se permite agregar

- Llamadas a API / acceso a estado global.
- Lógica de UI.
- Dependencias a features/pages.

## Ejemplos

```ts
import { transformSolutionModel } from "@fsd/entities/solution/lib/conversions";

const normalized = transformSolutionModel(solutionModel);
```

