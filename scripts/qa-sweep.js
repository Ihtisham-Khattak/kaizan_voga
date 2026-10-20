// Opens every screen and reports page errors and sideways overflow.
// Usage: node scripts/qa-sweep.js [width] [theme] [bigText yes|no] [lang en|ur]   (needs the web preview on :8099 and puppeteer-core in .tools/shotter)
const puppeteer = require('../.tools/shotter/node_modules/puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const [W = '320', THEME = 'light', BIG = 'no', LANG = 'en'] = process.argv.slice(2);
const APP = ['home', 'explore', 'progress', 'profile', 'favorites', 'search', 'library/styles', 'library/programs', 'library/category/standing', 'library/collection/sleep', 'library/style/prenatal', 'pose/ex-01', 'pose/ex-52', 'routine/r-01', 'routine/r-17', 'program/p-30', 'program/p-begin', 'session/setup?routineId=r-01', 'breathing', 'breathing/calm-breath', 'journey/calendar', 'journey/mood', 'journey/reflection', 'journey/achievements', 'journey/history', 'premium', 'premium/help-affording', 'settings/preferences', 'settings/goals', 'settings/reminders', 'settings/accessibility', 'settings/health', 'settings/downloads', 'settings/privacy', 'settings/subscription', 'settings/safety', 'settings/help', 'settings/contact', 'settings/about', 'settings/terms', 'support/resources'];
const FUNNEL = ['goals', 'experience', 'time', 'schedule', 'movement', 'equipment', 'accessibility', 'voice', 'safety', 'reminders', 'plan', 'under-18', 'gate', 'sign-in', 'sign-up', 'forgot-password'];
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: +W, height: 800 });
  if (LANG === 'ur') await p.evaluateOnNewDocument(() => { Object.defineProperty(navigator, 'languages', { get: () => ['ur-PK', 'ur'] }); Object.defineProperty(navigator, 'language', { get: () => 'ur-PK' }); document.addEventListener('DOMContentLoaded', () => { document.documentElement.dir = 'rtl'; }); });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message.slice(0, 100)));
  await p.goto('http://localhost:8099/dev/ui-kit', { waitUntil: 'domcontentloaded', timeout: 280000 });
  let bad = 0, total = 0;
  for (const [list, done] of [[APP, true], [FUNNEL, false]]) {
    for (const r of list) {
      await p.evaluate((theme, big, done) => {
        localStorage.clear();
        localStorage.setItem('kz-app', JSON.stringify({ state: { theme, hasSeenStory: true, onboardingComplete: done, textScale: big === 'yes' ? 1.3 : 1 }, version: 1 }));
        localStorage.setItem('kz-auth', JSON.stringify({ state: { status: done ? 'guest' : 'none', user: null }, version: 1 }));
        localStorage.setItem('kz-prefs', JSON.stringify({ state: { goals: ['sleep', 'stress'], minutesPerDay: 10, preferredTime: 'evening', experience: 'beginner' }, version: 2 }));
      }, THEME, BIG, done);
      errs.length = 0;
      await p.goto('http://localhost:8099/' + r, { waitUntil: 'networkidle0', timeout: 200000 }); await sleep(1800);
      const m = await p.evaluate(() => {
        const vw = window.innerWidth;
        let worst = 0, who = '';
        for (const e of document.querySelectorAll('body *')) { const rc = e.getBoundingClientRect(); if (rc.width > 0 && rc.right > vw + 2) { const over = rc.right - vw; const cs = getComputedStyle(e); let clipped = false; for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a); if (/(hidden|auto|scroll)/.test(o.overflowX)) { clipped = true; break; } } if (!clipped && over > worst) { worst = over; who = (e.getAttribute('aria-label') || e.innerText || e.tagName).slice(0, 30); } } }
        const notFound = /(can.t|couldn.t|could not) find that/i.test(document.body.innerText);
        return { overflow: Math.round(worst), who, notFound, path: location.pathname };
      });
      total++;
      const flag = m.overflow > 2 || m.notFound || errs.length;
      if (flag) { bad++; console.log(`✖ ${r.padEnd(34)} ${m.notFound ? 'NOT FOUND ' : ''}${m.overflow > 2 ? 'overflow ' + m.overflow + 'px (' + m.who + ') ' : ''}${errs.length ? 'ERR ' + errs[0] : ''}`); }
    }
  }
  console.log(`${W}px ${THEME}${BIG === 'yes' ? ' 130% text' : ''}${LANG === 'ur' ? ' Urdu' : ''}: ${total} screens, ${bad} with problems`);
  await b.close();
})();
