# Privacy Policy — Watchmarker Redo for YouTube

Last updated: 2026-10-24

This extension is an unofficial community fork of Watchmarker for YouTube. It is maintained by [Jalkhov](https://github.com/Jalkhov). It is not affiliated with YouTube, Google or the original author.

## Short version

The developer does not collect, receive, sell or share any data. Everything the extension knows stays in your browser. The extension only contacts YouTube, using the session you already have in Firefox.

## What the extension stores

- **Settings** in `browser.storage.local`: which features are enabled, your preferences and the size of the local database.
- **Watched-video database** in IndexedDB: video identifiers, titles, watch timestamps and watch counts.
- **A short-lived title cache** in memory while the background page is running.

This data never leaves your device. It is not sent to the developer or to any analytics service.

## Network requests

The extension makes requests only to `www.youtube.com` and `m.youtube.com`:

- to look up whether a video is already in your local database;
- to read your YouTube watch history when you enable YouTube synchronization;
- to send the same kind of requests the YouTube web page would send, authenticated with your existing YouTube session.

Those requests go to Google/YouTube and are subject to [Google's privacy policy](https://policies.google.com/privacy). The developer does not operate a server and does not see them.

The extension does **not** use telemetry, crash reporting, advertising, remote configuration or remote code.

## Permissions

- `cookies`: read YouTube session cookies to authenticate requests to YouTube. Cookies are not sent anywhere else.
- `history`: read your browser history to find YouTube videos you have already visited and mark them locally.
- `tabs`: find open YouTube tabs so their thumbnails can be updated when a video is marked.
- `storage`: save your settings locally.
- `alarms`: run the optional periodic synchronization.
- `scripting`: inject the CSS that hides progress bars, if you enable that option.
- `webRequest`: observe YouTube watch-progress requests to mark videos. No request data is stored outside the local database.
- `declarativeNetRequest` / `declarativeNetRequestWithHostAccess`: set the headers YouTube expects on its internal API requests.
- Host permissions for `youtube.com` and `m.youtube.com`: the only sites the extension works with.

## Data deletion

- Use **Reset** in the extension options to delete the local video database.
- Use **Export** first if you want a backup.
- Uninstalling the extension removes its extension storage and IndexedDB database according to Firefox's normal behavior.

## Children

The extension is not directed at children and does not knowingly collect data from anyone.

## Changes

Changes to this policy will be published in this repository. The date at the top will be updated.

## Contact

Open an issue at [github.com/Jalkhov/youtube-watchmarker-redo/issues](https://github.com/Jalkhov/youtube-watchmarker-redo/issues).

---

## Resumen en español

El desarrollador no recibe ni comparte ningún dato. Los ajustes y la base de vídeos vistos se guardan solo en tu Firefox (almacenamiento local e IndexedDB). La extensión únicamente se comunica con YouTube usando tu sesión, para consultar el historial y hacer las mismas peticiones que haría la web. No hay telemetría, publicidad, servidores propios ni código remoto. Puedes borrar los datos con **Reset** en las opciones o desinstalando la extensión.
