const fs = require('fs');
const path = require('path');

const consultBtn = `\n      <a href="contact.html" class="btn-consult" style="
        display:inline-flex;
        align-items:center;
        gap:8px;
        padding:10px 20px;
        background:linear-gradient(135deg,#062d80,#1f5cd4);
        color:#fff;
        font-size:14px;
        font-weight:600;
        border-radius:50px;
        text-decoration:none;
        white-space:nowrap;
        box-shadow:0 4px 14px rgba(6,45,128,0.3);
        transition:all .25s ease;
      " onmouseover="this.style.boxShadow='0 6px 20px rgba(6,45,128,0.5)';this.style.transform='translateY(-1px)'" onmouseout="this.style.boxShadow='0 4px 14px rgba(6,45,128,0.3)';this.style.transform='translateY(0)'">
        <svg style="width:15px;height:15px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Book a Consultation
      </a>`;

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

for (const file of files) {
    if (file.startsWith('admin')) continue;
    const fullPath = path.join(__dirname, file);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Only add if not already present
    if (content.includes('Book a Consultation') && content.includes('btn-consult')) {
        console.log('Skipped (already has button):', file);
        continue;
    }

    // Insert button right after </nav> and before </div> inside nav-wrap
    const navEndRegex = /(<\/nav>)(\s*\n\s*<\/div>\s*\n\s*<button class="hamburger")/;
    if (navEndRegex.test(content)) {
        content = content.replace(navEndRegex, `$1${consultBtn}$2`);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', file);
    } else {
        console.log('Pattern not found in:', file);
    }
}
