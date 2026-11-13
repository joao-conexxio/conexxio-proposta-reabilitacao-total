import { createRequire } from 'module';
const require = createRequire('/Users/joaomarcosom/Dev/Conexxio/proposta-kit/package.json');
const { chromium } = require('playwright');
const b = await chromium.launch({ channel: 'chromium' });
const ctx = await b.newContext({ locale: 'pt-BR', viewport: { width: 1280, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' });
const p = await ctx.newPage();
await p.goto(process.argv[2], { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(6000);
const lst = p.locator("a.hfpxzc"); if (await lst.count()) { await p.goto(await lst.first().getAttribute("href")); await p.waitForTimeout(6000); }
const itens = await p.evaluate(() => [...document.querySelectorAll('[data-item-id]')].map(e => e.getAttribute('data-item-id') + ' | ' + (e.getAttribute('aria-label') || e.innerText).replace(/\s+/g,' ') + ' | ' + (e.href || '')));
console.log(itens.join('\n'));
const horas = await p.evaluate(() => [...document.querySelectorAll('table')].map(t => t.innerText).join('\n'));
console.log('HORAS', horas, await p.locator('[aria-label*="Horário"], [aria-label*="horário"]').first().getAttribute('aria-label').catch(()=>''));
try { await p.getByRole('tab', { name: /Avalia/ }).click(); await p.waitForTimeout(3500);
  for (let i=0;i<4;i++){ await p.mouse.move(400,600); await p.mouse.wheel(0,3000); await p.waitForTimeout(1200);} 
  const t = await p.evaluate(() => document.querySelector('div[role="main"]').innerText);
  console.log('AVAL', t.slice(0, 6000)); } catch(e) { console.log('sem aba', e.message); }
await b.close();
