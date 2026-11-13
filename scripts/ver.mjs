import { createRequire } from 'module';
const require = createRequire('/Users/joaomarcosom/Dev/Conexxio/proposta-kit/package.json');
const { chromium } = require('playwright');
const [,, html, w, sel, out, espera] = process.argv;
const b = await chromium.launch({ channel: 'chromium' });
const p = await b.newPage({ viewport: { width: +w, height: 900 } });
await p.goto('file://' + html); await p.waitForTimeout(1500);
const el = p.locator(sel).first();
for (let y = 0; y < 30000; y += 400) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(60); const top = await el.evaluate(e => e.getBoundingClientRect().top); if (top < 120) break; }
await p.waitForTimeout(+(espera||2500));
await p.screenshot({ path: out }); await b.close();
