/* =====================================================
   FAVIAX — Application Bootstrap & Interactive Wiring
   ===================================================== */

import { I18N, UNIVERSE_ENTRIES } from './src/data.js';
import { resolveRoute, navigate } from './src/router.js';
import {
  renderInicio,
  renderMusica,
  renderUniverso,
  renderUniversoResults,
  filterUniverseEntries,
  renderUniversoDetail,
  renderCronicas,
  renderCronologia,
  renderLibros,
  renderExplorar,
  renderMerch,
  renderNotFound,
} from './src/views.js';

const LANG_STORAGE_KEY = 'faviax_lang';

function getStoredLang() {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'es';
  } catch {
    return 'es';
  }
}

let currentLang = getStoredLang();

function setLang(nextLang) {
  currentLang = nextLang === 'en' ? 'en' : 'es';
  try {
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  } catch {
    // Ignore storage restriction
  }
  renderApp({ scroll: false });
}

function getPageTitle(route, lang) {
  const nav = I18N[lang].nav;
  switch (route.screen) {
    case 'inicio':
      return 'FAVIAX — Neon Constellations | Neo-Astra 2097';
    case 'musica':
      return `${nav.musica} — FAVIAX`;
    case 'universo':
      return `${nav.universo} — The Signal Archive | FAVIAX`;
    case 'universo-detail': {
      const entry = UNIVERSE_ENTRIES.find((e) => e.slug === route.slug);
      return entry ? `${entry.name} — FAVIAX` : `FAVIAX`;
    }
    case 'cronicas':
      return `${nav.cronicas} — FAVIAX`;
    case 'cronologia':
      return `${nav.cronologia} — FAVIAX`;
    case 'libros':
      return `${nav.libros} — FAVIAX`;
    case 'explorar':
      return `${nav.explorar} — FAVIAX`;
    case 'merch':
      return `${nav.merch} — FAVIAX`;
    default:
      return `404 — FAVIAX`;
  }
}

function syncChrome(route, lang) {
  const t = I18N[lang];
  document.documentElement.lang = lang;
  document.title = getPageTitle(route, lang);

  const skipLink = document.getElementById('skip-link');
  if (skipLink) skipLink.textContent = t.skipToContent;

  const tagline = document.getElementById('brand-tagline');
  if (tagline) tagline.textContent = t.brandTagline;

  const statusText = document.getElementById('header-status-text');
  if (statusText) statusText.textContent = t.telemetryStatus;

  const footerCopy = document.getElementById('footer-copy');
  if (footerCopy) footerCopy.textContent = t.footer.copy;

  const footerLinksLabel = document.getElementById('footer-links-label');
  if (footerLinksLabel) footerLinksLabel.textContent = t.footer.linksLabel;

  document.querySelectorAll('[data-nav-key]').forEach((link) => {
    const key = link.getAttribute('data-nav-key');
    if (key && t.nav[key]) {
      link.textContent = t.nav[key];
    }
    const isActive = route.navKey === key;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    const btnLang = btn.getAttribute('data-lang-btn');
    const active = btnLang === lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const menuToggle = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('primary-nav');
  if (menuToggle && navDrawer) {
    const isOpen = navDrawer.classList.contains('is-open');
    menuToggle.setAttribute('aria-label', isOpen ? t.menuClose : t.menuOpen);
  }
}

function closeMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('primary-nav');
  if (!menuToggle || !navDrawer) return;
  navDrawer.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', I18N[currentLang].menuOpen);
}

function bindScreenInteractions(route) {
  if (route.screen === 'musica') {
    document.querySelectorAll('[data-album-select]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const album = btn.getAttribute('data-album-select');
        navigate(`/musica?album=${encodeURIComponent(album)}`, { scroll: false });
      });
    });
  }

  if (route.screen === 'universo') {
    const updateArchiveUrl = (cat, q, replace = true) => {
      const nextParams = new URLSearchParams();
      if (cat && cat !== 'all') nextParams.set('cat', cat);
      if (q && q.trim()) nextParams.set('q', q.trim());
      const qs = nextParams.toString();
      const target = qs ? `/universo?${qs}` : '/universo';
      if (replace) {
        window.history.replaceState({}, '', target);
      } else {
        navigate(target, { scroll: false });
      }
    };

    const applyFilterInPlace = (cat, q) => {
      const filtered = filterUniverseEntries(currentLang, cat, q);
      const resultsEl = document.getElementById('archive-results');
      const countEl = document.getElementById('archive-count');
      if (resultsEl) {
        resultsEl.innerHTML = renderUniversoResults(currentLang, filtered);
        const resetBtn = document.getElementById('archive-reset-btn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => navigate('/universo', { scroll: false }));
        }
      }
      if (countEl) {
        countEl.textContent = I18N[currentLang].universePage.resultsCount(filtered.length);
      }
      document.querySelectorAll('[data-archive-cat]').forEach((pill) => {
        const pillCat = pill.getAttribute('data-archive-cat');
        const active = pillCat === cat;
        pill.classList.toggle('is-active', active);
        pill.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    };

    document.querySelectorAll('[data-archive-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-archive-cat') || 'all';
        const searchInput = document.getElementById('archive-search');
        const q = searchInput ? searchInput.value : '';
        updateArchiveUrl(cat, q, false);
      });
    });

    const searchInput = document.getElementById('archive-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        const activeBtn = document.querySelector('[data-archive-cat].is-active');
        const cat = activeBtn ? activeBtn.getAttribute('data-archive-cat') : 'all';
        const q = searchInput.value;
        updateArchiveUrl(cat, q, true);
        applyFilterInPlace(cat, q);
      });
    }

    const resetBtn = document.getElementById('archive-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => navigate('/universo', { scroll: false }));
    }
  }

  if (route.screen === 'explorar') {
    const form = document.getElementById('dry-run-contact-form');
    const feedback = document.getElementById('dry-run-feedback');
    const emailInput = document.getElementById('dry-email');
    if (form && feedback && emailInput) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        feedback.hidden = false;
        if (!isValid) {
          feedback.className = 'dry-run-feedback is-error';
          feedback.textContent = I18N[currentLang].explorePage.dryRunError;
          emailInput.focus();
          return;
        }
        feedback.className = 'dry-run-feedback is-success';
        feedback.textContent = I18N[currentLang].explorePage.dryRunSuccess(email);
      });
    }
  }
}

function renderApp({ scroll = true } = {}) {
  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  const route = resolveRoute(window.location);
  syncChrome(route, currentLang);

  let html = '';
  switch (route.screen) {
    case 'inicio':
      html = renderInicio(currentLang);
      break;
    case 'musica':
      html = renderMusica(currentLang, route.params);
      break;
    case 'universo':
      html = renderUniverso(currentLang, route.params);
      break;
    case 'universo-detail':
      html = renderUniversoDetail(currentLang, route.slug);
      break;
    case 'cronicas':
      html = renderCronicas(currentLang);
      break;
    case 'cronologia':
      html = renderCronologia(currentLang);
      break;
    case 'libros':
      html = renderLibros(currentLang);
      break;
    case 'explorar':
      html = renderExplorar(currentLang);
      break;
    case 'merch':
      html = renderMerch(currentLang);
      break;
    default:
      html = renderNotFound(currentLang);
      break;
  }

  appRoot.innerHTML = html;
  bindScreenInteractions(route);

  if (scroll) {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

function setupGlobalEvents() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-link]');
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:')) return;

    e.preventDefault();
    closeMobileMenu();
    navigate(href);
  });

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-lang-btn');
      setLang(next);
    });
  });

  const menuToggle = document.getElementById('menu-toggle');
  const navDrawer = document.getElementById('primary-nav');
  if (menuToggle && navDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? I18N[currentLang].menuClose : I18N[currentLang].menuOpen
      );
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
        closeMobileMenu();
        menuToggle.focus();
      }
    });
  }

  window.addEventListener('popstate', () => {
    closeMobileMenu();
    renderApp({ scroll: true });
  });

  window.addEventListener('faviax:routechange', (e) => {
    closeMobileMenu();
    renderApp({ scroll: e.detail?.scroll !== false });
  });
}

setupGlobalEvents();
renderApp({ scroll: false });
