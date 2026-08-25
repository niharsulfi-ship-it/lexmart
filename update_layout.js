const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'admin') processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // 1. Add Team page to nav
            const desktopNavRegex = /(<\/div>\s*<\/li>\s*)(<a href="blogs\.html">Blogs<\/a>)/i;
            if (desktopNavRegex.test(content) && !content.includes('<a href="team.html">Team</a>')) {
                content = content.replace(desktopNavRegex, '$1<a href="team.html">Team</a>\n        $2');
                modified = true;
            }
            const mobileNavRegex = /(<\/div>)<a href="blogs\.html">Blogs<\/a>/i;
            if (mobileNavRegex.test(content) && !content.includes('>Team</a><a href="blogs.html">')) {
                content = content.replace(mobileNavRegex, '$1<a href="team.html">Team</a><a href="blogs.html">Blogs</a>');
                modified = true;
            }

            // 2. Reduce header logo size (from 260px to 220px)
            const headerLogoRegex = /(<img src="images\/lexmart_logo\.png" alt="Lexmart Logo" style="height:)260px(; width:auto; object-fit:contain;">)/;
            if (headerLogoRegex.test(content)) {
                content = content.replace(headerLogoRegex, '$1200px$2'); // Changed to 200px for a bit more reduction
                modified = true;
            }

            // 3. Increase footer logo size (from 100px to 140px)
            const footerLogoRegex = /(<img src="images\/white_logo\.png" alt="Lexmart Logo"\s*style="height:)100px(; width:auto; object-fit:contain; border-radius:8px;">)/;
            if (footerLogoRegex.test(content)) {
                content = content.replace(footerLogoRegex, '$1140px$2');
                modified = true;
            }

            // 4. Remove "View Our Full Team" button from about.html
            if (file === 'about.html') {
                const teamBtnRegex = /<div style="text-align: center; margin-top: 48px;">\s*<a href="team\.html" class="btn btn-teal"[\s\S]*?<\/svg><\/a>\s*<\/div>/i;
                if (teamBtnRegex.test(content)) {
                    content = content.replace(teamBtnRegex, '');
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
