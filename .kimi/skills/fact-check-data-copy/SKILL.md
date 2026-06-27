# Fact-Check Data Copy

Use this skill when a site presents claims, statistics, or observations that should be verified against the project's own dataset.

## When to use

- A section like "Did You Know" or "Patterns" makes quantitative claims.
- The user asks you to "fact check" the site.
- You suspect a UI component is using the wrong field names from the data model.

## Process

1. Read the data source (usually `src/data/products.ts` or similar).
2. Write small Node.js snippets to aggregate the data:
   - counts by country / brand / region
   - averages, min/max, ratios
   - boolean or categorical checks (e.g., "scented", "domestically manufactured")
3. Compare the computed values against the copy on the page.
4. Rewrite the copy to match the data, or update the data if the copy is authoritative.
5. Keep claims cautious: use "in this archive" when the dataset is small or incomplete.

## Common verification queries

```bash
node -e "
const { products } = require('./src/data/products.ts');
console.log('count:', products.length);
const byCountry = {};
products.forEach(p => { byCountry[p.country] = (byCountry[p.country] || 0) + 1; });
console.log(byCountry);
"
```

## Tips

- Do not trust hard-coded numbers like "43 specimens · 21 countries" without cross-checking.
- Watch for field-name mismatches (e.g., `price` vs `priceUSD`, `materials` vs `material`, `flag` vs `getFlagEmoji`).
- When a claim cannot be verified from the dataset, either soften the language or remove it.
