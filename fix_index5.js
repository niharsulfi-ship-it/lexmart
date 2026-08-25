const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace everything inside the stars span with HTML entity stars
content = content.replace(/<span class="stars">.*?<\/span>/g, '<span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed stars using HTML entities');
