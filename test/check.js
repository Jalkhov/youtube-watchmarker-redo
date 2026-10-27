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
const optionsJs = fs.readFileSync(path.join(root, 'content/index.js'), 'utf8');

for (const objMatch of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if (objMatch[1].includes('://') === false && objMatch[1].startsWith('#') === false) {
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

const locales = {};

for (const strLocale of ['en', 'es']) {
    locales[strLocale] = JSON.parse(fs.readFileSync(path.join(root, '_locales', strLocale, 'messages.json'), 'utf8'));
}

assert(manifest.default_locale === 'en', 'default_locale must be en');
assert(Object.keys(locales.en).sort().join() === Object.keys(locales.es).sort().join(), 'en and es locale keys must match');

for (const strField of ['name', 'description']) {
    assert(/^__MSG_[A-Za-z0-9_]+__$/.test(manifest[strField]) === true, strField + ' must be localized');
}

assert(/^__MSG_[A-Za-z0-9_]+__$/.test(manifest.action.default_title) === true, 'action.default_title must be localized');

for (const strValue of [manifest.name, manifest.description, manifest.action.default_title]) {
    const strKey = strValue.slice(6, -2);
    assert(locales.en[strKey] !== undefined && locales.es[strKey] !== undefined, 'missing manifest locale key: ' + strKey);
}

for (const objMatch of html.matchAll(/data-i18n(?:-placeholder|-aria-label)?="([^"]+)"/g)) {
    assert(locales.en[objMatch[1]] !== undefined && locales.es[objMatch[1]] !== undefined, 'missing UI locale key: ' + objMatch[1]);
}

const symbols = new Set([...html.matchAll(/<symbol id="([^"]+)"/g)].map(function(objMatch) {
    return objMatch[1];
}));

assert(symbols.size >= 5, 'inline SVG icon sprite is missing symbols');
assert(html.includes('fontawesome') === false, 'the options page must not reference Font Awesome');
assert(/fa-(regular|solid|brands)/.test(html) === false, 'the options page must not use Font Awesome classes');
assert(html.includes('bootstrap') === false, 'the options page must not reference Bootstrap');
assert(fs.existsSync(path.join(root, 'content/options.css')) === true, 'options.css is missing');
assert(html.includes('--bs-') === false && optionsJs.includes('--bs-') === false, 'options UI must not use Bootstrap CSS variables');
assert(optionsJs.includes(".find('i')") === false, 'options JS must target .icon, not generic <i> elements');

for (const objMatch of html.matchAll(/<use href="#([^"]+)"/g)) {
    assert(symbols.has(objMatch[1]) === true, 'missing SVG symbol: ' + objMatch[1]);
}

for (const objMatch of optionsJs.matchAll(/#(icon-[a-z0-9-]+)/g)) {
    assert(symbols.has(objMatch[1]) === true, 'missing SVG symbol used by JS: ' + objMatch[1]);
}

for (const strFile of ['background.js', 'youtube.js', 'hooks.js', 'content/index.js']) {
    childProcess.execFileSync(process.execPath, ['--check', path.join(root, strFile)]);
}

console.log('ok - ' + files.size + ' referenced files present, JS syntax valid');
