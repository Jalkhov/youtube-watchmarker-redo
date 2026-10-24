# Watchmarker for Youtube (fork personal)

Fork personal de [Watchmarker for Youtube](https://github.com/sniklaus/youtube-watchmarker), la extensión que marca los vídeos de YouTube que ya has visto.

**Este fork no está publicado en addons.mozilla.org (AMO) y, por ahora, no se va a subir allí.** No recibirás actualizaciones automáticas: las versiones se instalan manualmente desde este repositorio. Tampoco está publicado en la Chrome Web Store; está pensado para Firefox.

## Qué cambia respecto al original

La base es la versión 5.1.0 del repositorio original. Este fork añade:

- **Arreglo del fallo intermitente** por el que la extensión dejaba de marcar vídeos y había que desactivarla y activarla otra vez. La causa era la muerte del *event page* de Manifest V3: los listeners se registraban después de varias operaciones asíncronas, así que el evento que despertaba la extensión se perdía, y la página de opciones se quedaba con puertos desconectados para siempre (`Attempt to postMessage on disconnected port`).
- **Listener registrados de forma síncrona** al arrancar, base de datos IndexedDB abierta de forma perezosa y reintentada si falla, y reconexión automática de los puertos de la página de opciones.
- **Reintento de las consultas** en la página de YouTube cuando el fondo no responde, en vez de dejar el vídeo sin marcar hasta recargar.
- **Archivos que faltaban en el repositorio**: `idb.js`, `jquery.js`, `moment.js`, `download.js`, Bootstrap, Font Awesome y sus fuentes. Sin ellos la extensión no arrancaba en Firefox y la página de opciones salía rota.
- **Manifest compatible con Firefox**: `background.scripts` (Firefox no usa `service_worker` en Manifest V3), `webRequestBlocking` y un ID propio de Gecko.
- **La alarma de sincronización ya no se reinicia** en cada arranque del *event page*, por lo que la sincronización automática puede dispararse.
- **El hook de `fetch` de YouTube conserva la respuesta original** (antes la reconstruía y perdía `url`, `type` y otras propiedades).
- **Selector añadido para Shorts** que usan `watch?v=`.

## Instalación

### Prueba rápida

1. Abre `about:debugging#/runtime/this-firefox`.
2. Pulsa **Cargar complemento temporal**.
3. Selecciona el `manifest.json` de este directorio.

La extensión desaparece al cerrar Firefox y el almacenamiento temporal puede perderse. Para uso diario, instala un XPI sin firmar en Firefox Developer Edition o Nightly con `xpinstall.signatures.required` en `false`, o genera el XPI y fírmalo con tu propia cuenta de AMO para uso privado.

### Migrar tu historial desde la versión de AMO

Este fork usa el ID `youtube-watchmarker-redo@jalkhov`, distinto del original, así que no comparte la base de datos:

1. En la versión original: **Ajustes → Database → Export**.
2. En este fork: **Ajustes → Database → Import** y selecciona el archivo `.database`.

El fork puede convivir instalado con la versión de AMO, pero solo una de las dos debe quedarse activa marcando vídeos.

## Estado

Es un fork personal, sin garantías ni soporte. Los cambios se probaron cargando la extensión en Firefox; no hay suite de pruebas automatizada. Si algo falla, revisa la consola del complemento en `about:debugging`.

## Créditos

- Autor original: [sniklaus](https://github.com/sniklaus) y sus [contribuidores](https://github.com/sniklaus/youtube-watchmarker#contributors).
- Los archivos vendored que faltaban se recuperaron del paquete firmado de AMO y del fork de [cflaming](https://github.com/cflaming/youtube-watchmarker), que documentó el mismo problema.
- Ideas y correcciones revisadas en los forks de [widike](https://github.com/widike/youtube-watchmarker), [capische](https://github.com/capische/youtube-watchmarker) y [johan456789](https://github.com/johan456789/youtube-watchmarker).

## Licencia

Consulta el archivo [LICENSE](LICENSE) del proyecto original.
