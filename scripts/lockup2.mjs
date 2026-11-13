import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
const require = createRequire('/Users/joaomarcosom/Dev/Conexxio/proposta-kit/package.json');
const { chromium } = require('playwright');
const src = 'data:image/png;base64,' + readFileSync(process.argv[2]).toString('base64');
const b = await chromium.launch(); const p = await b.newPage();
const url = await p.evaluate(async (src) => {
  const img = new Image(); img.src = src; await img.decode();
  const S = 3; // upscale for smoother edges
  const th = 51, tw = 197, ih = 54, iw = 99;
  const h = th * S, iconW = Math.round(iw * th / ih) * S, gap = 12 * S;
  const c = document.createElement('canvas'); c.width = iconW + gap + tw * S; c.height = h;
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
  x.drawImage(img, 49, 0, iw, ih, 0, 0, iconW, h);
  x.drawImage(img, 0, 59, tw, th, iconW + gap, 0, tw * S, h);
  return c.toDataURL('image/png');
}, src);
writeFileSync(process.argv[3], Buffer.from(url.split(',')[1], 'base64'));
await b.close();
