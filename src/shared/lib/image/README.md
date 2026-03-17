# image

Funciones de integración con servicios externos de imágenes (p. ej. Cloudinary).

## Alcance

- Subida de imágenes y helpers relacionados a providers externos.

## Qué se permite agregar

- Wrappers para SDKs/REST de proveedores de imágenes.
- Validación de configuración necesaria (env vars) y errores de integración.

## Qué NO se permite agregar

- Lógica del dominio (Solution/Diagram).
- Lógica de UI.

## Ejemplo

```ts
import { uploadImage } from "@fsd/shared/lib/image";

await uploadImage(file, { folder: "solutions" });
```

