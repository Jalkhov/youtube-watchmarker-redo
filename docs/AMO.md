# Publicación en AMO

Checklist para enviar **Watchmarker Redo for YouTube** a addons.mozilla.org.

## 1. Construir el paquete

```bash
node test/check.js
npx web-ext lint --source-dir .
npx web-ext build --source-dir . --overwrite-dest
```

El XPI queda en `web-ext-artifacts/`. No se necesita bundler: el paquete es el contenido del repositorio.

## 2. Datos del listado

- **Nombre:** Watchmarker Redo for YouTube
- **Resumen:** Marca los vídeos de YouTube que ya has visto. Fork comunitario de Watchmarker; todos los datos se quedan en tu navegador.
- **Categoría:** Photos, Music & Videos
- **Etiquetas:** youtube, watch, history, video
- **Licencia:** GPL-3.0
- **Web:** https://github.com/Jalkhov/youtube-watchmarker-redo
- **Soporte:** https://github.com/Jalkhov/youtube-watchmarker-redo/issues
- **Política de privacidad:** https://github.com/Jalkhov/youtube-watchmarker-redo/blob/master/PRIVACY.md
- **Recopilación de datos:** `none`

## 3. Descripción sugerida

```markdown
Watchmarker Redo for YouTube marks the videos you have already watched and shows the date next to them. It keeps its own local database, so it does not depend on YouTube's watch history.

This is an unofficial community fork of Watchmarker for YouTube, based on version 5.1.0. It fixes the Firefox MV3 event-page lifecycle that made the extension stop marking videos until it was disabled and re-enabled, restores missing bundled assets, and adds a Shorts selector.

Everything stays in your browser. The extension only contacts youtube.com and m.youtube.com using your existing session. It does not send data to the maintainer and has no telemetry, ads or remote code.

The source code is available on GitHub. Licensed under GPL-3.0.
```

## 4. Notas para el revisor

- Fork de `sniklaus/youtube-watchmarker` 5.1.0. El nombre y el identificador son distintos para no confundirse con el original.
- Cambios principales: manifest de event page de Firefox, registro síncrono de listeners, reconexión de puertos, reintento de consultas, assets restaurados, selector de Shorts, `webRequestBlocking` eliminado.
- No hay código remoto ni `eval`. Las librerías de `content/` son builds oficiales sin modificar; versiones y licencias en `THIRD_PARTY.md`.
- Permisos: `cookies` para autenticar contra YouTube, `history` para leer el historial local, `tabs` para actualizar miniaturas, `webRequest` para observar el progreso, `declarativeNetRequest` para las cabeceras de `youtubei`. Justificación completa en `README.md` y `PRIVACY.md`.
- Pruebas realizadas con Firefox 158 headless: carga temporal, fondo en ejecución, terminación del fondo, reactivación al buscar desde opciones, escritura y lectura en IndexedDB.
- Limitaciones conocidas: borrado del historial de YouTube en cuentas de marca (#170/#176), base IndexedDB corrupta (#120), títulos de progreso que a veces guardan la URL.

## 5. Enviar

1. Entra en https://addons.mozilla.org/developers/addon/submit/.
2. Elige **On this site** (listado público) y sube el XPI.
3. Rellena el listado con los datos de arriba.
4. Marca la declaración de datos como **none**.
5. Envía a revisión.

Si AMO pide el código fuente por las librerías minificadas, adjunta el repositorio y `THIRD_PARTY.md`; no hay proceso de build que ocultar.

## 6. Después de la aprobación

- Descarga el XPI firmado.
- Crea el release de GitHub con ese XPI y las notas de `CHANGELOG.md`.
- Actualiza el README con el enlace de AMO.
- Para la siguiente versión: sube `version` en `manifest.json`, añade una entrada en `CHANGELOG.md`, repite el checklist y sube el nuevo XPI.
