const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Remove internal services span
            const newContent = content.replace(/(<span class="di-text"><strong>[^<]+<\/strong>)<span>[\s\S]*?<\/span><\/span>/g, '$1</span>');
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }

            // Add Brand Mindz to footer
            if (!content.includes('Developed by Brand Mindz')) {
                const footerMatch = content.match(/(<div class="footer-bottom">[\s\S]*?)(<\/div>)/i);
                if (footerMatch) {
                    content = content.replace(/(<div class="footer-bottom">[\s\S]*?)(<\/div>)/i, '$1  <span>Developed by Brand Mindz</span>\n      $2');
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Modified:', fullPath);
            }
        }
    }
}

processDir(__dirname);
