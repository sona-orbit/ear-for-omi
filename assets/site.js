// Language: the root (English) follows the browser language once; a saved choice wins.
// A direct language URL stays where it is. The menu switches and remembers.
(() => {
  const supported = ['en', 'zh-Hant'];
  const current = window.SITE_LOCALE;
  // Folder-style URLs (no .html): page is '', 'privacy/' or 'support/'; root climbs back to the site root
  const page = window.SITE_PAGE || '';
  const root = window.SITE_ROOT || '';
  const urlFor = (lang) => (root + (lang === 'en' ? '' : lang + '/') + page) || './';
  let saved, stay;
  try { saved = localStorage.getItem('ear-for-omi-language'); stay = sessionStorage.getItem('ear-for-omi-stay'); } catch (_) {}

  if (current === 'en' && !stay) {
    const browser = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    const guess = /^zh-(tw|hk|mo|hant)/.test(browser) ? 'zh-Hant' : 'en';
    const preferred = supported.includes(saved) ? saved : guess;
    if (preferred !== 'en') { location.replace(urlFor(preferred) + location.hash); return; }
  }

  const selector = document.getElementById('language');
  if (selector) selector.addEventListener('change', () => {
    const next = selector.value;
    if (!supported.includes(next)) return;
    try { localStorage.setItem('ear-for-omi-language', next); } catch (_) {}
    // Picking English on purpose: don't bounce back to the browser language.
    if (next === 'en') { try { sessionStorage.setItem('ear-for-omi-stay', '1'); } catch (_) {} }
    if (next !== current) location.href = urlFor(next);
  });
})();

// Architecture diagram: click a block to keep only its own connections; click it again or "show all" to go back.
(() => {
  const svg = document.querySelector('svg.arch-svg');
  if (!svg) return;
  const all = document.querySelector('.show-all');
  const nodes = [...svg.querySelectorAll('.node')], edges = [...svg.querySelectorAll('.edge')];
  let current = null;
  const show = (id) => {
    current = id;
    svg.classList.toggle('focus', !!id);
    if (all) all.hidden = !id;
    const keep = new Set(id ? [id] : []);
    edges.forEach(e => { const ends = e.dataset.ends.split(' '); const on = !!id && ends.includes(id); e.classList.toggle('on', on); if (on) ends.forEach(x => keep.add(x)); });
    nodes.forEach(n => n.classList.toggle('on', keep.has(n.dataset.id)));
  };
  nodes.forEach(n => {
    const pick = () => show(current === n.dataset.id ? null : n.dataset.id);
    n.addEventListener('click', pick);
    n.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } });
  });
  if (all) all.addEventListener('click', () => show(null));
})();
