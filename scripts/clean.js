#!/usr/bin/env node

const fs = require('node:fs');

if (process.argv.includes('--i18n')) {
    fs.rmSync('translations/messages', {force: true, recursive: true});
    fs.rmSync('tmp.js', {force: true});
    process.exit();
}

if (process.argv.includes('--tmp')) {
    fs.rmSync('tmp.js', {force: true});
    process.exit();
}

for (const path of ['dist', 'playground']) {
    fs.rmSync(path, {force: true, recursive: true});
    fs.mkdirSync(path, {recursive: true});
}
