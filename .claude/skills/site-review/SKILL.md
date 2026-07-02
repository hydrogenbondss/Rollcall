---
name: site-review
description: Run a multi-agent audit of the Roll Call site — visual QA over fresh full-page screenshots, web fact-checking of specimen data, cross-page content alignment, functional browser QA, and asset integrity — then consolidate verified findings and fix them. Use before submissions/judging or after any large batch of changes.
---

# Multi-agent site review

Five specialist reviewers in parallel over a fresh build. This harness caught
fabricated data, a wrong-product image, and layout defects that single-pass
review missed — the value is in the fan-out plus verification.

## 1. Build, serve, screenshot

```bash
npx vite build
```

Serve `dist` with the Bash tool's `run_in_background: true` (a foreground
server dies with the command):

```bash
python3 -m http.server 8080 --directory dist
```

Capture full-page screenshots of every route with playwright-core. Hard-won
specifics:

- Run node scripts from the project root (module resolution).
- `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`
  (check `ls /opt/pw-browsers/` if the version moved).
- Use `waitUntil: 'domcontentloaded'` + fixed waits — `networkidle` can hang.
- The landing gate hides the home page: set
  `sessionStorage.setItem('rollcall-entered','true')` then reload.
- GSAP ScrollTrigger reveals leave unscrolled content at opacity 0 in
  screenshots: scroll through the page in ~700px steps, return to top, wait,
  THEN take the `fullPage` shot. Blank regions after this ARE real defects.
- Routes: `/`, `/#/collection`, `/#/product/<id>` (one render + one framed),
  `/#/exhibition`, `/#/about`, `/#/essay`, `/#/sources`, `/#/grant`,
  `/#/zzz` (404).

## 2. Fan out five agents (one message, parallel)

1. **Visual QA** — reads every screenshot; layout, clashing treatments,
   placeholder leaks, unequal card heights, blank regions.
2. **Fact-check** — samples ~12 specimens from `src/data/products.ts` across
   regions, verifies against live web sources (brand, product, maker, origin,
   price plausibility) plus internal consistency (ply-in-name vs field,
   currency vs market, localPrice vs priceUSD at plausible FX).
3. **Content alignment** — every prose surface vs ground truth. Counts are
   DERIVED from `src/data/stats.ts` — flag any hardcoded number. Check ply
   claims against the data, verified-vs-community phrasing, leftovers of
   removed features (hotels, ratings, extinct flags, seasonal scents), figure
   captions vs referenced ids, British spelling in visible copy.
4. **Functional QA** — drives http://localhost:8080 with playwright: landing
   keyboard entry, all nav routes, search/filter/sort, the full compare flow
   (open → Escape closes → View navigates AND closes), product + 404 routes,
   random-specimen button, broken images (`naturalWidth===0` after settling),
   console errors. Google Fonts failures are sandbox egress noise — ignore.
5. **Asset integrity** — every `products.ts` image path resolves in
   `public/images/`; every product id is covered by exactly one provenance set
   in `imageStatus.ts`; unreferenced files in `public/images/` (deploy bloat);
   `docs/specimen-visual-specs.json` ids still exist; dist freshness.

Ask each agent for severity-ranked, location-specific findings only.

## 3. Consolidate, verify, fix

Treat agent findings as claims: re-verify anything surprising yourself before
editing (read the file/screenshot cited). Batch all fixes into one commit with
a body grouped by review dimension, then run `/ship`. Anything subjective
(content duplication, chrome variants) goes to the user as options, not edits.

Ground-truth reminders that have burned us: only Mongolia is 1-ply; 4-ply =
PurSoft + Paseo King Size; 30 verified / 13 community (but always re-derive);
"Single" means 1-ply in the Japanese market; images must not contradict data
(roll counts printed on packs).
