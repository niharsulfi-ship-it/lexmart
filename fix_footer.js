const fs = require('fs');
const path = require('path');

const correctFooter = `  <footer>
    <div class="container">
      <div class="footer-grid">
        <!-- Brand -->
        <div>
          <a href="index.html" class="footer-logo" style="text-decoration: none;">
            <img src="images/white_logo.png" alt="Lexmart Logo"
              style="height:140px; width:auto; object-fit:contain; border-radius:8px;">
          </a>
          <p>Legal and business consulting for startups, SMEs, and enterprises &ndash; from incorporation to ongoing compliance.</p>
          <div class="social-row">
            <a class="social-circle" href="#"><svg class="icon" style="width:16px;height:16px;">
                <use href="#i-linkedin" />
              </svg></a>
            <a class="social-circle" href="#"><svg class="icon" style="width:16px;height:16px;">
                <use href="#i-twitter" />
              </svg></a>
            <a class="social-circle" href="#"><svg class="icon" style="width:16px;height:16px;">
                <use href="#i-facebook" />
              </svg></a>
            <a class="social-circle" href="#"><svg class="icon" style="width:16px;height:16px;">
                <use href="#i-instagram" />
              </svg></a>
          </div>
        </div>
        <!-- Company -->
        <div>
          <h4>Company</h4>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="blogs.html">Blogs</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <!-- Services -->
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="service-corporate-law.html">Corporate Law</a></li>
            <li><a href="service-taxation.html">Taxation</a></li>
            <li><a href="service-intellectual-property.html">Intellectual Property</a></li>
            <li><a href="service-business-compliance.html">Business Compliance</a></li>
            <li><a href="service-advisory.html">Advisory &amp; Startup Advisory</a></li>
          </ul>
        </div>
        <!-- Policies -->
        <div>
          <h4>Policies</h4>
          <ul>
            <li><a href="privacy-policy.html">Privacy Policy</a></li>
            <li><a href="terms-conditions.html">Terms &amp; Conditions</a></li>
            <li><a href="cookie-policy.html">Cookie Policy</a></li>
          </ul>
        </div>
        <!-- Contact -->
        <div>
          <h4>Contact Us</h4>
          <ul class="contact-list">
            <li><svg class="icon">
                <use href="#i-phone" />
              </svg><span><a href="tel:+919999028148">+91 99990-28148</a><br><a href="tel:+919811541004">+91 98115-41004</a></span></li>
            <li><svg class="icon">
                <use href="#i-mail" />
              </svg><span><a href="mailto:connect@lexmart.co.in">connect@lexmart.co.in</a></span></li>
            <li><svg class="icon">
                <use href="#i-pin" />
              </svg><span>Lexmart Corporate Solutions LLP<br>I-23, L.G.F., Lajpat Nagar- III,<br>New Delhi- 110024.</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2024 Lexmart Corporate Solutions LLP. All rights reserved.</span>
        <span>Built for founders who move fast.</span>
        <span>Developed by Brand Mindz</span>
      </div>
    </div>
  </footer>`;

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['admin', 'images', 'api'].includes(file)) processDir(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Replace entire footer block (from <footer> to </footer>)
            const footerRegex = /<footer[\s\S]*?<\/footer>/i;
            if (footerRegex.test(content)) {
                content = content.replace(footerRegex, correctFooter);
                modified = true;
            }

            // For about.html: also fix the broken partial footer that appears after the partner cards
            // The broken fragment starts at </div> followed immediately by Company h4 without a proper <footer> wrapper
            if (file === 'about.html') {
                // Remove the dangling partial footer fragment if it still exists
                const danglingFragment = /(<\/div>\s*){1,5}\s*<div>\s*<h4>Company<\/h4>[\s\S]*?<\/footer>/i;
                if (danglingFragment.test(content)) {
                    content = content.replace(danglingFragment, '\n      </div>\n    </div>\n  </section>\n' + correctFooter);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed:', file);
            }
        }
    }
}

processDir(__dirname);
