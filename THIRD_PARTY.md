# Third-party libraries

These files are unmodified release builds shipped with the extension. They are not fetched at runtime.

| File | Project | Version | License | Source |
| --- | --- | --- | --- | --- |
| `content/jquery.js` | jQuery | 3.7.1 | MIT | https://jquery.com/download/ |
| `content/moment.js` | Moment.js | 2.30.1 | MIT | https://momentjs.com/downloads/moment.min.js |
| `content/bootstrap.css` | Bootstrap | 5.3.7 | MIT | https://getbootstrap.com/docs/5.3/getting-started/download/ |
| `content/index.html` (inline icons) | Lucide | 1.62.0 | ISC | https://lucide.dev |
| `content/download.js` | download.js | 4.21 | MIT | http://danml.com/download.html |
| `idb.js` | idb | 8.0.3 | ISC | https://www.npmjs.com/package/idb |

## Notes for reviewers

- All libraries are the official minified distributions, without patches.
- `idb.js` is the UMD build and exposes the `idb` global used by `background.js`.
- Icons are inlined as SVG symbols in `content/index.html`; there is no icon font or icon stylesheet. They are Lucide's `square`, `square-check`, `search`, `trash-2` and `loader-circle` (v1.62.0).
- Source maps are not included in the release package.
- If AMO requires unminified sources for review, the upstream URLs above provide the exact published releases.
- The `UNSAFE_VAR_ASSIGNMENT` warnings reported for `content/jquery.js` come from jQuery's internal `innerHTML` assignments. This extension does not pass untrusted HTML to jQuery; video titles are written with `.text()`.

## License texts

- MIT: https://opensource.org/license/mit
- ISC: https://opensource.org/license/isc-license-txt
