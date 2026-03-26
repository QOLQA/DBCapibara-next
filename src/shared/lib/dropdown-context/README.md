# dropdown-context

Estado compartido para saber qué dropdown está abierto (Provider + hook). Evita tener varios dropdowns abiertos a la vez.

## Alcance

- `DropdownProvider`: envuelve la app (p. ej. en layout) y expone el estado.
- `useDropdownContext`: devuelve `{ activeDropdownId, setActiveDropdown }`.

## Qué se permite agregar

- Solo lo relacionado con este contexto (tipos, constantes del mismo ámbito).

## Qué NO se permite agregar

- Otros contextos o estado global no relacionado.
- Lógica de negocio de dominio.

## Ejemplo

```tsx
// app/layout.tsx
import { DropdownProvider } from "@fsd/shared/lib/dropdown-context";

<DropdownProvider>{children}</DropdownProvider>
```

```tsx
// En un menú dropdown
import { useDropdownContext } from "@fsd/shared/lib/dropdown-context";

const { activeDropdownId, setActiveDropdown } = useDropdownContext();
```
