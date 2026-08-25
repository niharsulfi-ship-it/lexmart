const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldStr = 'href="style.css"';
const newStr = 'href="style.css?v=2.1"';

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  let changed = false;

  // Replace any existing style.css query strings as well just in case
  const regex = /href="style\.css(\?v=[0-9.]+)?"/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, newStr);
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Updated cache buster in ${file}`);
  }
}
