import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const exe = execSync("ls -d /home/ubuntu/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell").toString().trim();
const b = await chromium.launch({ executablePath: exe });

const routes = [
  ['home', '/'],
  ['collection', '/#/collection'],
  ['product-render', '/#/product/nepia-oshiri-celeb'],
  ['product-framed', '/#/product/mongolia-emart-1ply'],
  ['exhibition', '/#/exhibition'],
  ['about', '/#/about'],
  ['essay', '/#/essay'],
  ['sources', '/#/sources'],
  ['grant', '/#/grant'],
  ['notfound', '/#/zzz'],
];

const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });

for (const [name, route] of routes) {
  const p = await ctx.newPage();
  try {
    await p.goto('http://localhost:8080' + route, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await p.evaluate(() => sessionStorage.setItem('rollcall-entered', 'true'));
    await p.reload({ waitUntil: 'domcontentloaded', timeout: 20000 });
    await p.waitForTimeout(2500);
    // Scroll through page to trigger GSAP reveals
    const total = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < total; y += 700) {
      await p.evaluate((yy) => window.scrollTo(0, yy), y);
      await p.waitForTimeout(180);
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `/tmp/shots/${name}.png`, fullPage: true });
    console.log('OK', name);
  } catch (e) {
    console.log('ERR', name, e.message);
  }
  await p.close();
}
await ctx.close();
await b.close();
console.log('done');
