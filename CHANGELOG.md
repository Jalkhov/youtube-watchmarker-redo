# Changelog

All dates are UTC. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the versioning follows [SemVer](https://semver.org/).

## [5.2.0] - 2026-10-24

First stable release of this fork. Based on Watchmarker 5.1.0.

### Added

- Shorts selector (`a.reel-item-endpoint[href*="watch?v="]`).
- `test/check.js` self-check: validates the manifest, referenced files, the `idb.js` load order and JavaScript syntax.
- `data_collection_permissions: { "required": ["none"] }`, required for new extensions on AMO.
- Documentation for privacy, permissions, third-party libraries and AMO publishing.

### Fixed

- The extension did not start in Firefox: the manifest used `service_worker` and `background.js` called `importScripts` in an event page.
- `idb.js`, jQuery, Moment, Bootstrap, FontAwesome and download.js were missing, although the options page and the background referenced them.
- The background could lose events on wake-up because listeners were registered after several `await`s. They are now registered synchronously and data is opened lazily.
- The options page left its ports dead when Firefox suspended the background; it now reconnects and reports an error if a request is interrupted.
- The content script did not retry a lost lookup; it now retries after 1 second. The retry checks `lastError` in a Firefox-compatible way (`null` on successful responses); before, success was mistaken for an error and nothing was marked.
- The synchronization alarm was recreated on every start, resetting the 60-minute period; it is now created only if missing.
- The search button stayed disabled if a query was interrupted; it is now re-enabled.
- The `fetch` wrapper rebuilt the response and lost `url`, `type` and headers; it now returns a clone of the original response.
- `tabs.onUpdated` checks that `objTab.url` exists before using it.

### Changed

- Public name: **Watchmarker Redo for YouTube**.
- Firefox MV3-only manifest (`background.scripts`), with `strict_min_version` 128.0 and its own identifier.
- Removed `webRequestBlocking`, which was unused.
- README and project documentation rewritten in English.

### Release

- Submitted to AMO as a listed add-on on 2026-10-24 (add-on ID 3106729, version ID 6617202). Awaiting review.

### Known limitations

- Deleting from YouTube history is still incomplete in some cases (#170, #176).
- A corrupted IndexedDB database requires exporting, resetting and importing (#120).
- Some progress responses store the video URL as the title when YouTube does not provide the title in that response.
- This manifest does not support Chrome.
