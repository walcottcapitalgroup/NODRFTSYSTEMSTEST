/**
 * i18n.js - Bilingual EN/ES content switcher
 *
 * Reads data-en / data-es attributes and updates visible text plus selected
 * accessibility attributes. Persists language preference in localStorage
 * under "ndrf-lang" and updates <html lang="">.
 */

const STORAGE_KEY = 'ndrf-lang';
const DEFAULT_LANG = 'en';

function getUrlLang() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash.startsWith('es/')) return 'es';
  return 'en';
}

function getLang() {
  return getUrlLang() || localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
}

function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

function applyTranslatedAttributes(root, lang) {
  root.querySelectorAll('[data-aria-label-en]').forEach(el => {
    const value = el.getAttribute(`data-aria-label-${lang}`) || el.getAttribute('data-aria-label-en');
    if (value !== null) el.setAttribute('aria-label', value);
  });
}

function updateNavLinks(lang) {
  document.querySelectorAll('a[href^="#/"]').forEach(link => {
    let href = link.getAttribute('href');
    // Remove any existing es/ prefix
    href = href.replace(/^#\/es\//, '#/');
    if (lang === 'es') {
      href = href.replace(/^#\//, '#/es/');
    }
    link.setAttribute('href', href);
  });
}

function apply(root = document) {
  const lang = getLang();

  // Main text content
  root.querySelectorAll('[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
    if (text !== null) el.textContent = text;
  });

  // Placeholder attributes
  root.querySelectorAll('[data-placeholder-en]').forEach(el => {
    const placeholder = el.getAttribute(`data-placeholder-${lang}`) || el.getAttribute('data-placeholder-en');
    if (placeholder !== null) el.placeholder = placeholder;
  });

  // Select options
  root.querySelectorAll('option[data-en]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`) || el.getAttribute('data-en');
    if (text !== null) el.textContent = text;
  });

  // ARIA labels
  applyTranslatedAttributes(root, lang);

  // Update nav links to stay in current language
  updateNavLinks(lang);
  
  // Notify UI components
  window.ndrfUI?.syncLanguage?.(lang);
}

function toggle() {
  const current = getLang();
  const next = current === 'en' ? 'es' : 'en';
  const hash = window.location.hash.replace(/^#\/?/, '');
  const cleanHash = hash.replace(/^es\//, '');
  const newHash = next === 'es' ? `#/es/${cleanHash}` : `#/${cleanHash}`;
  window.location.hash = newHash;
}

function updateToggleButton(lang) {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  if (lang === 'en') {
    btn.textContent = 'ES';
    btn.setAttribute('aria-label', 'ES - Switch to Spanish');
  } else {
    btn.textContent = 'EN';
    btn.setAttribute('aria-label', 'EN - Cambiar a inglés');
  }
}

function init() {
  const lang = getLang();
  setLang(lang);
  apply();
  updateToggleButton(lang);

  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.addEventListener('click', toggle);
  }
}

window.i18n = { apply, toggle, getLang };

export { init, apply, toggle, getLang };
