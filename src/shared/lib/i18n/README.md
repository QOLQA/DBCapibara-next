# i18n

Setup y utilidades de traducción global (strings + helpers/hook) para la app.

## Alcance

- Diccionarios de traducción (`en`, `es`, ...).
- Helpers para resolver traducciones anidadas.
- Hook/función de traducción reutilizable.

## Qué se permite agregar

- Nuevos idiomas y namespaces globales.
- Helpers de i18n que no dependan de features/pages.

## Qué NO se permite agregar

- Strings específicas de una feature (si crecen, considerar namespaces o ubicación por slice fuera de shared).
- Lógica de negocio.

## Ejemplo

```ts
import { useTranslation } from "@fsd/shared/lib/i18n";

const { t } = useTranslation("es");
```

