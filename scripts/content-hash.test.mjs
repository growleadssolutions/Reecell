import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { contentHash } from './content-hash.mjs';

const root = new URL('../', import.meta.url);
const baseline = JSON.parse(await readFile(new URL('docs/seo-migration/content-baseline.json', root), 'utf8'));

for (const [path, expected] of Object.entries(baseline)) {
  test(`${path}: LF/CRLF preserve integrity; content edits fail`, async () => {
    const original = await readFile(new URL(path, root));
    const lf = original.toString('utf8').replace(/\r\n/g, '\n');
    assert.equal(contentHash(original), expected);
    assert.equal(contentHash(Buffer.from(lf)), expected);
    assert.equal(contentHash(Buffer.from(lf.replace(/\n/g, '\r\n'))), expected);
    assert.notEqual(contentHash(Buffer.from(lf + ' ')), expected);
    assert.notEqual(contentHash(Buffer.from(lf.replace(/\n/g, ''))), expected);
  });
}
