const fs = require('fs');
const path = require('path');

const aboutContent = fs.readFileSync('about.html', 'utf8');

const headerMatch = aboutContent.match(/([\s\S]*?)<section class="about-hero/);
const footerMatch = aboutContent.match(/(<footer[\s\S]*)/);

if (!headerMatch || !footerMatch) {
    console.error("Could not parse header or footer from about.html");
    process.exit(1);
}

const headerHTML = headerMatch[1];
const footerHTML = footerMatch[1];

function createPage(filename, title, content) {
    let pageHeader = headerHTML.replace(/<title>.*?<\/title>/, `<title>${title} - Lexmart | Legal & Business Advisors</title>`);
    pageHeader = pageHeader.replace(/class="active"/g, "");

    const pageContent = `
  <section class="hero" style="min-height: 200px; padding-top: 150px; background: #f8f9fa;">
    <div class="container">
      <h1 style="color: var(--blue-700); font-size: 40px; margin-bottom: 20px;">${title}</h1>
    </div>
  </section>
  <section style="padding: 60px 0;">
    <div class="container" style="max-width: 800px; margin: 0 auto; line-height: 1.8; color: var(--ink-soft);">
      ${content}
    </div>
  </section>
`;

    fs.writeFileSync(filename, pageHeader + pageContent + footerHTML, 'utf8');
    console.log("Created", filename);
}

const privacyContent = `
<h2>1. Information We Collect</h2>
<p>We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our products and Services.</p>
<h2>2. How We Use Your Information</h2>
<p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
<h2>3. Will Your Information Be Shared With Anyone?</h2>
<p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
`;

const termsContent = `
<h2>1. Agreement to Terms</h2>
<p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Lexmart Corporate Solutions LLP, concerning your access to and use of the website.</p>
<h2>2. Intellectual Property Rights</h2>
<p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site are owned or controlled by us.</p>
<h2>3. User Representations</h2>
<p>By using the Site, you represent and warrant that all registration information you submit will be true, accurate, current, and complete.</p>
`;

const cookieContent = `
<h2>1. What Are Cookies?</h2>
<p>Cookies are small text files that are used to store small pieces of information. The cookies are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make the website more secure, provide better user experience, and understand how the website performs.</p>
<h2>2. How Do We Use Cookies?</h2>
<p>As most of the online services, our website uses cookies first-party and third-party cookies for a number of purposes. The first-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.</p>
<h2>3. What Types Of Cookies Do We Use?</h2>
<p>Essential: Some cookies are essential for you to be able to experience the full functionality of our site. Statistics: These cookies store information like the number of visitors to the website.</p>
`;

createPage('privacy-policy.html', 'Privacy Policy', privacyContent);
createPage('terms-conditions.html', 'Terms & Conditions', termsContent);
createPage('cookie-policy.html', 'Cookie Policy', cookieContent);
