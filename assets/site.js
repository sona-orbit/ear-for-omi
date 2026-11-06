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
