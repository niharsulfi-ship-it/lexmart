const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Replace 5 literal question marks or garbled characters
content = content.replace(/>\?\?\?\?\?</g, '>★★★★★<');
content = content.replace(/>\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD</g, '>★★★★★<');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed stars');
