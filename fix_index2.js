const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// The garbled character might be \uFFFD (replacement character)
// Replace 5 of them for stars
content = content.replace(/<span class="stars">[\uFFFD\?]{5}<\/span>/g, '<span class="stars">★★★★★</span>');

// Replace hero text dash
content = content.replace(/matters most[\uFFFD\?]growing/g, 'matters most &mdash; growing');

// Replace FAQ dash
content = content.replace(/7[\uFFFD\?]10 working days/g, '7&ndash;10 working days');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed index.html encoding artifacts');
