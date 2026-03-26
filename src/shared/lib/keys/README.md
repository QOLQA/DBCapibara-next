# keys

Utilidades para parsing de compound keys (ej. `parentId-childId-grandchildId`).

## Alcance

- `getKeySegment`: obtiene un segmento de una key compuesta por índice.

## Ejemplo

```ts
import { getKeySegment } from "@fsd/shared/lib/keys";

getKeySegment("a-b-c", 1); // "a"
getKeySegment("a-b-c", 2); // "a-b"
getKeySegment("a-b-c", 3); // "a-b-c"
```
