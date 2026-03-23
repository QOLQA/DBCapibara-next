# Las capas Widgets, Features y Entities en Feature-Sliced Design

Este texto sirve como base para un artículo o capítulo que profundiza en el rol de **tres capas** del método **Feature-Sliced Design (FSD)** en el frontend: **Widgets**, **Features** y **Entities**. Cada una responde a una pregunta distinta en el diseño del software y, juntas, permiten que la interfaz sea mantenible, reutilizable y alineada con el dominio.

---

## Descripción de las tres capas

### Widgets (composición de la interfaz)

La capa **Widgets** agrupa bloques de interfaz de **alto nivel**: composiciones que el usuario percibe como “zonas” o paneles completos (cabeceras con varios controles, paneles laterales, dashboards compuestos por varios gráficos, etc.). Su importancia está en **ordenar la complejidad visual**: aquí se decide *qué* se muestra junto, *cómo* se distribuye el espacio y *qué* piezas se ensamblan, sin mezclar reglas de negocio ni acceso directo a datos de bajo nivel. Un widget debe permanecer **delgado**: principalmente layout, composición de subcomponentes y cableado hacia la capa de features. Así se evita duplicar lógica cuando el mismo comportamiento debe servir en otra página o contexto.

### Features (casos de uso y orquestación)

La capa **Features** concentra lo que en otros enfoques serían **casos de uso** o **interacciones concretas del producto**: “calcular métricas del modelo”, “guardar la solución”, “filtrar por versión”, etc. Su importancia es **separar la intención del producto** de los detalles de almacenamiento y de la maquetación. Los features **orquestan**: combinan llamadas a stores, servicios y funciones puras de las entidades, aplican reglas que cruzan varias fuentes de datos y exponen a la UI hooks o acciones claras. Sin esta capa, los widgets o las páginas acabarían llenos de lógica difícil de testear y de reutilizar; con ella, el mismo caso de uso puede alimentar distintos widgets sin copiar código.

### Entities (dominio y datos compartidos)

La capa **Entities** modela **conceptos de negocio estables** del sistema: solución, consulta, usuario, etc. Incluye habitualmente **estado** (stores, modelos), **lógica pura** en bibliotecas (`lib`: cálculos, validaciones, transformaciones) y, cuando aplica, **piezas de UI atómicas** reutilizables en torno a ese concepto. Su importancia es **ser la fuente de verdad** y el lugar donde vive el conocimiento del dominio: si mañana cambia cómo se persisten los datos o cómo se calcula una métrica, el ajuste se localiza aquí o en los features que la consumen, no repartido por docenas de componentes. Las entidades suelen ser las más **reutilizables entre features** y las más **resistentes** a cambios de pantalla o de flujo de usuario.

---

## Interacción entre las tres capas

En conjunto, las tres capas forman una cadena de responsabilidades: los **widgets** traducen el producto en composición visual y puntos de entrada del usuario; los **features** implementan *qué* debe ocurrir en cada interacción y *cómo* coordinar datos y reglas; las **entities** proporcionan los **conceptos**, el **estado** y las **operaciones** reutilizables sobre el dominio. El flujo típico va de lo más específico de pantalla (widget) hacia lo más estable (entidad), pasando por la orquestación (feature): el widget depende de la feature para no acoplarse al detalle de varios stores o librerías, y la feature depende de las entidades para leer y transformar datos sin duplicar modelos. Esa separación hace que cada capa sea **importante en su propio nivel**: sin widgets, la experiencia queda fragmentada; sin features, la lógica se dispersa o se duplica; sin entities, no hay base común ni consistencia en datos y reglas. Mantener límites claros entre ellas es lo que permite evolucionar la UI y el negocio por separado sin que un cambio en una pantalla rompa todo el sistema.

---

*Contexto de referencia en este proyecto: el widget `metrics-panel`, la feature `modeling-metrics` y las entidades `solution` y `query` ilustran este patrón: la UI compone el panel, la feature expone hooks que leen estado y aplican métricas, y las entidades aportan stores y funciones puras.*
