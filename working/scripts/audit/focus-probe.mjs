// Probe T4 reveal focus behaviour more carefully.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
const page = await ctx.newPage();
await page.goto('https://gss-platform-seven.vercel.app/pm/M1/T4/answer', { waitUntil: 'domcontentloaded' });
await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
await page.waitForTimeout(1500);

const btn = page.locator('button[aria-controls]').first();
// Focus the button first, then click
await btn.focus();
await page.waitForTimeout(200);
const focused0 = await page.evaluate(() => ({ tag: document.activeElement?.tagName, txt: document.activeElement?.textContent?.trim().slice(0,80) }));
console.log('focused before click:', focused0);
await btn.click();
// poll for up to 2s, sampling document.activeElement every 100ms
for (let i = 0; i < 20; i++) {
  await page.waitForTimeout(100);
  const a = await page.evaluate(() => ({
    tag: document.activeElement?.tagName,
    role: document.activeElement?.getAttribute('role'),
    aria: document.activeElement?.getAttribute('aria-label'),
    tabIdx: document.activeElement?.getAttribute('tabindex'),
    txt: (document.activeElement?.textContent || '').trim().slice(0,60),
  }));
  console.log(`t=${(i+1)*100}ms`, a);
}
await browser.close();
