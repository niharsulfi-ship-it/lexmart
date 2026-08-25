const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'admin' && !file.includes('node_modules') && !file.includes('.git')) {
                processDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace 'Developed by Brand Mindz' with 'Made with ❤️ by Brand Mindz'
            const devByRegex = /<span>Developed by <a href="https:\/\/brandmindz\.com" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Brand Mindz<\/a><\/span>/g;
            if (devByRegex.test(content)) {
                content = content.replace(devByRegex, `<span>Made with ❤️ by <a href="https://brandmindz.com/" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline;">Brand Mindz</a></span>`);
                modified = true;
            }

            // Clean up the corrupted 'Made with ??' text if present
            const madeWithCorruptedRegex = / Made with \?\? by <strong>Brand Mindz<\/strong>\./g;
            if (madeWithCorruptedRegex.test(content)) {
                content = content.replace(madeWithCorruptedRegex, '');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Modified:', fullPath);
            }
        }
    }
}

processDir(__dirname);
