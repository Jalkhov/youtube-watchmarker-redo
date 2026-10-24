# Changelog

Todas las fechas están en UTC. El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el versionado [SemVer](https://semver.org/lang/es/).

## [5.2.0] - 2026-10-24

Primera versión estable de este fork. Base: Watchmarker 5.1.0.

### Añadido

- Selector de Shorts (`a.reel-item-endpoint[href*="watch?v="]`).
- Auto-check `test/check.js`: valida el manifest, los archivos referenciados, el orden de `idb.js` y la sintaxis de los JS.
- `data_collection_permissions: { "required": ["none"] }`, obligatorio para nuevas extensiones en AMO.
- Documentación de privacidad, permisos, librerías de terceros y publicación en AMO.

### Corregido

- La extensión no arrancaba en Firefox: el manifest usaba `service_worker` y `background.js` llamaba a `importScripts` en una event page.
- Faltaban `idb.js`, jQuery, Moment, Bootstrap, FontAwesome y download.js, referenciados por la página de opciones y el fondo.
- El fondo podía perder eventos al despertar porque los listeners se registraban después de varios `await`. Ahora se registran de forma síncrona y los datos se abren de forma perezosa.
- La página de opciones dejaba los puertos muertos cuando Firefox dormía el fondo; ahora reconecta y muestra un error si una petición se interrumpe.
- El content script no reintentaba un lookup perdido; ahora reintenta a los 1 s. El reintento comprueba `lastError` de forma compatible con Firefox, que lo pone a `null` en las respuestas correctas; antes se confundía con un error y no marcaba.
- La alarma de sincronización se recreaba en cada arranque, reiniciando el período de 60 minutos; ahora solo se crea si no existe.
- El botón de búsqueda se quedaba deshabilitado si la consulta se cortaba; ahora se reactiva.
- El wrapper de `fetch` reconstruía la respuesta y perdía `url`, `type` y cabeceras; ahora devuelve la respuesta original clonada.
- Se comprueba que `objTab.url` exista antes de usarlo en `tabs.onUpdated`.

### Cambiado

- Nombre público: **Watchmarker Redo for YouTube**.
- Manifest solo para Firefox MV3 (`background.scripts`), con `strict_min_version` 128.0 y un identificador propio.
- Se eliminó `webRequestBlocking`, que no se usaba.
- README reescrito en español, con resumen en inglés para revisores de AMO.

### Limitaciones conocidas

- El borrado del historial de YouTube sigue incompleto en algunos casos (#170, #176).
- Una base IndexedDB corrupta requiere exportar, resetear e importar (#120).
- Algunos progresos guardan la URL como título si YouTube no entrega el título en esa respuesta.
- No hay soporte para Chrome en este manifest.
