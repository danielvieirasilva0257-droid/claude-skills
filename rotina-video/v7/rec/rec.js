// Records the real Rotina app (artifact HTML served locally) with a scripted, VO-timed session.
// Output: frames/<n>.jpg + frames.json (timestamps) + taps.json. Usage: node rec.js <url> <outdir> [testOnly]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const url = process.argv[2], out = process.argv[3], T0 = 2.0; // video time when recording starts
fs.mkdirSync(path.join(out, 'frames'), { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--disable-gpu-vsync'] });
  const ctx = await b.newContext({ viewport: { width: 1170, height: 2532 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
  const p = await ctx.newPage(); p.setDefaultTimeout(2500);
  await p.addInitScript(() => { const off = new Date(2026,10,5,8,40).getTime() - Date.now(); const D = Date; class FD extends D { constructor(...a){ if(!a.length) super(D.now()+off); else super(...a);} static now(){ return D.now()+off; } } window.Date = FD; try{localStorage.clear()}catch(e){} document.addEventListener('DOMContentLoaded', () => { const s = document.createElement('style'); s.textContent = 'html{zoom:3}'; document.head.appendChild(s); }); });
  await p.goto('about:blank');
  const cdp = await ctx.newCDPSession(p);
  const frames = []; let n = 0, t0 = null;
  cdp.on('Page.screencastFrame', async (f) => {
    const ts = f.metadata.timestamp; if (t0 === null) t0 = ts;
    const file = String(n++).padStart(5, '0') + '.jpg';
    fs.writeFileSync(path.join(out, 'frames', file), Buffer.from(f.data, 'base64'));
    frames.push({ t: ts - t0, file });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, everyNthFrame: 1, maxWidth: 1170, maxHeight: 2532 });
  const start = Date.now(); const now = () => (Date.now() - start) / 1000 + T0;
  const until = async (vt) => { const w = (vt - now()) * 1000; if (w > 0) await p.waitForTimeout(w); };
  const taps = [];
  const loc = (t) => p.locator('button,[role=tab],[role=button],label').filter({ hasText: new RegExp('^\\s*' + t + '\\s*$', 'i') }).last();
  const tapL = async (l) => { const bx = await l.boundingBox(); const x = Math.min(1130, Math.max(40, bx.x + bx.width / 2)), y = bx.y + bx.height / 2; taps.push({ t: now(), x, y }); await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(110); await p.mouse.up(); };
  const tap = async (t, first) => tapL(first ? p.locator('button,[role=tab],[role=button],label').filter({ hasText: new RegExp('^\\s*' + t + '\\s*$', 'i') }).first() : loc(t));
  const tapTab = async (t) => { const l = loc(t); await l.evaluate(e => e.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })); await p.waitForTimeout(280); await tapL(l); };
  const tapLabel = async (t) => tapL(p.getByLabel(t, { exact: true }).first());
  const type = async (s) => { await p.keyboard.type(s, { delay: 70 }); };
  const scroller = async () => p.evaluateHandle(() => { const els = [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e); return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 20; }); return els.sort((a, b) => b.clientHeight - a.clientHeight)[0]; });
  const scrollTo = async (target, dur) => { const h = await scroller(); taps.push({ t: now(), swipe: true, dur }); await p.evaluate(([el, target, dur]) => new Promise(r => { const y0 = el.scrollTop; const y1 = typeof target === 'number' ? (target < 0 ? y0 - target : target) : (() => { const n = [...el.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim().toUpperCase().startsWith(target.toUpperCase())); const r = el.getBoundingClientRect().height / el.offsetHeight; return n ? y0 + (n.getBoundingClientRect().top - el.getBoundingClientRect().top) / r - 8 : y0; })(); const s = performance.now(); const f = (k) => { const u = Math.min(1, (k - s) / (dur * 1000)); const e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; el.scrollTop = y0 + (y1 - y0) * e; u < 1 ? requestAnimationFrame(f) : r(); }; requestAnimationFrame(f); }), [h, target, dur]); };
  const mark = (name) => taps.push({ t: now(), mark: name });

  await p.goto(url, { waitUntil: 'commit' }); mark('load');
  if (process.argv[4]) { await p.waitForTimeout(3000); await tap('FINANCEIRO'); await p.waitForTimeout(1500); await scrollTo('ORÇAMENTOS', 1.2); await p.waitForTimeout(800); }
  else { await require('./session.js')({ p, until, tap, tapL, tapTab, tapLabel, type, scrollTo, mark, loc, now }); }
  await p.waitForTimeout(300);
  await cdp.send('Page.stopScreencast');
  fs.writeFileSync(path.join(out, 'frames.json'), JSON.stringify(frames));
  fs.writeFileSync(path.join(out, 'taps.json'), JSON.stringify({ T0, taps }, null, 1));
  const d = frames[frames.length - 1].t; console.log('frames', frames.length, 'dur', d.toFixed(2), 'fps', (frames.length / d).toFixed(1));
  await b.close();
})();
