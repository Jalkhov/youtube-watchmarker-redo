# AMO submission

Checklist for submitting **Watchmarker Redo for YouTube** to addons.mozilla.org.

## Status

- **Approved and public since 27 October 2026.**
- Public page: https://addons.mozilla.org/firefox/addon/watchmarker-redo-for-youtube/
- Add-on slug: `watchmarker-redo-for-youtube` (ID 3106729).
- Current version: **5.2.1**, version ID 6617236, `public`; reviewed 2026-10-27T16:30:26Z.
- Signed XPI: https://addons.mozilla.org/firefox/downloads/file/5161350/watchmarker_redo_for_youtube-5.2.1.xpi (SHA256 `c47748626b13d0a2daca9b7dc1b907bc7b891c6a06c7d73b73fb888896fd47a3`, 489930 bytes).
- Previous version: 5.2.0, version ID 6617202 (superseded by 5.2.1).
- Privacy policy: set.
- Developer page: https://addons.mozilla.org/en-US/developers/addon/watchmarker-redo-for-youtube/

## 1. Build the package

```bash
node test/check.js
npx web-ext lint --source-dir .
npx web-ext build --source-dir . --overwrite-dest
```

The XPI is written to `web-ext-artifacts/`. No bundler is required: the package is the repository content.

## 2. Listing details

- **Name:** Watchmarker Redo for YouTube
- **Summary:** Marks YouTube videos you have already watched. Community fork of Watchmarker; all data stays in your browser.
- **Category:** Photos, Music & Videos
- **Tags:** youtube, watch, history, video
- **License:** GPL-3.0
- **Website:** https://github.com/Jalkhov/youtube-watchmarker-redo
- **Support:** https://github.com/Jalkhov/youtube-watchmarker-redo/issues
- **Privacy policy:** https://github.com/Jalkhov/youtube-watchmarker-redo/blob/master/PRIVACY.md
- **Data collection:** `none`
- **Listing icon:** uploaded separately from the manifest icon, from [`docs/listing-icon.png`](listing-icon.png) (128×128, orange variant). The manifest icon controls the browser UI; the listing icon is uploaded through the AMO API.

Creating an add-on through the API does not set the listing icon. Upload it with a multipart `PATCH` to `/api/v5/addons/addon/<slug>/` using the field `icon`.

## 3. Suggested description

```markdown
Watchmarker Redo for YouTube marks the videos you have already watched and shows the date next to them. It keeps its own local database, so it does not depend on YouTube's watch history.

This is an unofficial community fork of Watchmarker for YouTube, based on version 5.1.0. It fixes the Firefox MV3 event-page lifecycle that made the extension stop marking videos until it was disabled and re-enabled, restores missing bundled assets, and adds a Shorts selector.

Everything stays in your browser. The extension only contacts youtube.com and m.youtube.com using your existing session. It does not send data to the maintainer and has no telemetry, ads or remote code.

The source code is available on GitHub. Licensed under GPL-3.0.
```

## 4. Notes for the reviewer

- Fork of `sniklaus/youtube-watchmarker` 5.1.0. The name, identifier and orange icon are different so it cannot be confused with the original.
- 5.2.1 only changes the icon (32/64/128 px variants) and has no functional changes; 5.2.0 contains the lifecycle and lookup fixes.
- Main changes: Firefox event-page manifest, synchronous listener registration, port reconnection, lookup retries, restored assets, Shorts selector, `webRequestBlocking` removed.
- No remote code or `eval`. The libraries in `content/` are official unmodified builds; versions and licenses are in `THIRD_PARTY.md`.
- Permissions: `cookies` to authenticate against YouTube, `history` to read local history, `tabs` to update thumbnails, `webRequest` to observe progress, `declarativeNetRequest` for the `youtubei` headers. Full justification is in `README.md` and `PRIVACY.md`.
- Tested with Firefox 158 headless: temporary load, background running, background termination, wake-up by searching from the options page, IndexedDB reads and writes.
- Known limitations: YouTube history deletion with brand accounts (#170/#176), corrupted IndexedDB (#120), progress titles that sometimes store the URL.

### Validator warnings

- `data_collection_permissions` is recognized from Firefox 140 and Firefox for Android 142. `strict_min_version` remains 128 for older ESR installs; the key is ignored there and the extension collects no data either way.
- The three `UNSAFE_VAR_ASSIGNMENT` warnings are inside the unmodified jQuery 3.7.1 build (`content/jquery.js`). The extension does not inject untrusted HTML through jQuery; titles are written with `.text()`.

## 5. Submit a new version

The first version was submitted through the AMO API. The listing metadata lives in [`docs/amo-metadata.json`](amo-metadata.json):

```bash
npx web-ext sign --source-dir . --channel=listed \
  --amo-metadata docs/amo-metadata.json \
  --approval-timeout=0 --timeout=300000 --no-input
```

Credentials come from `~/.web-ext-config.cjs` (mode 600) or from `WEB_EXT_API_KEY` / `WEB_EXT_API_SECRET`.

For a new version, bump `version` in `manifest.json`, update `version.release_notes` in the metadata, rebuild, and run the command again. The same steps can be done in the web form:

1. Go to https://addons.mozilla.org/developers/addon/submit/.
2. Choose **On this site** (public listing) and upload the XPI.
3. Fill in the listing with the details above.
4. Set the data collection declaration to **none**.
5. Submit for review.

If AMO asks for source code because of the minified libraries, attach the repository and `THIRD_PARTY.md`; there is no build process to hide.

## 6. After approval

Done for 5.2.1:

- Downloaded the signed XPI from AMO and replaced the unsigned ZIP on the GitHub release.
- Updated the README, repository description and this status section to point to the public listing.

For the next version: bump `version` in `manifest.json`, add an entry to `CHANGELOG.md`, repeat the checklist and upload the new XPI.
