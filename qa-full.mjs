import { chromium } from 'playwright-core'
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
const BASE='http://localhost:3001'
const OUT='/tmp/claude-0/-home-user-Rollcall/6e45002e-917a-5518-b648-157bf1140084/scratchpad'
const FORCE=`*{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}.hero-item,.nav-card,.ex-item,.ex-section,.detail-item,.specimen-card,.essay-item,.source-item,[class*="opacity-0"]{opacity:1!important;transform:none!important}`
const routes=[
  ['home','/#/'],['collection','/#/collection'],['exhibition','/#/exhibition'],
  ['about','/#/about'],['essay','/#/essay'],['sources','/#/sources'],
  ['product','/#/product/nepia-oshiri-celeb'],
]
const mobile=[['home','/#/'],['collection','/#/collection'],['exhibition','/#/exhibition'],['product','/#/product/nepia-oshiri-celeb'],['about','/#/about']]
const b=await chromium.launch({executablePath:EXE,headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']})
const errors=[], links=new Set()
async function shoot(ctx,list,suffix){
  const p=await ctx.newPage()
  await p.addInitScript(()=>{try{sessionStorage.setItem('rollcall-entered','true')}catch(e){}})
  p.on('pageerror',e=>errors.push(`${suffix} ${String(e).slice(0,120)}`))
  p.on('console',m=>{if(m.type()==='error')errors.push(`${suffix} console: ${m.text().slice(0,120)}`)})
  for(const [name,url] of list){
    await p.goto(BASE+url,{waitUntil:'networkidle',timeout:30000})
    await p.addStyleTag({content:FORCE}); await p.waitForTimeout(2200)
    await p.evaluate(async()=>{await Promise.all(Array.from(document.images).map(i=>i.decode().catch(()=>{})))}).catch(()=>{})
    if(suffix==='d'){ // collect links once on desktop
      const hrefs=await p.$$eval('a',as=>as.map(a=>a.getAttribute('href')))
      hrefs.forEach(h=>links.add(h))
    }
    await p.screenshot({path:`${OUT}/q_${name}_${suffix}.png`,fullPage:true})
    console.log('OK',suffix,name)
  }
  await p.close()
}
await shoot(await b.newContext({viewport:{width:1440,height:900}}),routes,'d')
await shoot(await b.newContext({viewport:{width:390,height:844}}),mobile,'m')
await b.close()
console.log('--- PAGE ERRORS ---'); console.log(errors.length?[...new Set(errors)].join('\n'):'none')
console.log('--- SUSPECT LINKS (non-hash, non-http, empty) ---')
const bad=[...links].filter(h=>h && !h.startsWith('#/') && !h.startsWith('http') && !h.startsWith('mailto') && h!=='#/' ).filter(h=>!h.startsWith('#'))
console.log(bad.length?[...new Set(bad)].join('\n'):'none (all internal links are hash routes)')
