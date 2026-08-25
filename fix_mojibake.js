const fs = require('fs');
const filepath = 'c:/Users/sulfi/OneDrive/Desktop/BrainMindz/lexmart/lex1/index.html';
let text = fs.readFileSync(filepath, 'utf8');

const replacements = {
  'â€”': '—',
  'â€“': '–',
  'â˜…': '★',
  'âˆ’': '−',
  'à¤ªà¤¾à¤µà¤°à¤—à¥ à¤°à¤¿à¤¡': 'पावरग्रिड',
  'à¤¤à¤¡à¤¼à¤¶à¤¨': 'तड़शन',
  'â€™': "'"
};

for (const [k, v] of Object.entries(replacements)) {
  text = text.split(k).join(v);
}

fs.writeFileSync(filepath, text, 'utf8');
console.log('Replacements done.');
