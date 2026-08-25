const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.startsWith('service-') && f.endsWith('.html'));

for (const file of files) {
  const p = path.join(dir, file);
  const content = fs.readFileSync(p, 'utf8');
  const ids = [...content.matchAll(/symbol id="(i-[^"]+)"/g)].map(m => m[1]).sort();
  console.log(`\n=== ${file} ===`);
  console.log(ids.join(', '));
}
