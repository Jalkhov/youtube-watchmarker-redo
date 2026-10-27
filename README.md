<p align="center">
  <img src="content/icon.png" alt="Watchmarker Redo for YouTube" width="128" height="128">
</p>

<h1 align="center">Watchmarker Redo for YouTube</h1>

<p align="center">Marks YouTube videos you have already watched, without relying on YouTube's watch history.</p>

<p align="center">
  <a href="https://github.com/Jalkhov/youtube-watchmarker-redo/releases"><img src="https://img.shields.io/github/v/release/Jalkhov/youtube-watchmarker-redo?label=release" alt="Release"></a>
  <a href="https://addons.mozilla.org/firefox/addon/watchmarker-redo-for-youtube/"><img src="https://img.shields.io/amo/v/watchmarker-redo-for-youtube?label=AMO" alt="AMO version"></a>
  <img src="https://img.shields.io/badge/firefox-128%2B-blue" alt="Firefox 128+">
  <img src="https://img.shields.io/badge/data%20collection-none-brightgreen" alt="No data collection">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-blue" alt="GPL-3.0"></a>
</p>

Community fork of [Watchmarker for Youtube](https://github.com/sniklaus/youtube-watchmarker), based on 5.1.0. Not affiliated with sniklaus, YouTube or Google.

## Highlights

- **Survives Firefox's event-page lifecycle.** Listeners are registered synchronously, IndexedDB opens lazily, the options page reconnects its ports and lookups are retried. This fixes the intermittent failure that required disabling and re-enabling the extension.
- **Self-contained.** Restores the bundled assets that were missing from the repository: `idb.js`, jQuery and download.js. Dates use `Intl.DateTimeFormat`. UI icons are inline SVG (no icon font) and the options page uses a small custom stylesheet instead of Bootstrap.
- **Shorts support** and a `fetch` wrapper that preserves the original `Response`.
- **Minimal permissions.** `webRequestBlocking` was removed, and `data_collection_permissions` is `none`.
- **Local by design.** No telemetry, no developer server, no remote code. Only YouTube is contacted, with your existing session.

Version history: [CHANGELOG.md](CHANGELOG.md).

## Install

### AMO

Install from [addons.mozilla.org/firefox/addon/watchmarker-redo-for-youtube](https://addons.mozilla.org/firefox/addon/watchmarker-redo-for-youtube/). Firefox keeps it updated automatically.

### Manual XPI

The latest release includes the Mozilla-signed XPI for offline installs. Prefer AMO so Firefox keeps it updated.

### Temporary

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` in the repository root.

The extension is removed when Firefox closes.

## Migrate from the original

This fork uses a different Gecko ID, so it gets a separate database.

1. In the original extension, open the options and click **Export**.
2. In this fork, open the options and click **Import**.
3. Select the exported JSON, then disable the original to avoid duplicate marks.

## Privacy and permissions

Everything stays in the browser: settings in `storage.local`, watched videos in IndexedDB. The extension only contacts `youtube.com` and `m.youtube.com`. There is no telemetry, analytics, advertising or remote code.

The full permission rationale and data handling are in [PRIVACY.md](PRIVACY.md).

## Development

```bash
node test/check.js
npx web-ext lint --source-dir .
npx web-ext build --source-dir . --overwrite-dest
```

`test/check.js` validates the manifest, referenced files, `idb.js` load order and JavaScript syntax. The package is plain repository content; no bundler is required.

Runtime checks for 5.2.x used Firefox 158 headless: temporary load, background termination and wake-up, options-page requests and IndexedDB access. No automated browser test suite is included.

## Known limitations

- Deleting from YouTube history is incomplete in some cases, especially brand accounts ([#170](https://github.com/sniklaus/youtube-watchmarker/issues/170), [#176](https://github.com/sniklaus/youtube-watchmarker/issues/176)).
- A corrupted IndexedDB database cannot be repaired by the extension ([#120](https://github.com/sniklaus/youtube-watchmarker/issues/120)); export what you can, reset and re-import.
- Some YouTube progress responses omit the title, so the video URL is stored as the title. Marking by ID still works.
- Firefox only. Chrome would need a `service_worker` manifest variant.

## Credits

- [sniklaus](https://github.com/sniklaus/youtube-watchmarker) — original project and 5.1.0 base.
- [cflaming](https://github.com/cflaming/youtube-watchmarker) — restored assets and Shorts selector.
- [widike](https://github.com/widike/youtube-watchmarker), [capische](https://github.com/capische/youtube-watchmarker) — later work on history and watch states.
- [Lucide](https://lucide.dev) — inline SVG icons (ISC).
- [johan456789](https://github.com/johan456789) — fork review.

## License

GPL-3.0. See [LICENSE](LICENSE).

---

<p align="center">Unofficial fork maintained by <a href="https://github.com/Jalkhov">Jalkhov</a>.</p>
