// Extra probes: sticky footer obscuring focus near page bottom (SC 2.4.11),
// target size of footer dots (SC 2.5.8), heading hierarchy quick scan.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const browser = await chromium.launch();
const out = {};

// --- SC 2.4.11: tab through guided page until we focus a link near the bottom
//     and check whether the sticky footer overlaps it.
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  await page.goto('https://gss-platform-seven.vercel.app/pm/M1/T1/guided', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(800);
  // scroll to bottom first
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  // tab around and look at sticky footer overlap
  const stickyInfo = await page.evaluate(() => {
    // find element with position:sticky or fixed in the bottom of the layout
    const all = Array.from(document.querySelectorAll('nav, footer, div'));
    const sticky = all.find(el => {
      const s = getComputedStyle(el);
      return (s.position === 'sticky' || s.position === 'fixed') && parseFloat(s.bottom) >= 0 && el.getBoundingClientRect().bottom > window.innerHeight - 100;
    });
    if (!sticky) return { found: false };
    const r = sticky.getBoundingClientRect();
    const html = getComputedStyle(document.documentElement);
    return {
      found: true,
      tag: sticky.tagName,
      cls: sticky.className.slice(0, 200),
      rect: { top: r.top, bottom: r.bottom, height: r.height },
      htmlScrollPaddingBottom: html.scrollPaddingBottom,
      bodyScrollPaddingBottom: getComputedStyle(document.body).scrollPaddingBottom,
    };
  });
  out.sticky_footer = stickyInfo;
}

// --- SC 2.5.8 target size: measure interactive elements on a few pages
async function measureTargets(page) {
  return await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]'));
    const small = [];
    for (const el of els) {
      if (el.offsetParent == null) continue; // not visible
      const r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 24) {
        small.push({
          tag: el.tagName,
          role: el.getAttribute('role'),
          text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50),
          w: Math.round(r.width),
          h: Math.round(r.height),
          cls: el.className.slice(0, 100),
        });
      }
    }
    return { totalInteractive: els.length, smallCount: small.length, small };
  });
}
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  const out_size = {};
  for (const p of ['/pm/M1', '/pm/M1/T1/check', '/pm/M1/T1/takeaway', '/pm/M1/reference']) {
    await page.goto('https://gss-platform-seven.vercel.app' + p, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
    await page.waitForTimeout(500);
    out_size[p] = await measureTargets(page);
  }
  out.target_size = out_size;
  await ctx.close();
}

// --- Heading hierarchy: list h1-h6 on a representative selection
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  const head = {};
  for (const p of ['/pm/M1', '/pm/M1/T1', '/pm/M1/T1/guided', '/pm/M1/T1/check', '/pm/M1/T1/takeaway', '/pm/M1/reference', '/sme/S1']) {
    await page.goto('https://gss-platform-seven.vercel.app' + p, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
    await page.waitForTimeout(500);
    head[p] = await page.evaluate(() => Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
      .map(h => ({ lvl: +h.tagName[1], text: (h.textContent || '').trim().slice(0, 90) })));
  }
  out.headings = head;
  await ctx.close();
}

// --- Diagnostic option D routing
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  await page.goto('https://gss-platform-seven.vercel.app/pm/M1/diagnostic', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(500);
  const buttons = page.locator('[role="group"] button');
  const cnt = await buttons.count();
  const labels = [];
  for (let i = 0; i < cnt; i++) labels.push((await buttons.nth(i).textContent())?.trim().slice(0, 60));
  out.diagnostic_buttons = labels;
  // click last (D)
  if (cnt >= 4) {
    await buttons.nth(3).click();
    try { await page.waitForURL(u => u.toString() !== 'https://gss-platform-seven.vercel.app/pm/M1/diagnostic', { timeout: 5000 }); } catch {}
    out.diagnostic_optionD_to = page.url();
  }
  await ctx.close();
}

// --- Reference card: print button presence, contrast on grey bg
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  await page.goto('https://gss-platform-seven.vercel.app/pm/M1/reference', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(500);
  out.reference_card = {
    hasDownloadButton: await page.locator('button:has-text("Download")').count(),
    hasPrintCta: await page.locator(':text-matches("print|download", "i")').count(),
  };
  await ctx.close();
}

await browser.close();
writeFileSync('C:/Users/hmkel/gss-platform/working/qa-reports/vercel-audit/extras.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
