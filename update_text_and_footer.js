const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'admin' && file !== 'images' && file !== 'api') processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // 1. Team page banner
            if (file === 'team.html') {
                const bannerRegex = /url\('images\/about\.webp'\)/g;
                if (bannerRegex.test(content)) {
                    content = content.replace(bannerRegex, "url('images/team_banner.jpg')");
                    modified = true;
                }
            }

            // 2. index.html text replacements
            if (file === 'index.html') {
                const titleRegex = /Legal Solutions<br>That <span class="accent">Protect and<\/span><br><span class="accent">Grow<\/span> Your\s*Business/is;
                if (titleRegex.test(content)) {
                    content = content.replace(titleRegex, 'Simplifying Compliance.<br>Strengthening Your<br><span class="accent">Business.</span>');
                    modified = true;
                }
                const subtitleRegex = /TRUSTED LEGAL & BUSINESS ADVISORS/i;
                if (subtitleRegex.test(content)) {
                    content = content.replace(subtitleRegex, 'EXPERT LEGAL & BUSINESS ADVISORS');
                    modified = true;
                }
            }


            // 4. Global address replacement (in footer and contact page)
            // Footer address
            const oldAddressFooterRegex = /<span>6, Ground Floor, Ashish Commercial Complex, Plot No\. 6, LSC, New Rajdhani\s*Enclave, Vikas Marg,\s*Preet Vihar, New Delhi - 110092<\/span>/is;
            if (oldAddressFooterRegex.test(content)) {
                content = content.replace(oldAddressFooterRegex, '<span>Lexmart Corporate Solutions LLP<br>I-23, L.G.F., Lajpat Nagar- III,<br>New Delhi- 110024.</span>');
                modified = true;
            }

            // Contact page main address
            if (file === 'contact.html') {
                const oldAddressContactRegex = /<span>6, Ground Floor, Ashish Commercial Complex,<br>Plot No\. 6, LSC, New Rajdhani\s*Enclave, Vikas\s*Marg,<br>Preet Vihar, New Delhi - 110092<\/span>/is;
                if (oldAddressContactRegex.test(content)) {
                    content = content.replace(oldAddressContactRegex, '<span>Lexmart Corporate Solutions LLP<br>I-23, L.G.F., Lajpat Nagar- III,<br>New Delhi- 110024.</span>');
                    modified = true;
                }
            }

            // Footer email and phone global replacements
            const oldEmailRegex = /<span>hello@lexmart\.com<\/span>/g;
            if (oldEmailRegex.test(content)) {
                content = content.replace(oldEmailRegex, '<span><a href="mailto:connect@lexmart.co.in">connect@lexmart.co.in</a></span>');
                modified = true;
            }

            const oldPhoneRegex = /<span>\+91 99990-28148<br>\+91 98115-41004<\/span>/g;
            if (oldPhoneRegex.test(content)) {
                content = content.replace(oldPhoneRegex, '<span><a href="tel:+919999028148">+91 99990-28148</a><br><a href="tel:+919811541004">+91 98115-41004</a></span>');
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
