(() => {
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const toast = $('.toast'); let toastT;
function say(msg){ toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 1800); }

/* ---- theme ---- */
const root = document.documentElement;
function setTheme(t, save){ root.dataset.theme = t; $$('.theme-btn').forEach(b => { b.setAttribute('aria-pressed', t === 'dark'); const sp = $('span', b); if (sp) sp.textContent = t === 'dark' ? 'Light mode' : 'Dark mode'; }); if (save) try { localStorage.setItem('theme', t); } catch (e) {} }
setTheme(root.dataset.theme || 'light');
$$('.theme-btn').forEach(b => b.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true)));

/* ---- progress + back to top ---- */
const bar = $('.progress'), up = $('.to-top'); let tick = false;
function onScroll(){ const h = root.scrollHeight - innerHeight; bar.style.setProperty('--p', h > 0 ? scrollY / h : 0); up.classList.toggle('show', scrollY > innerHeight * .8); tick = false; }
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
up.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

/* ---- navigation highlight ---- */
const links = $$('[data-nav]'), topbar = $('.topbar');
const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return;
  links.forEach(a => a.removeAttribute('aria-current'));
  links.filter(a => a.dataset.nav === e.target.id).forEach(a => { a.setAttribute('aria-current', 'true'); if (topbar && topbar.contains(a)) topbar.scrollTo({ left: a.offsetLeft - 70, behavior: 'smooth' }); });
}), { rootMargin: '-40% 0px -55% 0px' });
$$('main section[id]').forEach(s => io.observe(s));

/* ---- hero: morphing signal + portrait tilt ---- */
const wave = $('#wave'), wp = $('#wavePath'), slider = $('#morph'), box = $('#waveBox');
function wavePath(v){ const xc = 1200 * v, pts = [];
  for (let x = 0; x <= 1200; x++){ let t = Math.min(1, Math.max(0, (x - (xc - 210)) / 420)); t = t * t * (3 - 2 * t);
    const sq = (x % 160) < 80 ? 1 : -1, sn = Math.sin(2 * Math.PI * x / 160); // left of xc: sine, right: square
    pts.push(x + ',' + (55 - 38 * ((1 - t) * sn + t * sq)).toFixed(1)); }
  return 'M' + pts.join(' L'); }
function setMorph(v){ v = Math.min(1, Math.max(0, v)); slider.value = Math.round(v * 100); wp.setAttribute('d', wavePath(1 - v)); }
if (wave && slider){
  wp.setAttribute('d', wavePath(1 - slider.value / 100));
  const live = () => wave.classList.add('live');
  wp.addEventListener('animationend', live); if (reduce) live();
  slider.addEventListener('input', () => { live(); setMorph(slider.value / 100); });
  const move = e => { const r = wave.getBoundingClientRect(); live(); setMorph(1 - (e.clientX - r.left) / r.width); };
  wave.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) move(e); });
  wave.addEventListener('pointerdown', e => { wave.setPointerCapture(e.pointerId); move(e); });
}
const hero = $('.hero'), pr = $('.hero .portrait');
if (hero && pr && fine && !reduce){
  hero.addEventListener('pointermove', e => { const r = pr.getBoundingClientRect(); pr.style.setProperty('--rx', Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 600)).toFixed(2)); pr.style.setProperty('--ry', Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 500)).toFixed(2)); });
  hero.addEventListener('pointerleave', () => { pr.style.setProperty('--rx', 0); pr.style.setProperty('--ry', 0); });
}

/* ---- entries: the one you point at (or read) gets the focus ---- */
$$('.entries').forEach(wrap => {
  const entries = $$('.entry', wrap); const set = el => entries.forEach(x => x.classList.toggle('is-active', x === el));
  if (fine){
    entries.forEach(en => en.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; wrap.classList.add('focus'); set(en); }));
    wrap.addEventListener('pointerleave', () => { wrap.classList.remove('focus'); set(null); });
    entries.forEach(en => en.addEventListener('focusin', () => { wrap.classList.add('focus'); set(en); }));
    wrap.addEventListener('focusout', e => { if (!wrap.contains(e.relatedTarget)) { wrap.classList.remove('focus'); set(null); } });
  }
  const eio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !(fine && wrap.classList.contains('focus'))) set(e.target); }), { rootMargin: '-42% 0px -42% 0px' });
  entries.forEach(en => eio.observe(en));
});

/* ---- project filters ---- */
const chips = $$('.chip[data-filter]'), projs = $$('.entry.proj'), count = $('#projCount');
function filter(key, scroll){
  chips.forEach(c => c.setAttribute('aria-pressed', c.dataset.filter === key));
  let n = 0;
  projs.forEach(p => { const show = key === 'all' || p.dataset.tags.split(' ').includes(key);
    if (show) { n++; p.hidden = false; requestAnimationFrame(() => p.classList.remove('is-hiding')); }
    else { p.classList.add('is-hiding'); setTimeout(() => { if (p.classList.contains('is-hiding')) p.hidden = true; }, reduce ? 0 : 260); } });
  count.textContent = key === 'all' ? 'Showing all ' + projs.length + ' projects' : 'Showing ' + n + ' of ' + projs.length + ' projects';
  if (scroll) $('.filters').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}
chips.forEach(c => c.addEventListener('click', () => filter(c.dataset.filter)));
$$('.tag').forEach(t => t.addEventListener('click', () => filter(t.dataset.filter, true)));

/* ---- tool names on tap ---- */
$$('.lg').forEach(b => b.addEventListener('click', () => { $$('.lg.on').forEach(x => x.classList.remove('on')); b.classList.add('on'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('on'), 2200); }));

/* ---- lightbox (scoped to one gallery, swipe + zoom) ---- */
const dlg = $('#lightbox'), im = $('img', dlg), cap = $('.lb-cap', dlg), stage = $('.lb-stage', dlg);
let set = [], idx = 0;
function show(n){ idx = (n + set.length) % set.length; const src = $('img', set[idx]); im.classList.remove('zoomed'); im.style.transformOrigin = ''; im.src = src.currentSrc || src.src; im.alt = src.alt; cap.textContent = src.alt + ' (' + (idx + 1) + ' / ' + set.length + ')'; }
$$('.gal').forEach(g => $$('button', g).forEach((b, n) => b.addEventListener('click', () => { set = $$('button', g); show(n); dlg.showModal(); })));
$('.close', dlg).addEventListener('click', () => dlg.close());
$('.prev', dlg).addEventListener('click', () => show(idx - 1));
$('.next', dlg).addEventListener('click', () => show(idx + 1));
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(idx - 1); if (e.key === 'ArrowRight') show(idx + 1); });
im.addEventListener('click', e => { const r = im.getBoundingClientRect(); im.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%'; im.classList.toggle('zoomed'); });
let sx = null; stage.addEventListener('pointerdown', e => { sx = e.clientX; });
stage.addEventListener('pointerup', e => { if (sx === null || im.classList.contains('zoomed')) { sx = null; return; } const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); });

/* ---- copy contact details ---- */
$$('.copy').forEach(b => b.addEventListener('click', async () => { try { await navigator.clipboard.writeText(b.dataset.copy); say('Copied: ' + b.dataset.copy); } catch (e) { say('Press and hold to copy manually'); } }));

/* ---- closing: soft spotlight follows the pointer ---- */
const cl = $('.closing');
if (cl && fine && !reduce) cl.addEventListener('pointermove', e => { const r = cl.getBoundingClientRect(); cl.style.setProperty('--mx', (e.clientX - r.left) + 'px'); cl.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
})();
