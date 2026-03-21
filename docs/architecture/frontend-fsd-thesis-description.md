# Descripcion de la arquitectura frontend basada en Feature-Sliced Design

## Introduccion

El frontend del proyecto `DBCapibara-next` fue desarrollado con `Next.js`, `React`, `TypeScript` y `Tailwind CSS`. Sobre esta base se integran otras tecnologias especializadas que responden a necesidades concretas del sistema. `Zustand` se utiliza para la gestion de estado global de dominios como soluciones y consultas; `@xyflow/react` permite la construccion y manipulacion del lienzo de modelado; `Recharts` se emplea para la representacion grafica de metricas; y los componentes de interfaz se apoyan en primitivas de `Radix UI`, adaptadas a la estructura del proyecto mediante una capa propia en `shared/ui`.

La organizacion del frontend adopta la arquitectura `Feature-Sliced Design` (FSD). Esta decision no se tomo unicamente por razones de orden visual en el arbol de carpetas, sino porque el sistema posee varias areas funcionales claramente diferenciadas: autenticacion, gestion de proyectos, modelado de soluciones, versionado, consultas, comparacion y analisis. En un proyecto con este nivel de crecimiento, una estructura basada solamente en tipos tecnicos como `components`, `hooks`, `utils` o `services` tiende a mezclar responsabilidades, dificulta la localizacion de la logica de negocio y hace mas costosa la evolucion del sistema.

FSD ofrece una alternativa orientada al dominio y a los casos de uso. Cada modulo se ubica segun el nivel de abstraccion que representa dentro de la aplicacion, y no solo segun su forma tecnica. Esto mejora la mantenibilidad, facilita la escalabilidad del codigo, reduce el acoplamiento entre modulos y hace mas evidente que elementos pueden reutilizarse y cuales deben permanecer cerca de un flujo funcional especifico. En consecuencia, la arquitectura favorece una evolucion incremental del sistema sin perder claridad estructural.

En este proyecto, la arquitectura se articula en torno a las capas `app`, `pages`, `widgets`, `features`, `entities` y `shared`. Cada capa cumple una funcion distinta y establece limites claros para la composicion del frontend. Ademas, dentro de los slices se emplean segmentos como `ui`, `model`, `api`, `lib` y `providers`, que ayudan a separar presentacion, estado, acceso a datos, logica auxiliar y configuracion global.

## Capa `app`

La capa `app` dentro de `src/app` contiene elementos globales que deben inicializarse una sola vez para toda la aplicacion. En el estado actual del proyecto, esta capa se concentra principalmente en `providers`, donde se encuentran piezas como `AuthProvider` y `AuthTokenSync`. Su responsabilidad es preparar el entorno de ejecucion del frontend antes de que las pantallas o los widgets entren en accion.

Esta capa es relevante porque centraliza preocupaciones transversales que no pertenecen a una funcionalidad especifica, por ejemplo la persistencia y sincronizacion del contexto de autenticacion. Gracias a ello, las capas superiores no necesitan encargarse repetidamente de la misma configuracion.

En este proyecto existe ademas una diferenciacion importante entre la carpeta `app/` de `Next.js`, ubicada en la raiz del frontend, y la capa FSD `src/app/`. La primera se utiliza para el `App Router`, es decir, para declarar rutas como `app/login/page.tsx` o `app/projects/[diagramId]/modeling/page.tsx`. La segunda forma parte de la arquitectura FSD y aloja la logica de inicializacion global consumida desde el layout raiz. Esta separacion es relevante porque permite usar el sistema de rutas de Next.js sin mezclarlo con el resto de la organizacion por capas del frontend.

## Capa `pages`

La capa `pages` representa las pantallas completas del sistema. Cada slice de esta capa corresponde a una vista principal asociada a un flujo o ruta concreta del producto. En el proyecto actual aparecen slices como `login`, `projects`, `modeling`, `comparison` y `analysis`.

La funcion de esta capa no es concentrar toda la logica de negocio, sino orquestar la composicion de lo que una ruta necesita para funcionar. Por ejemplo, una pagina puede reunir widgets, features, entidades y funciones de carga de datos del servidor. En este sentido, `pages` actua como la unidad de ensamblaje que conecta el enrutamiento con los modulos funcionales de capas inferiores.

Dentro de esta capa, los slices principales pueden describirse de la siguiente manera:

- `login`: representa la pantalla de autenticacion del sistema.
  - `ui`: contiene el componente principal de la pagina de acceso y la composicion visual asociada al flujo de inicio de sesion.
- `projects`: corresponde a la vista donde se listan y administran los proyectos disponibles.
  - `ui`: reune la pantalla principal y la composicion visual del listado de proyectos.
  - `api`: contiene la carga de datos del servidor necesaria para obtener la informacion inicial de los proyectos.
- `modeling`: representa la pantalla principal de modelado.
  - `ui`: contiene la composicion de la pagina de modelado y articula widgets y features del flujo principal del sistema.
  - `api`: incluye la carga de datos necesaria para hidratar el diagrama desde el servidor.
- `comparison`: corresponde a la vista orientada a comparar esquemas o versiones.
  - `ui`: organiza la composicion visual del flujo de comparacion.
  - `api`: provee la carga inicial de informacion requerida por esta pantalla.
- `analysis`: representa la pantalla dedicada al analisis de metricas y resultados.
  - `ui`: contiene la estructura visual de la pagina de analisis.
  - `api`: incorpora la carga de datos del servidor necesaria para inicializar este flujo.

Una caracteristica importante del proyecto es que varios slices de `pages` cuentan con un segmento `api` que incluye archivos `*.server.ts`, como `getDiagramData.server.ts`, `getComparisonData.server.ts` o `getAnalysisData.server.ts`. Esto evidencia una adaptacion practica de FSD a `Next.js`: la carga de datos del servidor se mantiene cerca de la pagina que la consume, en lugar de dispersarse en servicios globales sin contexto.

La relevancia de esta capa radica en que expresa la intencion de navegacion del sistema. Cuando se analiza una ruta concreta, la capa `pages` permite identificar rapidamente que piezas funcionales participan en ella y como se compone la experiencia de usuario.

## Capa `widgets`

La capa `widgets` agrupa bloques de interfaz de tamaño medio o grande que ya representan secciones completas de una pantalla, pero que todavia no constituyen una pagina por si mismos. En el proyecto destacan slices como `modeling-layout`, `diagram-canvas`, `diagram-session`, `queries-panel` y `statistics-panel`.

Dentro de esta capa, los slices mas representativos pueden entenderse asi:

- `modeling-layout`: organiza la estructura general del entorno de modelado.
  - `ui`: contiene la composicion del layout, la barra lateral, la navegacion lateral y las piezas visuales que estructuran el espacio de trabajo.
- `diagram-canvas`: concentra la representacion visual del diagrama.
  - `ui`: incluye el componente principal del lienzo y elementos graficos complementarios, como conexiones o etiquetas visuales.
- `diagram-session`: encapsula la hidratacion de la sesion del diagrama.
  - `ui`: contiene el componente responsable de inicializar o restaurar el estado necesario para trabajar con el diagrama en otras pantallas.
- `queries-panel`: representa el panel de consultas usado dentro del flujo de modelado.
  - `ui`: agrupa la composicion visual del panel, el listado de consultas y los componentes auxiliares de esa seccion.
- `statistics-panel`: organiza la presentacion del resumen estadistico dentro del flujo de modelado.
  - `ui`: contiene el panel principal y los componentes visuales empleados para mostrar metricas y graficos.

Estos widgets son importantes porque encapsulan composiciones visuales relevantes y reutilizables. Gracias a ello, una pagina puede apoyarse en bloques completos ya estructurados, en lugar de reconstruir continuamente la misma interfaz.

En terminos de FSD, la capa `widgets` cumple una funcion intermedia muy valiosa. Evita que las paginas se conviertan en archivos excesivamente grandes y tambien impide que una feature termine cargando responsabilidades de composicion visual que exceden un caso de uso puntual. Esto favorece la reutilizacion de paneles completos y mejora la legibilidad de las pantallas.

## Capa `features`

La capa `features` contiene las acciones de usuario y los casos de uso de negocio que generan cambios o interacciones relevantes dentro del sistema. En el proyecto actual esta capa incluye slices como `auth`, `manage-projects`, `manage-queries`, `solution-modeling`, `solution-versioning`, `comparison`, `analysis` y `statistics`.

Dentro de esta capa, cada slice responde a una capacidad funcional concreta:

- `auth`: concentra la funcionalidad de autenticacion del sistema.
  - `model`: contiene hooks relacionados con el estado y comportamiento de autenticacion.
  - `login`: actua como un sub-slice especializado del flujo de acceso.
    - `model`: contiene acciones y validaciones del formulario de autenticacion.
    - `ui`: agrupa los componentes visuales del formulario y sus controles asociados.
- `manage-projects`: se enfoca en la creacion, edicion y eliminacion de proyectos.
  - `model`: contiene hooks y logica de soporte para operaciones sobre proyectos.
  - `ui`: agrupa modales y componentes utilizados en la gestion de proyectos.
- `manage-queries`: gestiona la creacion, seleccion y sincronizacion de consultas.
  - `model`: contiene hooks y logica de soporte para operaciones sobre queries.
  - `ui`: agrupa botones, modales y componentes auxiliares del flujo de consultas.
- `solution-modeling`: reune la logica funcional asociada a la construccion y modificacion del diagrama.
  - `model`: contiene hooks para acciones como agregar, editar, eliminar o conectar elementos del modelo.
  - `ui`: agrupa componentes propios del modelado y modales especializados de este flujo.
- `solution-versioning`: encapsula la carga, guardado y duplicacion de versiones de una solucion.
  - `lib`: contiene operaciones funcionales asociadas a persistencia, carga y transformacion de versiones.
  - `ui`: agrupa componentes del encabezado y controles vinculados al versionado.
- `comparison`: concentra el comportamiento funcional del flujo de comparacion.
  - `ui`: contiene los componentes propios de la visualizacion y del contenido lateral de la comparacion.
- `analysis`: se centra en el flujo analitico y la presentacion de resultados de evaluacion.
  - `ui`: contiene layout, dashboard, encabezados y graficos propios del analisis.
- `statistics`: conserva la logica derivada necesaria para calcular indicadores a partir del estado del dominio.
  - `model`: agrupa hooks que transforman el estado de entidades en datos listos para ser mostrados en el panel estadistico.

La relevancia de esta capa es que expresa el comportamiento del sistema desde la perspectiva del usuario. Mientras `entities` modela conceptos del dominio y `widgets` organiza bloques de interfaz, `features` describe que puede hacer el usuario y que logica entra en juego cuando realiza una accion. Esto hace que la arquitectura sea mas comprensible para el desarrollo incremental del producto.

En este proyecto, la capa `features` tambien evidencia una buena separacion entre logica y presentacion. Por ejemplo, en `statistics` la logica derivada de los stores se concentra en hooks dentro de `model`, mientras que el panel visual vive en un widget independiente. Este tipo de decisiones refuerza la idea central de FSD: cada modulo debe quedarse en la capa que mejor represente su responsabilidad real.

## Capa `entities`

La capa `entities` contiene los conceptos fundamentales del dominio. En este frontend aparecen slices como `solution`, `table`, `query` y `user`. Aqui se ubican los tipos que representan el negocio, algunos componentes visuales directamente ligados a esas entidades y la logica que describe su comportamiento propio.

Dentro de esta capa, cada slice cumple un rol especifico dentro del dominio:

- `solution`: es el slice mas amplio del dominio y concentra la representacion general de una solucion modelada.
  - `model`: agrupa los tipos principales, estructuras de datos, stores y selectores relacionados con el estado de la solucion.
  - `lib`: contiene calculos y transformaciones de dominio, como conversiones entre formatos y metricas analiticas.
  - `ui`: reune componentes directamente asociados a la entidad, utilizados para representar soluciones dentro de la interfaz.
- `table`: representa la entidad tabla dentro del diagrama.
  - `ui`: incluye componentes vinculados a la visualizacion de tablas, atributos y cardinalidades.
  - `lib`: incorpora operaciones auxiliares relacionadas con conexiones y comportamiento estructural de las tablas dentro del modelo.
- `query`: encapsula la informacion de las consultas definidas por el usuario.
  - `model/state`: mantiene el store asociado a las queries y su estado global.
  - `ui`: contiene componentes de presentacion relacionados con la visualizacion individual de una consulta.
- `user`: reune la representacion tipada del usuario autenticado.
  - `model`: describe las estructuras de datos necesarias para trabajar con la informacion del usuario en distintas partes del sistema.

La importancia de esta capa reside en que protege el nucleo semantico de la aplicacion. Si se necesitara evolucionar el sistema o reutilizar parte de su dominio en otros flujos, `entities` ofrece un punto estable donde se encuentran las estructuras principales del negocio. De esta forma, las capas superiores pueden construir experiencias y acciones sobre un dominio bien delimitado.

## Capa `shared`

La capa `shared` reune recursos tecnicos genericos que no pertenecen a un dominio funcional concreto. En este proyecto, los principales elementos que la componen son los siguientes:

- `shared/api`: concentra el cliente HTTP, los validadores y el manejo comun de errores para la comunicacion con servicios externos.
- `shared/api/server`: contiene utilidades de acceso a datos en contexto de servidor, especialmente para operaciones autenticadas.
- `shared/ui`: agrupa componentes y primitivas de interfaz reutilizables, como botones, inputs, modales, sidebar, iconos y otros elementos visuales base.
- `shared/i18n`: almacena traducciones y hooks de internacionalizacion para soportar textos reutilizables en distintos idiomas.
- `shared/lib/ids`: contiene utilidades para generacion de identificadores.
- `shared/lib/xyflow`: reune helpers tecnicos relacionados con el manejo del lienzo y conexiones del diagrama.
- `shared/lib/keys`: encapsula funciones auxiliares para generacion y manejo de claves o segmentos de claves.
- `shared/lib/breakpoints`: proporciona soporte responsivo, como hooks para detectar condiciones de visualizacion en distintos tamanos de pantalla.
- `shared/lib/dropdown-context`: centraliza la infraestructura de contexto necesaria para menus desplegables y comportamiento asociado.
- `shared/lib/classnames`: contiene utilidades para composicion y combinacion de clases CSS.
- `shared/lib/image`: agrupa funciones auxiliares relacionadas con carga o transformacion de imagenes.

Su funcion es proveer una base comun reutilizable por el resto de capas, evitando que este tipo de infraestructura tecnica quede dispersa en slices funcionales o de dominio.

La relevancia de `shared` esta en evitar duplicacion y consolidar infraestructura tecnica. Sin esta capa, muchas utilidades terminarian dispersas en features o entities, generando dependencias innecesarias y rompiendo la claridad de la arquitectura. En cambio, al mantener estos recursos en `shared`, el proyecto conserva un punto comun de reutilizacion transversal.

## Los slices dentro de la arquitectura

Dentro de FSD, un `slice` es una unidad funcional o de dominio con un limite semantico claro. En este proyecto, los slices se observan principalmente como carpetas de primer nivel dentro de cada capa. Por ejemplo, `modeling`, `projects` y `analysis` son slices de `pages`; `solution-modeling`, `manage-queries` y `solution-versioning` son slices de `features`; `solution`, `table` y `query` son slices de `entities`; y `diagram-canvas`, `queries-panel` o `statistics-panel` son slices de `widgets`.

La utilidad de trabajar con slices es que permiten que cada parte del sistema evolucione de forma relativamente independiente. Un desarrollador puede entrar directamente al slice responsable de una funcionalidad sin recorrer grandes bloques de codigo inconexo. Ademas, esta forma de organizacion facilita la definicion de APIs publicas mediante archivos `index.ts`, lo que ayuda a controlar mejor las dependencias entre modulos.

En una tesis, esta idea es importante porque demuestra que la arquitectura no solo busca separar archivos, sino construir limites comprensibles entre responsabilidades. Cada slice representa una parte con sentido dentro del sistema y sirve como unidad natural de mantenimiento, pruebas y evolucion.

## Los segments dentro de los slices

Dentro de cada slice aparecen `segments`, es decir, subdirectorios que organizan el contenido segun su rol tecnico. En este proyecto los mas utilizados son `ui`, `model`, `api`, `lib` y `providers`.

El segmento `ui` agrupa componentes visuales y estructuras de presentacion. Se encuentra en practicamente todas las capas y es el lugar donde se materializa la interfaz del usuario. En algunos casos, este segmento incluye subdirectorios adicionales, como `ui/header` o `ui/modals`, para mantener orden interno en slices de mayor tamano.

El segmento `model` alberga hooks, tipos, stores, selectores y logica de estado. En `entities`, por ejemplo, aparecen estructuras como `model/state`, donde se ubican stores globales basados en `Zustand`. En `features`, `model` se usa con frecuencia para encapsular la logica de los casos de uso y evitar que esta quede mezclada con la capa de presentacion.

El segmento `api` se utiliza para funciones de acceso a datos. En `pages` se observa sobre todo en forma de loaders de servidor cercanos a la pantalla correspondiente. En `shared`, en cambio, `api` se presenta como infraestructura generica de comunicacion con servicios externos.

El segmento `lib` contiene logica auxiliar reutilizable, pero siempre condicionada por el contexto de su slice. En `entities/solution/lib`, por ejemplo, se ubican calculos analiticos y conversiones del dominio. En `shared/lib`, en cambio, las utilidades son tecnicas y agnosticas respecto al negocio.

El segmento `providers` aparece en la capa `app` y concentra configuraciones globales basadas en contexto. Su presencia evidencia que el proyecto diferencia entre infraestructura transversal y modulos de negocio.

La relevancia de los segments esta en que introducen una segunda dimension de organizacion. Mientras los slices separan por dominio o responsabilidad funcional, los segments separan por tipo de contenido dentro de cada slice. Esta combinacion mejora la navegabilidad del proyecto y permite mantener cohesion tanto semantica como tecnica.

## Relevancia global de la arquitectura adoptada

La aplicacion presenta una complejidad suficiente como para justificar una arquitectura explicita. No se trata solamente de mostrar formularios o listas, sino de coordinar autenticacion, modelado grafico, sincronizacion de consultas, versionado de soluciones, comparacion de esquemas y analisis de metricas. Ante esta variedad de responsabilidades, la adopcion de Feature-Sliced Design permite evitar una estructura monolitica y desordenada.

La organizacion por capas, slices y segments facilita la mantenibilidad del sistema, ya que cada cambio puede localizarse con mayor rapidez en el nivel adecuado. Tambien favorece la escalabilidad, porque nuevas funcionalidades pueden incorporarse sin deteriorar el orden ya existente. Adicionalmente, mejora la reutilizacion al distinguir que piezas son compartidas, cuales pertenecen al dominio y cuales deben permanecer cercanas a una accion de usuario o a una pantalla concreta.

En conjunto, la arquitectura frontend del proyecto no solo ordena el codigo, sino que hace visible la logica de construccion del sistema. Esto resulta especialmente valioso en un contexto academico, porque permite argumentar que la solucion implementada responde a criterios de modularidad, separacion de responsabilidades y crecimiento sostenible del software.
