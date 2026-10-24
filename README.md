# Watchmarker Redo for YouTube

Fork comunitario de [Watchmarker for Youtube](https://github.com/sniklaus/youtube-watchmarker), la extensión que marca los vídeos de YouTube que ya has visto sin depender del historial de YouTube.

Este fork no está afiliado a sniklaus, a YouTube ni a Google. Mantiene la licencia GPL-3.0 del proyecto original.

## Estado

- **Versión 5.2.0**, primera versión estable de este fork.
- **Envío a AMO en preparación.** Todavía no está publicado en addons.mozilla.org; hasta que se apruebe, instálalo desde GitHub o con `about:debugging`.
- El código fuente y las notas de cada versión están en [GitHub](https://github.com/Jalkhov/youtube-watchmarker-redo).

## Qué cambia respecto al original

- Funciona como **event page de Firefox MV3** (`background.scripts`), no como service worker de Chrome.
- Recupera los assets que faltaban en el repositorio: `idb.js`, jQuery, Moment, Bootstrap, FontAwesome y download.js.
- **Arregla el fallo intermitente** que dejaba de marcar vídeos hasta desactivar y reactivar la extensión:
  - los listeners se registran en cuanto arranca el fondo, antes de abrir IndexedDB;
  - la página de opciones reconecta sus puertos si Firefox duerme el fondo;
  - el content script reintenta las consultas que se pierden;
  - la alarma de sincronización ya no se reinicia en cada arranque.
- Añade el selector de **Shorts** y conserva la `Response` original al interceptar `fetch`.
- No solicita `webRequestBlocking`, que no se usaba.
- Declara `data_collection_permissions: none`: no recopila ni envía datos.

## Novedades de 5.2.0

- Primera versión instalable de este fork en Firefox 128 o superior.
- Base actualizada a Watchmarker 5.1.0.
- Corrección del ciclo de vida de la event page y de los puertos de la página de opciones.
- Reintento de lookups y de marcas cuando el fondo tarda en despertar.
- Selector de Shorts y mejora del parseo de respuestas de YouTube.
- Documentación de privacidad, permisos, librerías de terceros y proceso de publicación.
- Auto-check de estructura y sintaxis para evitar que vuelvan a faltar archivos.

El detalle completo está en [CHANGELOG.md](CHANGELOG.md).

## Instalación

### Desde AMO

Cuando la revisión termine, el enlace estará en la sección de releases. La versión de AMO se actualizará manualmente; este fork no tiene actualizaciones automáticas.

### Temporal, para probar

1. Abre `about:debugging#/runtime/this-firefox`.
2. Pulsa **Cargar complemento temporal**.
3. Selecciona `manifest.json` en la raíz del repositorio.

La extensión se descarga al cerrar Firefox. Es la forma rápida de probar cambios.

### Permanente sin firmar

Firefox Release no permite instalar XPIs sin firmar. Las opciones son:

- usar **Firefox Developer Edition** o **Nightly** y poner `xpinstall.signatures.required` en `false`; o
- firmar el XPI como complemento no listado desde tu cuenta de AMO.

### Compilar el XPI

```bash
npx web-ext build --source-dir . --overwrite-dest
```

El archivo queda en `web-ext-artifacts/`.

## Migrar los datos de la extensión original

El fork usa otro identificador (`youtube-watchmarker-redo@jalkhov`), así que Firefox le da una base de datos distinta. Para conservar el historial:

1. En la extensión original, abre las opciones y pulsa **Export**.
2. En este fork, abre las opciones y pulsa **Import**.
3. Elige el JSON exportado.
4. Desactiva la extensión original para que no marque dos veces los mismos vídeos.

También puedes empezar de cero; la base se crea sola.

## Permisos

| Permiso | Para qué se usa |
| --- | --- |
| `alarms` | Sincronización periódica cada 60 minutos. |
| `cookies` | Autenticar las peticiones a YouTube con tu propia sesión. |
| `declarativeNetRequest`, `declarativeNetRequestWithHostAccess` | Ajustar las cabeceras `Origin`, `Referer` y `Sec-Fetch-Mode` de las peticiones a `youtubei`. |
| `history` | Leer el historial del navegador para sincronizar vídeos vistos. |
| `scripting` | Insertar el CSS que oculta las barras de progreso. |
| `storage` | Guardar preferencias y el tamaño de la base. |
| `tabs` | Localizar pestañas de YouTube y actualizar sus marcas. |
| `webRequest` | Observar las peticiones de progreso de YouTube. |
| `*://www.youtube.com/*`, `*://m.youtube.com/*` | Único sitio con el que trabaja la extensión. |

No se usa `webRequestBlocking`, no se ejecuta código remoto y no hay servidores propios. Más detalle en [PRIVACY.md](PRIVACY.md).

## Desarrollo

```bash
node test/check.js
npx web-ext lint --source-dir .
npx web-ext build --source-dir . --overwrite-dest
```

El auto-check comprueba que el manifest sea válido, que existan todos los archivos referenciados, que `idb.js` se cargue antes que `background.js` y que los JS no tengan errores de sintaxis.

Para cargar una versión de desarrollo:

```bash
npx web-ext run --source-dir . --firefox-profile /ruta/a/un/perfil
```

No hay tests automatizados de navegador. Las pruebas de esta versión se hicieron con Firefox 158 en modo headless: carga de la extensión, fondo en ejecución, terminación del fondo, reactivación al buscar desde las opciones y escritura/lectura en IndexedDB. El proceso de publicación está en [docs/AMO.md](docs/AMO.md).

## Limitaciones conocidas

- El borrado del historial de YouTube sigue siendo incompleto en algunos casos, sobre todo con cuentas de marca (issues upstream #170 y #176).
- Si IndexedDB se corrompe, la extensión no puede repararla sola (issue #120). Exporta lo que puedas, usa **Reset** y vuelve a importar.
- En algunas respuestas de progreso YouTube no incluye el título y se guarda la URL del vídeo como título. La marca por identificador sigue funcionando; se corrige al volver a ver el vídeo con un título disponible.
- Este manifest es solo para Firefox. Chrome necesita una variante con `service_worker`.
- La publicación en AMO está pendiente de revisión.

## Créditos

- [sniklaus](https://github.com/sniklaus/youtube-watchmarker): proyecto original y base 5.1.0.
- [cflaming](https://github.com/cflaming/youtube-watchmarker): restauración de assets y selector de Shorts.
- [widike](https://github.com/widike/youtube-watchmarker) y [capische](https://github.com/capische/youtube-watchmarker): ideas y trabajo posterior sobre historial y estados.
- [johan456789](https://github.com/johan456789): revisión del fork.

## Licencia

GPL-3.0. Consulta [LICENSE](LICENSE).

## English summary

Unofficial community fork of Watchmarker for YouTube, based on version 5.1.0. It fixes the Firefox MV3 event-page lifecycle that made the extension stop marking videos until it was disabled and re-enabled. No data is collected, stored remotely or sent to the maintainer; everything stays in the browser and the extension only talks to YouTube. Not yet published on addons.mozilla.org. Licensed under GPL-3.0.
