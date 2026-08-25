const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldStr = '<span>Developed by Brand Mindz</span>';
const newStr = '<span>Developed by <a href="https://brandmindz.com" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Brand Mindz</a></span>';

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  let changed = false;

  if (content.includes(oldStr)) {
    content = content.replaceAll(oldStr, newStr);
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Updated link in ${file}`);
  }
}
