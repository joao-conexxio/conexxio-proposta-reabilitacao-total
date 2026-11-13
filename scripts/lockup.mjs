import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
const require = createRequire('/Users/joaomarcosom/Dev/Conexxio/proposta-kit/package.json');
const { chromium } = require('playwright');
const src = 'data:image/png;base64,' + readFileSync(process.argv[2]).toString('base64');
const b = await chromium.launch(); const p = await b.newPage();
const out = await p.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const W = img.width, H = img.height;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  const d = x.getImageData(0, 0, W, H).data;
  const rows = []; for (let y = 0; y < H; y++) { let n = 0; for (let i = 0; i < W; i++) if (d[(y*W+i)*4+3] > 40) n++; rows.push(n); }
  // bands of non-empty rows
  const bands = []; let s = -1; rows.forEach((n, y) => { if (n && s < 0) s = y; if (!n && s >= 0) { bands.push([s, y]); s = -1; } }); if (s >= 0) bands.push([s, H]);
  const bbox = (y0, y1) => { let a = W, z = 0; for (let y = y0; y < y1; y++) for (let i = 0; i < W; i++) if (d[(y*W+i)*4+3] > 40) { a = Math.min(a, i); z = Math.max(z, i); } return [a, z+1]; };
  return { bands, boxes: bands.map(([a, z]) => bbox(a, z)) };
}, src);
console.log(JSON.stringify(out));
await b.close();
