const fs = require('fs');
const filepath = 'c:/Users/sulfi/OneDrive/Desktop/BrainMindz/lexmart/lex1/index.html';
let text = fs.readFileSync(filepath, 'utf8');

// Also remove Â from Â©
text = text.replace(/Â©/g, '©');
text = text.replace(/à¤ªà¤¾à¤µà¤°à¤—à¥ à¤°à¤¿à¤¡/g, 'पावरग्रिड');

fs.writeFileSync(filepath, text, 'utf8');
console.log('Fixes done.');
