// GSS Platform — Vercel live deployment audit runner.
// Headless Chromium via Playwright + axe-core. Writes screenshots + JSON results.
//
// Usage:
//   NODE_OPTIONS=--use-system-ca node run-audit.mjs

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://gss-platform-seven.vercel.app';
const OUT = 'C:/Users/hmkel/gss-platform/working/qa-reports/vercel-audit';
const SHOTS = join(OUT, 'screenshots');
mkdirSync(SHOTS, { recursive: true });

const VPS = {
  '375':  { width: 375,  height: 812  },
  '768':  { width: 768,  height: 1024 },
  '1024': { width: 1024, height: 768  },
  '1440': { width: 1440, height: 900  },
};

// route, viewports, slug (file-safe), pageKind for special interactions
const ROUTES = [
  { path: '/',                          vps: ['375','768','1024','1440'], slug: 'home' },
  { path: '/l0',                        vps: ['1024'],                    slug: 'l0' },
  { path: '/pm',                        vps: ['375','768','1024','1440'], slug: 'pm' },
  { path: '/pm/M1',                     vps: ['375','768','1024','1440'], slug: 'pm-M1',                 kind: 'module-hub' },
  { path: '/pm/M3',                     vps: ['1024'],                    slug: 'pm-M3' },
  { path: '/pm/M1/diagnostic',          vps: ['1024','375'],              slug: 'pm-M1-diagnostic',     kind: 'diagnostic' },
  { path: '/pm/M1/T1',                  vps: ['1024','375'],              slug: 'pm-M1-T1' },
  { path: '/pm/M1/T1/scenario',         vps: ['375','768','1024','1440'], slug: 'pm-M1-T1-scenario' },
  { path: '/pm/M1/T1/guided',           vps: ['1024','375'],              slug: 'pm-M1-T1-guided' },
  { path: '/pm/M1/T1/check',            vps: ['1024','375'],              slug: 'pm-M1-T1-check',       kind: 'mcq' },
  { path: '/pm/M1/T1/takeaway',         vps: ['1024'],                    slug: 'pm-M1-T1-takeaway' },
  { path: '/pm/M3/T4/exercise',         vps: ['1024','375'],              slug: 'pm-M3-T4-exercise' },
  { path: '/pm/M3/T4/critique',         vps: ['1024'],                    slug: 'pm-M3-T4-critique' },
  { path: '/pm/M3/T4/answer',           vps: ['1024'],                    slug: 'pm-M3-T4-answer',      kind: 'reveal' },
  { path: '/pm/M3/T4/reflection',       vps: ['1024'],                    slug: 'pm-M3-T4-reflection' },
  { path: '/pm/M1/reference',           vps: ['1024'],                    slug: 'pm-M1-reference' },
  { path: '/sme',                       vps: ['1024'],                    slug: 'sme' },
  { path: '/sme/S1',                    vps: ['1024'],                    slug: 'sme-S1' },
];

const results = {
  startedAt: new Date().toISOString(),
  base: BASE,
  routes: [],
  interactions: {},
  axeAggregate: { byRule: {}, bySeverity: { critical: 0, serious: 0, moderate: 0, minor: 0 } },
};

function shotPath(slug, vp, suffix='') {
  const s = suffix ? `-${suffix}` : '';
  return join(SHOTS, `${slug}-${vp}${s}.png`);
}

async function gotoSafely(page, url, timeoutMs=30000) {
  const t0 = Date.now();
  let status = null;
  let error = null;
  let timedOut = false;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    status = resp ? resp.status() : null;
    // small settle for hydration; don't wait too long
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(()=>{});
  } catch (e) {
    error = String(e);
    timedOut = String(e).includes('Timeout');
  }
  return { status, error, timedOut, ms: Date.now() - t0 };
}

async function runAxe(page) {
  try {
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'])
      .analyze();
    return {
      violations: result.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.length,
        targets: v.nodes.slice(0,3).map(n => n.target.join(' ')),
      })),
    };
  } catch (e) {
    return { violations: [], error: String(e) };
  }
}

async function measurePerf(page) {
  // crude LCP / CLS via PerformanceObserver hook injected pre-navigation.
  // Run after page is settled.
  try {
    return await page.evaluate(async () => {
      // best-effort: read what the browser has, no long wait
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const lcp = lcpEntries.length ? lcpEntries[lcpEntries.length-1].startTime : null;
      const navi = performance.getEntriesByType('navigation')[0];
      return {
        lcp,
        ttfb: navi ? navi.responseStart : null,
        domContentLoaded: navi ? navi.domContentLoadedEventEnd : null,
        loadEvent: navi ? navi.loadEventEnd : null,
      };
    });
  } catch { return {}; }
}

async function auditRoute(browser, route) {
  const routeResults = { path: route.path, slug: route.slug, viewports: [] };
  for (const vpKey of route.vps) {
    const vp = VPS[vpKey];
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    const consoleMsgs = [];
    const pageErrors = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push({ type: m.type(), text: m.text() }); });
    page.on('pageerror', e => pageErrors.push(String(e)));

    const nav = await gotoSafely(page, BASE + route.path);
    // give hydration a tick
    await page.waitForTimeout(500);
    const perf = await measurePerf(page);
    let axe = { violations: [] };
    let shotErr = null;
    try {
      await page.screenshot({ path: shotPath(route.slug, vpKey), fullPage: true, timeout: 15000 });
    } catch (e) { shotErr = String(e); }

    if (nav.status && nav.status >= 200 && nav.status < 400) {
      axe = await runAxe(page);
    }

    // aggregate axe rule counts
    for (const v of axe.violations) {
      const sev = v.impact || 'minor';
      if (results.axeAggregate.bySeverity[sev] != null) results.axeAggregate.bySeverity[sev] += v.nodes;
      const key = v.id;
      if (!results.axeAggregate.byRule[key]) results.axeAggregate.byRule[key] = { impact: sev, total: 0, routes: [] };
      results.axeAggregate.byRule[key].total += v.nodes;
      results.axeAggregate.byRule[key].routes.push(`${route.path}@${vpKey}(${v.nodes})`);
    }

    routeResults.viewports.push({
      vp: vpKey, status: nav.status, ms: nav.ms, navError: nav.error, timedOut: nav.timedOut,
      shotErr, perf,
      axeViolationCount: axe.violations.length,
      axeViolations: axe.violations,
      consoleMsgs, pageErrors,
    });

    // route-kind specific interactions
    try {
      if (route.kind === 'module-hub' && vpKey === '375') {
        await runMobileDrawer(page, route.slug);
      }
      if (route.kind === 'module-hub' && vpKey === '1024') {
        await runKeyboardTab(page, route.slug);
      }
      if (route.kind === 'mcq' && vpKey === '1024') {
        await runMCQInteraction(page, route.slug);
      }
      if (route.kind === 'reveal' && vpKey === '1024') {
        await runRevealInteraction(page, route.slug);
      }
      if (route.kind === 'diagnostic' && vpKey === '1024') {
        await runDiagnosticRouting(page, route.slug);
      }
    } catch (e) {
      results.interactions[`${route.slug}-${vpKey}-err`] = String(e);
    }

    await ctx.close();
  }
  results.routes.push(routeResults);
}

async function runMobileDrawer(page, slug) {
  const log = {};
  // find the disclosure button (label includes "modules")
  const btn = page.getByRole('button', { name: /modules/i }).first();
  log.found = await btn.count() > 0;
  if (!log.found) { results.interactions[`${slug}-drawer`] = log; return; }
  log.initial = {
    expanded: await btn.getAttribute('aria-expanded'),
    label: (await btn.textContent())?.trim(),
  };
  await page.screenshot({ path: shotPath(slug, '375', 'drawer-closed'), fullPage: true });
  await btn.click();
  await page.waitForTimeout(200);
  log.afterClick = {
    expanded: await btn.getAttribute('aria-expanded'),
    label: (await btn.textContent())?.trim(),
    focused: await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0,40)),
  };
  await page.screenshot({ path: shotPath(slug, '375', 'drawer-open'), fullPage: true });
  // check the controlled region exists
  const controls = await btn.getAttribute('aria-controls');
  log.aria_controls = controls;
  if (controls) {
    const targetVisible = await page.locator(`#${controls}`).first().isVisible().catch(() => false);
    log.controlled_region_visible_after_open = targetVisible;
  }
  results.interactions[`${slug}-drawer`] = log;
}

async function runKeyboardTab(page, slug) {
  const log = { stops: [] };
  // page should already be loaded; tab from start
  await page.evaluate(() => { document.body.focus(); });
  for (let i = 1; i <= 10; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
      const boxShadow = style.boxShadow && style.boxShadow !== 'none';
      return {
        tag: el.tagName,
        role: el.getAttribute('role'),
        ariaLabel: el.getAttribute('aria-label'),
        text: (el.textContent || '').trim().slice(0, 80),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        outlineStyle: style.outlineStyle,
        outlineColor: style.outlineColor,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
        hasFocusIndicator: outline || boxShadow,
      };
    });
    log.stops.push({ stop: i, ...info });
    if ([1,3,5,7,9].includes(i)) {
      await page.screenshot({ path: shotPath(slug, '1024', `kbd-${i}`), fullPage: false });
    }
  }
  results.interactions[`${slug}-keyboard`] = log;
}

async function runMCQInteraction(page, slug) {
  const log = {};
  // try to find first MCQ buttons; the renderer uses <button> per option.
  // Find buttons whose text starts with a letter A-D and a period in option chrome.
  // Safer: pick buttons inside the first ol/section that has option-shaped children.
  // We'll attempt: every button on the page; first one whose text looks like option.
  const optionBtns = page.locator('button:has-text("Model answer"), button >> nth=0');
  // Use a more targeted approach: find buttons grouped under role=group
  const groups = page.locator('[role="group"]');
  const groupCount = await groups.count();
  log.mcqGroups = groupCount;
  if (!groupCount) { results.interactions[`${slug}-mcq`] = log; return; }
  const firstGroup = groups.first();
  const firstBtns = firstGroup.locator('button');
  const n = await firstBtns.count();
  log.firstGroupOptionCount = n;

  // screenshot initial
  await page.screenshot({ path: shotPath(slug, '1024', 'mcq-initial'), fullPage: true });

  // Try each option one by one; success = "model answer" text appears (or aria-live announces correct)
  let resolved = false;
  for (let i = 0; i < n; i++) {
    const btn = firstBtns.nth(i);
    await btn.click().catch(()=>{});
    await page.waitForTimeout(400);
    // look for revealed correct state: presence of "Model answer" text or "stronger answer"
    const revealed = await page.locator(':text-matches("Model answer|stronger answer|Why this is", "i")').first().isVisible().catch(()=>false);
    if (revealed) {
      log.correctOptionIdx = i;
      log.optionText = (await btn.textContent())?.trim().slice(0, 80);
      resolved = true;
      break;
    }
  }
  log.resolvedFirstQuestion = resolved;
  await page.screenshot({ path: shotPath(slug, '1024', 'mcq-resolved'), fullPage: true });

  // try wrong-then-right on a second question if any
  if (groupCount > 1) {
    const g2 = groups.nth(1);
    const opts = g2.locator('button');
    const m = await opts.count();
    log.secondGroupOptionCount = m;
    if (m >= 2) {
      // click first option, check whether it's marked wrong
      await opts.nth(0).click().catch(()=>{});
      await page.waitForTimeout(300);
      const stateAfter1 = await page.evaluate(() => document.activeElement?.getAttribute('aria-pressed'));
      log.q2_firstClickAriaPressed = stateAfter1;
      // then try all others
      for (let j = 1; j < m; j++) {
        await opts.nth(j).click().catch(()=>{});
        await page.waitForTimeout(250);
      }
      await page.screenshot({ path: shotPath(slug, '1024', 'mcq-q2-explored'), fullPage: true });
    }
  }
  results.interactions[`${slug}-mcq`] = log;
}

async function runRevealInteraction(page, slug) {
  const log = {};
  // find "Reveal" / "Show model answer" button
  const btn = page.getByRole('button', { name: /reveal|show model|show answer/i }).first();
  log.found = await btn.count() > 0;
  if (!log.found) { results.interactions[`${slug}-reveal`] = log; return; }
  log.before = {
    expanded: await btn.getAttribute('aria-expanded'),
    text: (await btn.textContent())?.trim(),
  };
  await page.screenshot({ path: shotPath(slug, '1024', 'reveal-before'), fullPage: true });
  await btn.click();
  await page.waitForTimeout(400);
  const controls = await btn.getAttribute('aria-controls');
  log.aria_controls = controls;
  if (controls) {
    log.panelVisible = await page.locator(`#${controls}`).first().isVisible().catch(()=>false);
  }
  log.after = {
    activeElText: await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0,60)),
  };
  await page.screenshot({ path: shotPath(slug, '1024', 'reveal-after'), fullPage: true });
  results.interactions[`${slug}-reveal`] = log;
}

async function runDiagnosticRouting(page, slug) {
  const log = {};
  // find first option choice button; the diagnostic renders 4 cards as buttons
  // Try role=group then buttons inside
  const candidates = page.locator('button, a').filter({ hasText: /^(A\.|B\.|C\.|D\.|Option\s|Choose\s|Proceed|Begin|Start)/i });
  const groupBtns = page.locator('[role="group"] button, fieldset button');
  let chosen = null;
  if (await groupBtns.count() > 0) chosen = groupBtns.first();
  else if (await candidates.count() > 0) chosen = candidates.first();
  if (!chosen) {
    // fallback: first interactive child of main
    const mainBtn = page.locator('main button').first();
    if (await mainBtn.count() > 0) chosen = mainBtn;
  }
  if (!chosen) { results.interactions[`${slug}-diagnostic`] = { found: false }; return; }
  log.chosenText = (await chosen.textContent())?.trim().slice(0, 120);
  const urlBefore = page.url();
  await chosen.click().catch((e)=>{ log.clickErr = String(e); });
  // wait for navigation or any URL change up to 5s
  try {
    await page.waitForURL((url) => url.toString() !== urlBefore, { timeout: 5000 });
  } catch {}
  log.urlBefore = urlBefore;
  log.urlAfter = page.url();
  log.routed = urlBefore !== page.url();
  await page.screenshot({ path: shotPath(slug, '1024', 'diagnostic-after-click'), fullPage: true });
  results.interactions[`${slug}-diagnostic`] = log;
}

// ---- main ----
(async () => {
  const browser = await chromium.launch();
  for (const route of ROUTES) {
    process.stdout.write(`[audit] ${route.path}\n`);
    try {
      await auditRoute(browser, route);
    } catch (e) {
      process.stdout.write(`  ! failed: ${e}\n`);
      results.routes.push({ path: route.path, slug: route.slug, fatalError: String(e) });
    }
  }
  await browser.close();
  results.finishedAt = new Date().toISOString();
  writeFileSync(join(OUT, 'results.json'), JSON.stringify(results, null, 2));
  process.stdout.write(`[audit] done -> ${join(OUT, 'results.json')}\n`);
})();
