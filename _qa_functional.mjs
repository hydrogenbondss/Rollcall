import { chromium } from 'playwright-core'

const EXE = '/home/ubuntu/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell'
const BASE = 'http://localhost:8080'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const findings = []
const consoleErrors = []
let currentLabel = 'init'
const pass = (msg) => findings.push({ sev: 'PASS', msg })
const fail = (sev, msg) => findings.push({ sev, msg })

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.setDefaultTimeout(8000)
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push({ route: currentLabel, text: m.text() })
})
page.on('pageerror', (e) => consoleErrors.push({ route: currentLabel, text: 'pageerror: ' + e.message }))

async function goto(url, label, settle = 1200) {
  currentLabel = label
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await sleep(settle)
}

async function checkBrokenImages(label) {
  // Scroll through the page to trigger lazy images, then back to top.
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y <= h; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)) }
    window.scrollTo(0, 0)
  })
  await sleep(1500)
  const broken = await page.evaluate(() =>
    Array.from(document.images)
      .filter((i) => i.src && i.complete && i.naturalWidth === 0)
      .map((i) => i.currentSrc || i.src)
  )
  if (broken.length) fail('MAJOR', `[${label}] broken images (naturalWidth=0): ${[...new Set(broken)].join(', ')}`)
  return broken.length
}

// ---------- 1. Landing gate ----------
try {
  await goto(BASE + '/', 'landing-gate')
  const gate = page.locator('[aria-label="Enter Roll Call"]')
  if (!(await gate.isVisible())) {
    fail('CRITICAL', '[/] landing gate element ([aria-label="Enter Roll Call"]) not visible on first load')
  } else {
    // keyboard entry
    await gate.focus()
    await page.keyboard.press('Enter')
    await sleep(1500)
    const gateGoneKb = (await page.locator('[aria-label="Enter Roll Call"]').count()) === 0
    const navVisible = await page.locator('button[aria-label="Random Roll"]').first().isVisible().catch(() => false)
    if (gateGoneKb && navVisible) pass('[/] landing gate: Enter key dismisses gate and reveals home content (nav rendered)')
    else fail('CRITICAL', `[/] landing gate keyboard entry failed: gateGone=${gateGoneKb} homeNavVisible=${navVisible}`)

    // click entry (fresh session)
    await page.evaluate(() => sessionStorage.removeItem('rollcall-entered'))
    await goto(BASE + '/', 'landing-gate-click')
    const gate2 = page.locator('[aria-label="Enter Roll Call"]')
    if (!(await gate2.isVisible())) fail('CRITICAL', '[/] gate did not reappear after clearing sessionStorage + reload')
    else {
      await gate2.click()
      await sleep(1500)
      const gateGoneClick = (await page.locator('[aria-label="Enter Roll Call"]').count()) === 0
      if (gateGoneClick) pass('[/] landing gate: click dismisses gate and reveals home content')
      else fail('CRITICAL', '[/] landing gate click did NOT dismiss the gate')
    }
  }
} catch (e) { fail('CRITICAL', '[/] landing gate test threw: ' + e.message) }

// ---------- 2. Nav routes render + 7. broken images per route ----------
const routes = [
  ['/#/collection', 'The Archive Wall'],
  ['/#/exhibition', null],
  ['/#/about', null],
  ['/#/essay', null],
  ['/#/sources', null],
  ['/#/grant', null],
  ['/#/product/nepia-oshiri-celeb', 'Oshiri'],
]
for (const [route, expectText] of routes) {
  try {
    await goto(BASE + route, route, route.includes('exhibition') ? 3000 : 1500)
    await page.evaluate(() => sessionStorage.setItem('rollcall-entered', 'true'))
    const bodyText = await page.evaluate(() => document.body.innerText)
    const title = await page.title()
    const is404 = bodyText.includes('Specimen Not Found')
    const empty = bodyText.trim().length < 40
    if (is404) fail('CRITICAL', `[${route}] renders the 404 page instead of content`)
    else if (empty) fail('CRITICAL', `[${route}] renders (nearly) empty body: "${bodyText.trim().slice(0, 80)}"`)
    else if (expectText && !bodyText.includes(expectText)) fail('MAJOR', `[${route}] expected text "${expectText}" not found; title="${title}"`)
    else pass(`[${route}] renders content (title: "${title}")`)
    await checkBrokenImages(route)
  } catch (e) { fail('CRITICAL', `[${route}] navigation threw: ` + e.message) }
}

// ---------- 3. Collection: search / filters / sort ----------
try {
  await goto(BASE + '/#/collection', 'collection-interactions', 1500)
  const cardHrefs = () => page.$$eval('a[href*="product/"]', (as) => as.map((a) => a.getAttribute('href')))
  const headerText = await page.evaluate(() => document.body.innerText)
  const totalMatch = headerText.match(/currently (\d+) specimens/)
  const total = totalMatch ? parseInt(totalMatch[1], 10) : null

  // search
  const searchBox = page.locator('input[aria-label="Search specimens"]')
  await searchBox.fill('nepia')
  await sleep(900) // 250ms debounce + render
  const searched = await cardHrefs()
  const cardTexts = await page.$$eval('.specimen-card', (els) => els.map((e) => e.innerText.toLowerCase()))
  const allMatch = cardTexts.length > 0 && cardTexts.every((t) => t.includes('nepia'))
  if (searched.length > 0 && (total === null || searched.length < total) && allMatch)
    pass(`[/#/collection] search "nepia" filters to ${searched.length} matching cards (of ${total})`)
  else fail('MAJOR', `[/#/collection] search filtering broken: ${searched.length} results, allContainQuery=${allMatch}, total=${total}`)
  await searchBox.fill('')
  await sleep(900)

  // filters
  await page.locator('button[aria-label="Toggle filters"]').click()
  await sleep(300)
  const regionSel = page.locator('select[aria-label="Filter by region"]')
  if (!(await regionSel.isVisible())) fail('MAJOR', '[/#/collection] filter panel did not open (region select not visible)')
  else {
    await regionSel.selectOption('East Asia')
    await sleep(600)
    const regionFiltered = await cardHrefs()
    const originTexts = await page.$$eval('.specimen-card', (els) => els.map((e) => e.innerText))
    const eastAsiaCountries = ['Japan', 'South Korea', 'China', 'Taiwan', 'Hong Kong', 'Macau', 'Mongolia']
    const allEast = originTexts.length > 0 && originTexts.every((t) => eastAsiaCountries.some((c) => t.includes(c)))
    if (regionFiltered.length > 0 && total !== null && regionFiltered.length < total && allEast)
      pass(`[/#/collection] region filter "East Asia" -> ${regionFiltered.length}/${total} cards, all East-Asian countries`)
    else fail('MAJOR', `[/#/collection] region filter suspect: ${regionFiltered.length} cards, allEastAsia=${allEast}`)

    // brand filter on top
    const brandSel = page.locator('select[aria-label="Filter by brand"]')
    const brandOptions = await brandSel.locator('option').allTextContents()
    const brand = brandOptions.find((b) => b === 'Nepia') || brandOptions[1]
    await brandSel.selectOption(brand)
    await sleep(600)
    const brandFiltered = await page.$$eval('.specimen-card', (els) => els.map((e) => e.innerText))
    const allBrand = brandFiltered.length > 0 && brandFiltered.every((t) => t.includes(brand))
    if (allBrand) pass(`[/#/collection] brand filter "${brand}" -> ${brandFiltered.length} cards, all matching`)
    else fail('MAJOR', `[/#/collection] brand filter "${brand}" broken: ${brandFiltered.length} cards, allMatch=${allBrand}`)

    // clear all
    await page.locator('button:has-text("Clear all")').first().click()
    await sleep(600)
  }

  // sort
  const before = (await cardHrefs()).slice(0, 8)
  await page.locator('select[aria-label="Sort specimens"]').selectOption('price-asc')
  await sleep(600)
  const afterAsc = (await cardHrefs()).slice(0, 8)
  await page.locator('select[aria-label="Sort specimens"]').selectOption('price-desc')
  await sleep(600)
  const afterDesc = (await cardHrefs()).slice(0, 8)
  const changed = JSON.stringify(before) !== JSON.stringify(afterAsc) || JSON.stringify(afterAsc) !== JSON.stringify(afterDesc)
  if (changed && afterAsc[0] !== afterDesc[0]) pass('[/#/collection] sort control changes ordering (popular vs price-asc vs price-desc differ)')
  else fail('MAJOR', `[/#/collection] sort appears to have no effect. popular[0..2]=${before.slice(0,3)} asc[0..2]=${afterAsc.slice(0,3)} desc[0..2]=${afterDesc.slice(0,3)}`)

  // region grouping sort
  await page.locator('select[aria-label="Sort specimens"]').selectOption('region')
  await sleep(600)
  const regionHeads = await page.evaluate(() => Array.from(document.querySelectorAll('h3')).map((h) => h.innerText).filter((t) => /East Asia|Southeast Asia|South Asia/.test(t)))
  if (regionHeads.length >= 2) pass(`[/#/collection] sort "Region" renders grouped sections: ${regionHeads.join(' / ')}`)
  else fail('MINOR', `[/#/collection] sort "Region" grouping headers not found (got: ${regionHeads.join(', ')})`)
} catch (e) { fail('MAJOR', '[/#/collection] interaction test threw: ' + e.message) }

// ---------- 4. Compare flow ----------
try {
  currentLabel = 'compare-flow'
  await goto(BASE + '/#/product/nepia-oshiri-celeb', 'compare-flow', 1500)
  const compareBtn = page.locator('button:visible', { hasText: /^\s*Compare\s*$/ }).first()
  await compareBtn.click()
  await sleep(700)
  let dialog = page.locator('[role="dialog"]')
  if (!(await dialog.isVisible())) fail('CRITICAL', '[product/nepia-oshiri-celeb] clicking "Compare" did not open the compare drawer')
  else {
    pass('[compare] "Compare" on product page adds specimen and opens drawer')
    await page.keyboard.press('Escape')
    await sleep(500)
    if (await page.locator('[role="dialog"]').count()) fail('MAJOR', '[compare] Escape did NOT close the compare drawer')
    else pass('[compare] Escape closes the compare drawer')

    // add a second specimen via same-document hash navigation (state preserved)
    await page.evaluate(() => { location.hash = '#/product/elleair-premium' })
    await sleep(1500)
    const compareBtn2 = page.locator('button:visible', { hasText: /^\s*Compare\s*$/ }).first()
    await compareBtn2.click()
    await sleep(700)
    dialog = page.locator('[role="dialog"]')
    const cols = await dialog.locator('img').count()
    if ((await dialog.isVisible()) && cols >= 2) pass(`[compare] second specimen added; drawer shows ${cols} specimens`)
    else fail('MAJOR', `[compare] drawer after adding 2nd specimen: visible=${await dialog.isVisible()} specimenImgs=${cols}`)

    // close, reopen via floating indicator
    await page.keyboard.press('Escape')
    await sleep(500)
    const indicator = page.locator('button:has-text("in compare")')
    if (!(await indicator.isVisible())) fail('MAJOR', '[compare] floating "N in compare" indicator not visible after closing drawer')
    else {
      await indicator.click()
      await sleep(500)
      if (!(await page.locator('[role="dialog"]').isVisible())) fail('MAJOR', '[compare] indicator click did not reopen drawer')
      else pass('[compare] floating indicator reopens the drawer')
    }

    // "View" navigates AND closes overlay
    const viewLink = page.locator('[role="dialog"] a:has-text("View")').first()
    const targetHref = await viewLink.getAttribute('href')
    await viewLink.click()
    await sleep(1200)
    const hash = await page.evaluate(() => location.hash)
    const dialogGone = (await page.locator('[role="dialog"]').count()) === 0
    const expected = (targetHref || '').replace(/^#?/, '#')
    if (dialogGone && hash.startsWith('#/product/')) pass(`[compare] "View" navigates to ${hash} and closes the overlay`)
    else fail('MAJOR', `[compare] "View" click: hash=${hash} (expected ~${expected}), overlayClosed=${dialogGone}`)
  }
} catch (e) { fail('MAJOR', '[compare] flow threw: ' + e.message) }

// ---------- 5. Product back nav + 404 ----------
try {
  currentLabel = 'back-nav'
  await goto(BASE + '/#/collection', 'back-nav', 1500)
  const firstCard = page.locator('a[href*="product/"]').first()
  await firstCard.click()
  await sleep(1500)
  const prodHash = await page.evaluate(() => location.hash)
  const backBtn = page.locator('button:has-text("Back")').first()
  if (!prodHash.startsWith('#/product/')) fail('MAJOR', `[back-nav] card click did not navigate to product (hash=${prodHash})`)
  else if (!(await backBtn.isVisible())) fail('MAJOR', '[back-nav] Back button not visible on product page')
  else {
    await backBtn.click()
    await sleep(1200)
    const backHash = await page.evaluate(() => location.hash)
    if (backHash === '#/collection') pass('[back-nav] product page "Back" button returns to /#/collection')
    else fail('MAJOR', `[back-nav] Back button landed on "${backHash}" instead of #/collection`)
  }

  await goto(BASE + '/#/zzz', '404-route', 1200)
  const t404 = await page.evaluate(() => document.body.innerText)
  if (t404.includes('Specimen Not Found') && t404.includes('404')) pass('[/#/zzz] 404 page renders "Specimen Not Found"')
  else fail('MAJOR', `[/#/zzz] 404 page unexpected content: "${t404.trim().slice(0, 100)}"`)
} catch (e) { fail('MAJOR', '[back-nav/404] threw: ' + e.message) }

// ---------- 6. Random Roll ----------
try {
  currentLabel = 'random-roll'
  await goto(BASE + '/', 'random-roll', 1500)
  await page.evaluate(() => sessionStorage.setItem('rollcall-entered', 'true'))
  await page.reload({ waitUntil: 'domcontentloaded' })
  await sleep(1800)
  const dice = page.locator('button[aria-label="Random Roll"]').first()
  if (!(await dice.isVisible())) fail('MAJOR', '[random-roll] Random Roll button not visible in home nav (1280px viewport)')
  else {
    await dice.click()
    await sleep(1500)
    const hash = await page.evaluate(() => location.hash)
    const body = await page.evaluate(() => document.body.innerText)
    const ok = hash.startsWith('#/product/') && !body.includes('Specimen Not Found')
    if (ok) pass(`[random-roll] navigates to a valid product (${hash})`)
    else fail('MAJOR', `[random-roll] landed on hash=${hash}, 404=${body.includes('Specimen Not Found')}`)
    await checkBrokenImages('random-roll:' + hash)
  }
} catch (e) { fail('MAJOR', '[random-roll] threw: ' + e.message) }

await browser.close()

// ---------- Report ----------
console.log('=== FINDINGS ===')
for (const f of findings) console.log(`${f.sev}: ${f.msg}`)
console.log('\n=== CONSOLE ERRORS (raw) ===')
if (!consoleErrors.length) console.log('(none)')
for (const c of consoleErrors) console.log(`[${c.route}] ${c.text}`)
