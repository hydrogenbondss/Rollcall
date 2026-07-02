---
name: specimen-render
description: Add or replace a specimen image in the Roll Call archive via the Higgsfield render pipeline — research real packaging, generate a faithful dark-vitrine render, hand off the upload, wire it into the data layer, and deploy. Use when adding a new specimen, replacing a wrong/contradictory image, or regenerating a render.
---

# Specimen render pipeline

The end-to-end procedure for getting a faithful product image into the archive.
Every step below encodes a constraint we hit in practice — do not skip.

## 1. Research the real packaging first

Never invent packaging. Web-search the brand + product (manufacturer site,
retailer listings) and note: wordmark style, dominant colours, ply/roll-count
callouts, script/language on the pack. Record the spec in
`docs/specimen-visual-specs.json` (id, brand, targetFile, palette, description,
prompt, sources). If packaging cannot be visually confirmed, say so in the spec
(`confidence: low`) and keep the render generic-faithful rather than specific.

## 2. Generate via Higgsfield

Use `mcp__Higgsfield__generate_image` with `model: nano_banana_pro` (results
report as `nano_banana_2`), `aspect_ratio: "3:4"` for products (`"16:9"` for
spatial/exhibition visualizations). Resolution defaults to 1k (896×1200).

Prompt template that produces grid-consistent results:

> Studio product photograph of ONE plastic-wrapped [N-roll pack] of [Brand
> Product] ([market] brand), standing upright on a clean dark charcoal seamless
> background with soft museum spotlighting and gentle floor reflection.
> [Faithful brand details: wordmark, colours, '{N}-PLY' / '{M} ROLLS' callouts,
> script/language.] Photorealistic e-commerce catalogue style, vertical 3:4.

Critical: the numbers printed on the pack in the prompt MUST match the data in
`src/data/products.ts` (ply, roll count) — mismatched baked-in text is a fact
error reviewers will catch.

Poll with `mcp__Higgsfield__job_display` (job id) until `status: completed`.

## 3. Hand off the download (the CDN is blocked)

The Higgsfield CDN (`d8j0ntlcm91z4.cloudfront.net`) is firewalled from this
sandbox — direct downloads return HTTP 000. Do NOT retry. Ask the user to grab
the image(s) from their Higgsfield gallery and upload them to the GitHub repo
(any branch, any folder, original filenames are fine).

## 4. Extract by job id

Higgsfield filenames embed the job id: `hf_YYYYMMDD_HHMMSS_<job-id>.png` — this
is the unambiguous mapping back to what each render is. To find the upload:

```bash
git fetch <remote> '+refs/heads/*:refs/remotes/origin/*'
comm -13 <(git ls-tree -r --name-only HEAD | sort) \
         <(git ls-tree -r --name-only origin/main | sort) | grep -iE '\.(png|jpg|webp)$'
```

Then `git merge --ff-only origin/main` and `git mv` each file to
`public/images/<specimen-id>-render.png`. If replacing an existing render whose
old file must die, `git rm` the old one and use a new filename (e.g. `-v2-`) so
stale caches can't serve the old image.

## 5. Convert to WebP (site convention since the perf fix)

All site imagery ships as WebP (~30× smaller). Convert and delete the original:

```bash
python3 - <<'EOF'
from PIL import Image
import os
p = "public/images/<id>-render.png"
im = Image.open(p).convert("RGB"); im.thumbnail((1200,1200), Image.LANCZOS)
im.save(p.rsplit(".",1)[0] + ".webp", "WEBP", quality=80, method=6)
os.remove(p)
EOF
```

Reference the `.webp` path in code. Exception: the og:image referenced in
`index.html` stays PNG for social-scraper compatibility.

## 6. Wire into the data layer

- `src/data/products.ts`: set `image: './images/<id>-render.webp'`.
- `src/data/imageStatus.ts`: add the id to `illustrativeImageIds` (renders are
  reconstructions — the detail page then shows the honest "illustrative
  reconstruction" note). `brandImageIds` is ONLY for genuine manufacturer
  imagery. `framedImageIds` is presentational: add the id only if the image has
  a light background that must be mounted as a framed print in the dark grid
  (charcoal renders don't need it).
- QC the image with the Read tool before shipping (colours vs the researched
  spec — the user is the final judge on brand colours).

Fail-safe: it is safe to wire a path before the file exists — cards show a
"documentation pending" placeholder, never a broken image.

## 7. Ship

Run the `/ship` skill (typecheck → build → commit → push → confirm deploy).
