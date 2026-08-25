const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace everything inside the stars span
content = content.replace(/<span class="stars">.*?<\/span>/g, '<span class="stars">★★★★★</span>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed stars');
