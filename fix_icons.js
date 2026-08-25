const fs = require('fs');
const path = require('path');

const dir = __dirname;

// All icons needed in every service page dropdown
const requiredIcons = {
  'i-rupee':    '<symbol id="i-rupee" viewBox="0 0 24 24"><path d="M6 3h12M6 8h12M15 21 6 8"/><path d="M6 11h3a4 4 0 0 0 0-8H6v13"/></symbol>',
  'i-building': '<symbol id="i-building" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/></symbol>',
};

// Which files are missing which icons
const fixes = {
  'service-corporate-law.html': ['i-rupee'],
  'service-advisory.html':      ['i-building'],
  'service-taxation.html':      ['i-building'],
};

for (const [file, missingIds] of Object.entries(fixes)) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  for (const id of missingIds) {
    if (content.includes(`id="${id}"`)) {
      console.log(`  ${id} already present in ${file}, skipping`);
      continue;
    }
    // Insert before </defs>
    const newSymbol = requiredIcons[id];
    content = content.replace('</defs>', `${newSymbol}\n</defs>`);
    console.log(`  Added ${id} to ${file}`);
  }
  
  fs.writeFileSync(p, content, 'utf8');
  console.log(`Saved ${file}`);
}

console.log('\nDone!');
