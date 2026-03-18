# breakpoints

Detección de viewport / breakpoints (p. ej. móvil &lt; 768px).

## Alcance

- `useIsMobile`: hook que devuelve si el viewport es menor que el breakpoint móvil (768px).

## Qué se permite agregar

- Hooks o helpers de breakpoints y media queries (misma familia).

## Qué NO se permite agregar

- Estilos o temas.
- Lógica de negocio.

## Ejemplo

```tsx
import { useIsMobile } from "@fsd/shared/lib/breakpoints";

const isMobile = useIsMobile();
```
