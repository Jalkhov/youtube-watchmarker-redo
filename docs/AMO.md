# AMO submission

Checklist for submitting **Watchmarker Redo for YouTube** to addons.mozilla.org.

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

## 3. Suggested description

```markdown
Watchmarker Redo for YouTube marks the videos you have already watched and shows the date next to them. It keeps its own local database, so it does not depend on YouTube's watch history.

This is an unofficial community fork of Watchmarker for YouTube, based on version 5.1.0. It fixes the Firefox MV3 event-page lifecycle that made the extension stop marking videos until it was disabled and re-enabled, restores missing bundled assets, and adds a Shorts selector.

Everything stays in your browser. The extension only contacts youtube.com and m.youtube.com using your existing session. It does not send data to the maintainer and has no telemetry, ads or remote code.

The source code is available on GitHub. Licensed under GPL-3.0.
```

## 4. Notes for the reviewer

- Fork of `sniklaus/youtube-watchmarker` 5.1.0. The name and identifier are different so it cannot be confused with the original.
- Main changes: Firefox event-page manifest, synchronous listener registration, port reconnection, lookup retries, restored assets, Shorts selector, `webRequestBlocking` removed.
- No remote code or `eval`. The libraries in `content/` are official unmodified builds; versions and licenses are in `THIRD_PARTY.md`.
- Permissions: `cookies` to authenticate against YouTube, `history` to read local history, `tabs` to update thumbnails, `webRequest` to observe progress, `declarativeNetRequest` for the `youtubei` headers. Full justification is in `README.md` and `PRIVACY.md`.
- Tested with Firefox 158 headless: temporary load, background running, background termination, wake-up by searching from the options page, IndexedDB reads and writes.
- Known limitations: YouTube history deletion with brand accounts (#170/#176), corrupted IndexedDB (#120), progress titles that sometimes store the URL.

## 5. Submit

1. Go to https://addons.mozilla.org/developers/addon/submit/.
2. Choose **On this site** (public listing) and upload the XPI.
3. Fill in the listing with the details above.
4. Set the data collection declaration to **none**.
5. Submit for review.

If AMO asks for source code because of the minified libraries, attach the repository and `THIRD_PARTY.md`; there is no build process to hide.

## 6. After approval

- Download the signed XPI.
- Create the GitHub release with that XPI and the notes from `CHANGELOG.md`.
- Update the README with the AMO link.
- For the next version: bump `version` in `manifest.json`, add an entry to `CHANGELOG.md`, repeat the checklist and upload the new XPI.
