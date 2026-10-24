# Watchmarker Redo for YouTube

Community fork of [Watchmarker for Youtube](https://github.com/sniklaus/youtube-watchmarker), the extension that marks YouTube videos you have already watched without relying on YouTube's watch history.

This fork is not affiliated with sniklaus, YouTube or Google. It keeps the original project's GPL-3.0 license.

## Status

- **Version 5.2.0**, the first stable release of this fork.
- **AMO submission in preparation.** It is not published on addons.mozilla.org yet; until it is approved, install it from GitHub or with `about:debugging`.
- Source code and release notes are on [GitHub](https://github.com/Jalkhov/youtube-watchmarker-redo).

## What changed from the original

- Runs as a **Firefox MV3 event page** (`background.scripts`), not as a Chrome service worker.
- Restores assets that were missing from the repository: `idb.js`, jQuery, Moment, Bootstrap, FontAwesome and download.js.
- **Fixes the intermittent failure** that stopped marking videos until the extension was disabled and re-enabled:
  - listeners are registered as soon as the background starts, before IndexedDB is opened;
  - the options page reconnects its ports if Firefox suspends the background;
  - the content script retries lost lookups;
  - the synchronization alarm is no longer reset on every start.
- Adds a **Shorts** selector and preserves the original `Response` when intercepting `fetch`.
- Does not request `webRequestBlocking`, which was unused.
- Declares `data_collection_permissions: none`: it does not collect or send data.

## 5.2.0 highlights

- First installable version of this fork on Firefox 128 or later.
- Base updated to Watchmarker 5.1.0.
- Fixed the event-page lifecycle and the options-page ports.
- Retries lookups and marks when the background is slow to wake up.
- Shorts selector and improved parsing of YouTube responses.
- Documentation for privacy, permissions, third-party libraries and the publishing process.
- Structure and syntax self-check to prevent missing files from shipping again.

Full details are in [CHANGELOG.md](CHANGELOG.md).

## Installation

### From AMO

When review finishes, the link will be in the releases section. The AMO version will be updated manually; this fork has no automatic updates.

### Temporary, for testing

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `manifest.json` in the repository root.

The extension is removed when Firefox closes. This is the quick way to test changes.

### Permanent, unsigned

Firefox Release does not allow installing unsigned XPIs. The options are:

- use **Firefox Developer Edition** or **Nightly** and set `xpinstall.signatures.required` to `false`; or
- sign the XPI as an unlisted add-on from your AMO account.

### Build the XPI

```bash
npx web-ext build --source-dir . --overwrite-dest
```

The file is written to `web-ext-artifacts/`.

## Migrating data from the original extension

The fork uses a different identifier (`youtube-watchmarker-redo@jalkhov`), so Firefox gives it a separate database. To keep your history:

1. In the original extension, open the options and click **Export**.
2. In this fork, open the options and click **Import**.
3. Choose the exported JSON file.
4. Disable the original extension so it does not mark the same videos twice.

You can also start from scratch; the database is created automatically.

## Permissions

| Permission | What it is used for |
| --- | --- |
| `alarms` | Periodic synchronization every 60 minutes. |
| `cookies` | Authenticate requests to YouTube with your own session. |
| `declarativeNetRequest`, `declarativeNetRequestWithHostAccess` | Set the `Origin`, `Referer` and `Sec-Fetch-Mode` headers on requests to `youtubei`. |
| `history` | Read browser history to synchronize watched videos. |
| `scripting` | Inject the CSS that hides progress bars. |
| `storage` | Save preferences and the database size. |
| `tabs` | Find YouTube tabs and update their marks. |
| `webRequest` | Observe YouTube progress requests. |
| `*://www.youtube.com/*`, `*://m.youtube.com/*` | The only sites the extension works with. |

`webRequestBlocking` is not used, no remote code is executed and there are no developer-operated servers. See [PRIVACY.md](PRIVACY.md) for details.

## Development

```bash
node test/check.js
npx web-ext lint --source-dir .
npx web-ext build --source-dir . --overwrite-dest
```

The self-check verifies that the manifest is valid, that every referenced file exists, that `idb.js` loads before `background.js`, and that the JavaScript files have no syntax errors.

To load a development build:

```bash
npx web-ext run --source-dir . --firefox-profile /path/to/a/profile
```

There are no automated browser tests. This release was tested with Firefox 158 in headless mode: extension load, background running, background termination, wake-up by searching from the options page, and IndexedDB reads and writes. The publishing process is documented in [docs/AMO.md](docs/AMO.md).

## Known limitations

- Deleting from YouTube history is still incomplete in some cases, especially with brand accounts (upstream issues #170 and #176).
- If IndexedDB becomes corrupted, the extension cannot repair it by itself (issue #120). Export what you can, use **Reset**, then import again.
- Some progress responses do not include the title, so the video URL is stored as the title. Marking by ID still works; it is corrected the next time the video is watched with a title available.
- This manifest is Firefox-only. Chrome needs a variant with `service_worker`.
- AMO publication is pending review.

## Credits

- [sniklaus](https://github.com/sniklaus/youtube-watchmarker): original project and 5.1.0 base.
- [cflaming](https://github.com/cflaming/youtube-watchmarker): asset restoration and Shorts selector.
- [widike](https://github.com/widike/youtube-watchmarker) and [capische](https://github.com/capische/youtube-watchmarker): ideas and later work on history and watch states.
- [johan456789](https://github.com/johan456789): fork review.

## License

GPL-3.0. See [LICENSE](LICENSE).
