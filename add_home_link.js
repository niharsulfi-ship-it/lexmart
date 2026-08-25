const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const oldStr = '<h4>Company</h4>\r\n          <ul>\r\n            <li><a href="about.html">About</a></li>';
const newStr = '<h4>Company</h4>\r\n          <ul>\r\n            <li><a href="index.html">Home</a></li>\r\n            <li><a href="about.html">About</a></li>';

const oldStrUnix = '<h4>Company</h4>\n          <ul>\n            <li><a href="about.html">About</a></li>';
const newStrUnix = '<h4>Company</h4>\n          <ul>\n            <li><a href="index.html">Home</a></li>\n            <li><a href="about.html">About</a></li>';


for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  let changed = false;

  if (content.includes(oldStr)) {
    content = content.replace(oldStr, newStr);
    changed = true;
  } else if (content.includes(oldStrUnix)) {
    content = content.replace(oldStrUnix, newStrUnix);
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(p, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
