// Vercel serves /site.css with max-age=3600, so a redeploy can leave visitors
// on an hour-old stylesheet. Stamp the shared assets with a content hash so a
// changed file is always a new URL.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const ASSETS = ['site.css', 'showcase.css', 'showcase.js'];
const hash = (f) => createHash('sha1').update(readFileSync(f)).digest('hex').slice(0, 8);
const stamps = Object.fromEntries(ASSETS.map((a) => [a, hash(a)]));
for (const file of readdirSync('.').filter((f) => f.endsWith('.html'))) {
  let t = readFileSync(file, 'utf8');
  for (const [asset, v] of Object.entries(stamps))
    t = t.replace(new RegExp(`/${asset.replace('.', '\\.')}(\\?v=[a-f0-9]+)?`, 'g'), `/${asset}?v=${v}`);
  writeFileSync(file, t);
}
console.log('stamped', stamps);
