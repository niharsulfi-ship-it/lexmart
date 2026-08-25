const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['admin', 'images', 'api'].includes(file)) processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // 1. Fix hero h1: wrap "Simplifying Compliance." in a black-colored span
            if (file === 'index.html') {
                const heroH1Regex = /<h1>Simplifying Compliance\.<br>/;
                if (heroH1Regex.test(content) && !content.includes('<span class="hero-black">')) {
                    content = content.replace(heroH1Regex, '<h1><span class="hero-black">Simplifying Compliance.</span><br>');
                    modified = true;
                }
            }

            // 2. Fix footer address: "Lexmart Corporate Solutions LLP" on one line using nowrap
            const addressRegex = /<span>Lexmart Corporate Solutions LLP<br>/g;
            if (addressRegex.test(content)) {
                content = content.replace(/<span>Lexmart Corporate Solutions LLP<br>/g,
                    '<span><span style="white-space:nowrap;">Lexmart Corporate Solutions LLP</span><br>');
                modified = true;
            }

            // 3. Replace services.html links in nav to point to service-corporate-law.html or index.html#services
            //    In Company nav: "Services" link -> index.html#services
            content = content.replace(/href="services\.html"/g, 'href="service-corporate-law.html"');
            if (!modified && content !== fs.readFileSync(fullPath, 'utf8').toString()) modified = true;

            // 4. Reduce header logo from 160px -> 130px in all pages
            const headerLogoRegex = /(images\/lexmart_logo\.png[^>]*style="height:)160px(; width:auto; object-fit:contain;")/g;
            if (headerLogoRegex.test(content)) {
                content = content.replace(/(images\/lexmart_logo\.png[^>]*style="height:)160px(; width:auto; object-fit:contain;")/g, '$1130px$2');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated:', file);
            }
        }
    }
}

// Re-read files to get fresh content before comparing for services.html replacement
const allFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));
for (const file of allFiles) {
    if (['admin', 'images', 'api'].some(d => file.startsWith(d))) continue;
    const fullPath = path.join(__dirname, file);
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;

    // 1. Fix hero h1
    if (file === 'index.html') {
        if (/<h1>Simplifying Compliance\.<br>/.test(content) && !content.includes('<span class="hero-black">')) {
            content = content.replace(/<h1>Simplifying Compliance\.<br>/, '<h1><span class="hero-black">Simplifying Compliance.</span><br>');
            modified = true;
        }
    }

    // 2. Fix footer address nowrap
    if (/<span>Lexmart Corporate Solutions LLP<br>/.test(content)) {
        content = content.replace(/<span>Lexmart Corporate Solutions LLP<br>/g,
            '<span><span style="white-space:nowrap;">Lexmart Corporate Solutions LLP</span><br>');
        modified = true;
    }

    // 3. Replace services.html nav links
    if (/href="services\.html"/.test(content)) {
        content = content.replace(/href="services\.html"/g, 'href="service-corporate-law.html"');
        modified = true;
    }

    // 4. Reduce header logo size to 130px
    if (/(images\/lexmart_logo\.png[^>]*style="height:)160px/.test(content)) {
        content = content.replace(/(images\/lexmart_logo\.png[^>]*style="height:)160px(; width:auto; object-fit:contain;")/g, '$1130px$2');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', file);
    }
}
