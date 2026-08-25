const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.startsWith('service-') && f.endsWith('.html'));

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  let changed = false;

  // Regex to match the Learn More buttons, capturing any indentation to remove it cleanly
  const regex = /[ \t]*<button class="btn btn-outline" id=".*?">Learn More<\/button>\r?\n?/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, '');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Removed Learn More buttons from ${file}`);
  }
}
