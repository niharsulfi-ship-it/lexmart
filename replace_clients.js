const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// All 12 client logos from lexmart_clients folder
const logos = ['aa.png','didi.png','isl.png','jm.png','jonnette.png','nova.png','orient.png','powergrid.png','raj.png','taste.png','tph.png','vardman.png'];

// Build image card HTML for a logo
function makeCard(logo) {
  return `        <div class="client-card">
          <img src="lexmart_clients/${logo}" alt="Client Logo" style="max-height:60px;max-width:130px;width:auto;height:auto;object-fit:contain;display:block;margin:0 auto;">
        </div>`;
}

// Build duplicated track content (all logos repeated twice for seamless loop)
const row1Logos = logos.slice(0, logos.length); // all logos for row 1
const row2Logos = [...logos].reverse(); // reversed for row 2

function buildTrack(logoArr) {
  const set = logoArr.map(makeCard).join('\n');
  return `        <!-- Set 1 -->\n${set}\n        <!-- Set 2 (duplicate for seamless loop) -->\n${set}`;
}

// Replace Row 1 marquee-track content
const row1Start = content.indexOf('<div class="marquee-track row1">');
const row1End = content.indexOf('</div>', content.indexOf('</div>', row1Start) + 1) + 6;
const row1InnerStart = row1Start + '<div class="marquee-track row1">'.length;

// Find the actual closing </div> of marquee-track row1
let depth = 1;
let i = row1Start + '<div class="marquee-track row1">'.length;
while (i < content.length && depth > 0) {
  if (content[i] === '<') {
    if (content.startsWith('</div>', i)) {
      depth--;
      if (depth === 0) break;
      i += 5;
    } else if (content.startsWith('<div', i)) {
      depth++;
    }
  }
  i++;
}
const row1TrackEnd = i;

const row2TrackStartIdx = content.indexOf('<div class="marquee-track row2">');
let j = row2TrackStartIdx + '<div class="marquee-track row2">'.length;
let depth2 = 1;
while (j < content.length && depth2 > 0) {
  if (content[j] === '<') {
    if (content.startsWith('</div>', j)) {
      depth2--;
      if (depth2 === 0) break;
      j += 5;
    } else if (content.startsWith('<div', j)) {
      depth2++;
    }
  }
  j++;
}
const row2TrackEnd = j;

// Replace row1 inner
const newRow1Inner = '\n' + buildTrack(row1Logos) + '\n      ';
const newRow2Inner = '\n' + buildTrack(row2Logos) + '\n      ';

content = content.slice(0, row1Start + '<div class="marquee-track row1">'.length)
  + newRow1Inner
  + content.slice(row1TrackEnd);

// Re-find row2 after replacement
const row2TrackStartIdx2 = content.indexOf('<div class="marquee-track row2">');
let k = row2TrackStartIdx2 + '<div class="marquee-track row2">'.length;
let depth3 = 1;
while (k < content.length && depth3 > 0) {
  if (content[k] === '<') {
    if (content.startsWith('</div>', k)) {
      depth3--;
      if (depth3 === 0) break;
      k += 5;
    } else if (content.startsWith('<div', k)) {
      depth3++;
    }
  }
  k++;
}
content = content.slice(0, row2TrackStartIdx2 + '<div class="marquee-track row2">'.length)
  + newRow2Inner
  + content.slice(k);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Client logos replaced successfully!');
