'use strict';

// Small self-check for the things that broke in the repo: missing files,
// a Firefox-incompatible background entry and invalid JS.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));

const files = new Set([
    manifest.options_ui.page,
    ...manifest.background.scripts,
    ...Object.values(manifest.icons || {}),
    ...manifest.content_scripts.flatMap(function(objScript) {
        return objScript.js;
    }),
]);

const html = fs.readFileSync(path.join(root, manifest.options_ui.page), 'utf8');

for (const objMatch of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (objMatch[1].includes('://') === false) {
        files.add(path.join(path.dirname(manifest.options_ui.page), objMatch[1]));
    }
}

for (const strFile of files) {
    assert(fs.existsSync(path.join(root, strFile)) === true, 'missing file: ' + strFile);
}

assert(manifest.background.scripts[0] === 'idb.js', 'idb.js must load before background.js');
assert(manifest.background.scripts.includes('background.js') === true, 'background.js must be loaded');

assert(manifest.permissions.includes('webRequestBlocking') === false, 'webRequestBlocking is unused and must not be requested');
assert(manifest.browser_specific_settings.gecko.data_collection_permissions.required.includes('none') === true, 'AMO requires data_collection_permissions');

for (const strFile of ['background.js', 'youtube.js', 'hooks.js', 'content/index.js']) {
    childProcess.execFileSync(process.execPath, ['--check', path.join(root, strFile)]);
}

console.log('ok - ' + files.size + ' referenced files present, JS syntax valid');
