/* =====================================================
   FAVIAX — History API Router & Legacy Aliases
   ===================================================== */

const LEGACY_HASH_MAP = {
  '#hero': '/',
  '#world': '/universo',
  '#system': '/universo?cat=sistemas',
  '#characters': '/universo?cat=personajes',
  '#archive': '/universo',
  '#transmissions': '/musica',
  '#music': '/musica',
  '#chronicles': '/cronologia',
  '#cronicas': '/cronicas',
  '#connect': '/explorar',
  '#libros': '/libros',
  '#books': '/libros',
  '#merch': '/merch',
};

export function normalizePath(pathname) {
  if (!pathname || pathname === '/index.html') return '/';
  const cleaned = pathname.replace(/\/+$/, '');
  return cleaned || '/';
}

export function resolveRoute(loc = window.location) {
  const path = normalizePath(loc.pathname);
  const params = new URLSearchParams(loc.search);

  if (path === '/' && loc.hash && LEGACY_HASH_MAP[loc.hash]) {
    const mapped = LEGACY_HASH_MAP[loc.hash];
    const url = new URL(mapped, loc.origin);
    return resolveRoute({
      pathname: url.pathname,
      search: url.search,
      hash: '',
      origin: loc.origin,
    });
  }

  if (path === '/') return { screen: 'inicio', navKey: 'inicio', params };
  if (path === '/musica' || path === '/music' || path === '/transmissions') {
    return { screen: 'musica', navKey: 'musica', params };
  }
  if (path === '/universo' || path === '/universe' || path === '/archive') {
    return { screen: 'universo', navKey: 'universo', subKey: 'archivo', params };
  }
  if (path.startsWith('/universo/')) {
    const slug = decodeURIComponent(path.slice('/universo/'.length));
    return { screen: 'universo-detail', navKey: 'universo', subKey: 'archivo', slug, params };
  }
  if (path === '/cronicas' || path === '/chronicles') {
    return { screen: 'cronicas', navKey: 'universo', subKey: 'cronicas', params };
  }
  if (path === '/cronologia' || path === '/timeline') {
    return { screen: 'cronologia', navKey: 'universo', subKey: 'cronologia', params };
  }
  if (path === '/libros' || path === '/books') {
    return { screen: 'libros', navKey: 'libros', params };
  }
  if (path === '/explorar' || path === '/explore' || path === '/connect') {
    return { screen: 'explorar', navKey: 'explorar', params };
  }
  if (path === '/merch') {
    return { screen: 'merch', navKey: 'merch', params };
  }

  return { screen: 'not-found', navKey: null, params };
}

export function navigate(to, { replace = false, scroll = true } = {}) {
  const url = new URL(to, window.location.origin);
  const next = url.pathname + url.search + url.hash;
  const current = window.location.pathname + window.location.search + window.location.hash;

  if (next !== current) {
    if (replace) {
      window.history.replaceState({}, '', next);
    } else {
      window.history.pushState({}, '', next);
    }
  }

  window.dispatchEvent(new CustomEvent('faviax:routechange', { detail: { scroll } }));
}
