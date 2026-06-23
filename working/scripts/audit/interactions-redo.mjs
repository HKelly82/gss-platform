// Re-runs the two interactions that had issues: T4 reveal and MCQ.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://gss-platform-seven.vercel.app';
const SHOTS = 'C:/Users/hmkel/gss-platform/working/qa-reports/vercel-audit/screenshots';

const out = {};

const browser = await chromium.launch();

// ---- T4 reveal ----
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/pm/M1/T4/answer', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(1500); // let client island hydrate
  // list all buttons we can find
  const allBtns = await page.locator('button').all();
  const btnInfo = [];
  for (const b of allBtns) {
    const t = (await b.textContent())?.trim();
    btnInfo.push(t);
  }
  out.t4_reveal = { route: '/pm/M1/T4/answer', buttonsFound: btnInfo };
  // pick by aria-controls
  const target = page.locator('button[aria-controls]').first();
  if (await target.count() > 0) {
    out.t4_reveal.before = {
      text: (await target.textContent())?.trim(),
      ariaExpanded: await target.getAttribute('aria-expanded'),
      ariaControls: await target.getAttribute('aria-controls'),
    };
    await page.screenshot({ path: join(SHOTS, 'pm-M1-T4-answer-1024-reveal-before.png'), fullPage: true });
    await target.click();
    await page.waitForTimeout(500);
    const controls = out.t4_reveal.before.ariaControls;
    out.t4_reveal.after = {
      ariaExpanded: await target.getAttribute('aria-expanded').catch(()=>null),
      panelExists: await page.locator(`[id="${controls}"]`).count(),
      panelVisible: await page.locator(`[id="${controls}"]`).first().isVisible().catch(()=>false),
      focusedText: await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0,80)),
      focusedTag: await page.evaluate(() => document.activeElement?.tagName),
      focusedRole: await page.evaluate(() => document.activeElement?.getAttribute('role')),
    };
    await page.screenshot({ path: join(SHOTS, 'pm-M1-T4-answer-1024-reveal-after.png'), fullPage: true });
  }
  await ctx.close();
}

// ---- MCQ ----
{
  const ctx = await browser.newContext({ viewport: { width: 1024, height: 768 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/pm/M1/T1/check', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(1500);

  // collect option labels for each group
  const groups = page.locator('[role="group"]');
  const gN = await groups.count();
  out.mcq = { groups: gN, qs: [] };
  for (let g = 0; g < gN; g++) {
    const opts = groups.nth(g).locator('button');
    const labels = [];
    for (let i = 0; i < await opts.count(); i++) {
      labels.push((await opts.nth(i).textContent())?.trim().slice(0, 100));
    }
    out.mcq.qs.push({ groupIdx: g, optionLabels: labels });
  }

  // Try Q1: click each option in turn, observe state via aria-pressed
  const q1 = groups.first();
  const q1opts = q1.locator('button');
  const q1n = await q1opts.count();
  const trace = [];
  // reload to get clean state per attempt
  for (let i = 0; i < q1n; i++) {
    await page.reload();
    await page.waitForTimeout(800);
    const grp = page.locator('[role="group"]').first();
    const btns = grp.locator('button');
    const target = btns.nth(i);
    await target.click();
    await page.waitForTimeout(400);
    // read aria-pressed/disabled and the eyebrow text that appeared
    const state = await target.evaluate(el => ({
      ariaPressed: el.getAttribute('aria-pressed'),
      disabled: el.disabled,
      ariaDisabled: el.getAttribute('aria-disabled'),
      cls: el.className,
      txt: el.textContent.trim().slice(0,120),
    }));
    // global feedback markers
    const correctRevealVisible = await page.locator(':text-matches("Model answer|Why this is the stronger answer", "i")').first().isVisible().catch(()=>false);
    trace.push({ tried: i, ...state, correctRevealVisible });
  }
  out.mcq.q1_per_option_trace = trace;

  // screenshot the page in its initial state
  await page.reload();
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(SHOTS, 'pm-M1-T1-check-1024-mcq-initial.png'), fullPage: true });
  // click whichever option in trace had correctRevealVisible
  const correctIdx = trace.findIndex(t => t.correctRevealVisible);
  if (correctIdx >= 0) {
    const grp = page.locator('[role="group"]').first();
    const btn = grp.locator('button').nth(correctIdx);
    await btn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(SHOTS, 'pm-M1-T1-check-1024-mcq-resolved.png'), fullPage: true });
  }
  await ctx.close();
}

// ---- Sidebar drawer re-check (confirm controlled region) ----
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/pm/M1', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  await page.waitForTimeout(1200);
  const btn = page.getByRole('button', { name: /modules/i }).first();
  const ctrl = await btn.getAttribute('aria-controls');
  // Inspect element with that id
  const info = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return { exists: false };
    return {
      exists: true,
      tag: el.tagName,
      cls: el.className,
      hidden: el.hidden,
      offsetParent: el.offsetParent != null,
      display: getComputedStyle(el).display,
      visibility: getComputedStyle(el).visibility,
      childCount: el.children.length,
    };
  }, ctrl);
  out.drawer = { ariaControls: ctrl, beforeOpen: info };
  await btn.click();
  await page.waitForTimeout(300);
  const after = await page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) return { exists: false };
    return {
      exists: true,
      hidden: el.hidden,
      offsetParent: el.offsetParent != null,
      display: getComputedStyle(el).display,
      visibility: getComputedStyle(el).visibility,
      childCount: el.children.length,
    };
  }, ctrl);
  out.drawer.afterOpen = after;
  await ctx.close();
}

await browser.close();
writeFileSync('C:/Users/hmkel/gss-platform/working/qa-reports/vercel-audit/interactions-redo.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
