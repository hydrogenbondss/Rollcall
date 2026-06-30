import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const routes = [
  ['home','/'],['collection','/#/collection'],['product','/#/product/nepia-oshiri-celeb'],
  ['exhibition','/#/exhibition'],['about','/#/about'],['essay','/#/essay'],
  ['sources','/#/sources'],['grant','/#/grant'],['notfound','/#/zzz']
];
for (const [vp,w,h] of [['d',1280,1600],['m',390,1500]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  for (const [name,route] of routes) {
    const p = await ctx.newPage();
    try {
      await p.goto('http://localhost:8080'+route, {waitUntil:'networkidle', timeout:20000});
      if (route==='/'){ // click enter to reveal home content
        await p.waitForTimeout(1500);
        const btn = await p.$('button, [role=button], a');
        try { await p.evaluate(()=>{ const el=[...document.querySelectorAll('button,a')].find(e=>/enter/i.test(e.textContent||'')); if(el) el.click(); }); } catch{}
      }
      await p.waitForTimeout(2200);
      await p.screenshot({ path:`/tmp/shots/${name}_${vp}.png`, fullPage: vp==='d' });
    } catch(e){ console.log('ERR',name,vp,e.message); }
    await p.close();
  }
  await ctx.close();
}
await b.close();
console.log('done');
