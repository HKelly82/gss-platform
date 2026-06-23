// Targeted contrast probe — pulls actual measured ratios from axe for the
// recurring color-contrast violations so we can speak to spec compliance with
// numbers, not just rule ids.
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const BASE = 'https://gss-platform-seven.vercel.app';
const ROUTES = ['/', '/pm/M1', '/pm/M1/T1/check', '/pm/M1/diagnostic', '/sme/S1', '/pm/M1/T1/takeaway'];

const out = [];
const browser = await chromium.launch();
for (const path of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(400);
  const result = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  for (const v of result.violations) {
    for (const node of v.nodes) {
      // contrast info is inside node.any[*].data
      const checks = (node.any || []).concat(node.all || [], node.none || []);
      const contrastCheck = checks.find(c => c.id === 'color-contrast');
      const d = contrastCheck?.data || {};
      out.push({
        route: path,
        selector: node.target.join(' '),
        html: node.html.slice(0, 180),
        contrastRatio: d.contrastRatio,
        fgColor: d.fgColor,
        bgColor: d.bgColor,
        fontSize: d.fontSize,
        fontWeight: d.fontWeight,
        expectedContrastRatio: d.expectedContrastRatio,
        messageKey: d.messageKey,
      });
    }
  }
  await ctx.close();
}
await browser.close();
writeFileSync('C:/Users/hmkel/gss-platform/working/qa-reports/vercel-audit/contrast-detail.json', JSON.stringify(out, null, 2));
console.log('rows:', out.length);
for (const r of out) console.log(`${r.route} | ${r.contrastRatio} (need ${r.expectedContrastRatio}) | fg=${r.fgColor} bg=${r.bgColor} | ${r.selector.slice(0,80)}`);
