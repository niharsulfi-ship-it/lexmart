const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'style.css');
let content = fs.readFileSync(filePath, 'utf8');

// The .btn block is broken - fix it
// It currently starts with display:inline-flex then goes straight to background:linear-gradient (the hero background leaked in)
// We need to replace the broken .btn block up to .hero-grid with the correct block

const oldBlock = `  .btn{
    display:inline-flex;
    background:linear-gradient(135deg, #eef4ff 0%, #ffffff 100%);
    overflow:visible;
  }
  .hero-grid{`;

const newBlock = `  .btn{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:14px 26px;
    border-radius:10px;
    font-weight:600;
    font-size:16px;
    cursor:pointer;
    border:none;
    transition:transform .15s ease, box-shadow .15s ease, opacity .15s ease;
    font-family:'Inter',sans-serif;
  }
  .btn:hover{transform:translateY(-2px);}
  .btn-primary{
    background:var(--blue-700);
    color:#ffffff;
    box-shadow:0 12px 24px rgba(12,70,187,0.35);
  }
  .btn-outline{
    background:#ffffff;
    color:var(--ink);
    border:1.5px solid var(--border);
  }
  .btn-white{ background:#ffffff; color:var(--blue-700); }
  .btn-teal{
    background:var(--blue-700);
    color:#ffffff;
    box-shadow:0 8px 16px rgba(12,70,187,0.3);
    border: none;
  }
  .btn-teal:hover{ box-shadow:0 12px 24px rgba(12,70,187,0.45); }
  .icon{width:20px; height:20px; stroke:currentColor; fill:none; stroke-width:2; stroke-linecap:round; stroke-linejoin:round;}

  /* Header */
  header{
    position:sticky; top:0; z-index:50;
    background:#ffffff;
    box-shadow: 0 1px 10px rgba(12,70,187,0.1);
    overflow: visible;
  }
  .nav-wrap{
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 32px;
    max-width:1400px;
    margin:0 auto;
    overflow: visible;
    gap: 24px;
  }
  .logo{
    display:flex; align-items:center; gap:12px;
    font-family:'Poppins',sans-serif;
    font-weight:700; font-size:30.8px;
    color:var(--blue-700);
    letter-spacing: 1px;
    height: 90px;
    flex-shrink: 0;
    overflow: visible;
  }
  .logo img{
    height: 130px !important;
    width: auto !important;
    display: block;
  }
  .logo-mark{ width:38px; height:38px; display:flex; align-items:center; justify-content:center; color:var(--blue-700); flex-shrink:0; }
  .logo-mark svg{width:38px; height:38px; fill:none; stroke:currentColor;}
  nav.links{
    flex: 1;
    display:flex; justify-content:center; gap:36px; font-size:18.7px; font-weight:600; color:var(--ink);
  }
  nav.links a{display:flex; align-items:center; gap:4px; padding: 4px 0;}
  nav.links a.active{ color:var(--blue-700); border-bottom: 2px solid var(--blue-700); }
  nav.links a:hover{color:var(--blue-700);}
  /* Hide internal service details in dropdown */
  .di-text span { display: none !important; }
  .btn-consult{ flex-shrink: 0; }

  /* Hero */
  .hero{
    position:relative;
    padding:0;
    background:linear-gradient(135deg, #eef4ff 0%, #ffffff 100%);
    overflow:visible;
  }
  .hero-grid{`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(filePath, content, 'utf8');
console.log('CSS restored successfully');
