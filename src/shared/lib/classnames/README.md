# classnames

Merge de clases CSS para uso con Tailwind (clsx + tailwind-merge).

## Alcance

- Función `cn(...inputs)` para combinar y deduplicar clases condicionales.
- Re-export del tipo `ClassValue` cuando se necesite en tipado.

## Qué se permite agregar

- Helpers que solo manipulen cadenas de clases o condicionales de clase.
- Dependencias tipo clsx, tailwind-merge o similares.

## Qué NO se permite agregar

- Lógica de negocio.
- Estilos inline o temas.
- Componentes React.

## Ejemplo

```ts
import { cn } from "@fsd/shared/lib/classnames";

<div className={cn("base", isActive && "active", className)} />
```
