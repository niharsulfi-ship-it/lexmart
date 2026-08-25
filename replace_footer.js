const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'admin') processDir(fullPath); // Skip admin for now as we don't know if it has the same footer
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace Services section in footer
            const servicesRegex = /<h4>Services<\/h4>\s*<ul>\s*<li><a href="#">Corporate Law.*?<\/ul>/is;
            const newServices = `<h4>Services</h4>
          <ul>
            <li><a href="service-corporate-law.html">Corporate Law</a></li>
            <li><a href="service-taxation.html">Taxation</a></li>
            <li><a href="service-intellectual-property.html">Intellectual Property</a></li>
            <li><a href="service-business-compliance.html">Business Compliance</a></li>
            <li><a href="service-advisory.html">Advisory &amp; Startup Advisory</a></li>
          </ul>`;
            
            if (servicesRegex.test(content)) {
                content = content.replace(servicesRegex, newServices);
                modified = true;
            }

            // Replace Policies section in footer
            const policiesRegex = /<h4>Policies<\/h4>\s*<ul>\s*<li><a href="#">Privacy Policy.*?<\/ul>/is;
            const newPolicies = `<h4>Policies</h4>
          <ul>
            <li><a href="privacy-policy.html">Privacy Policy</a></li>
            <li><a href="terms-conditions.html">Terms &amp; Conditions</a></li>
            <li><a href="cookie-policy.html">Cookie Policy</a></li>
          </ul>`;
          
            if (policiesRegex.test(content)) {
                content = content.replace(policiesRegex, newPolicies);
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
