import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
async function loadPlaywright() {
  const candidates = [
    process.env.PLAYWRIGHT_MODULE,
    'playwright',
    '@playwright/test',
  ].filter(Boolean);
  for (const mod of candidates) {
    try {
      return await import(mod);
    } catch {
      // Try next candidate
    }
  }
  throw new Error('Playwright not found. Install playwright or set PLAYWRIGHT_MODULE.');
}

const { chromium } = await loadPlaywright();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 4173);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || '';

async function isServerUp() {
  try {
    const res = await fetch(BASE_URL);
    return res.ok;
  } catch {
    return false;
  }
}

async function startServerIfNeeded() {
  if (await isServerUp()) return null;
  const child = spawn(process.execPath, [path.join(ROOT, 'scripts/dev-server.mjs')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });
  for (let i = 0; i < 30; i++) {
    if (await isServerUp()) return child;
    await new Promise((r) => setTimeout(r, 150));
  }
  child.kill();
  throw new Error('Local server did not start in time');
}

const serverProc = await startServerIfNeeded();
const browser = await chromium.launch({ channel: 'chrome' });

const SCREENS = [
  '/',
  '/musica',
  '/universo',
  '/cronicas',
  '/cronologia',
  '/libros',
  '/explorar',
  '/merch',
  '/universo/aeron-vale',
];

try {
  // 1. Check all 8 screens + detail across 360, 768, 1440 px
  for (const width of [360, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`console.error: ${m.text()}`);
    });

    for (const route of SCREENS) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      assert.equal(overflow, false, `Horizontal overflow at ${width}px on ${route}`);

      const imgs = await page.locator('img').all();
      for (const img of imgs) {
        await img.scrollIntoViewIfNeeded();
      }
      await page.waitForLoadState('networkidle');
      const brokenImages = await page.evaluate(async () => {
        const list = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          list.map((img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((res) => {
                  img.addEventListener('load', res, { once: true });
                  img.addEventListener('error', res, { once: true });
                  setTimeout(res, 2000);
                })
          )
        );
        return list
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((img) => img.getAttribute('src'));
      });
      assert.deepEqual(brokenImages, [], `Broken images at ${width}px on ${route}: ${brokenImages.join(', ')}`);
    }

    assert.deepEqual(errors, [], `Errors at ${width}px: ${errors.join(' | ')}`);
    await context.close();
  }

  // 2. User journeys, ES/EN persistence, filters/search, back/forward, direct reload, keyboard, dry-run
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  // Favicon checks on home (/) and internal route (/musica)
  for (const checkRoute of ['/', '/musica']) {
    await page.goto(`${BASE_URL}${checkRoute}`, { waitUntil: 'networkidle' });
    const iconLinks = await page.evaluate(() =>
      Array.from(document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')).map((el) => ({
        rel: el.getAttribute('rel'),
        href: el.getAttribute('href'),
        type: el.getAttribute('type'),
        sizes: el.getAttribute('sizes'),
      }))
    );
    assert.deepEqual(iconLinks, [
      { rel: 'icon', href: '/favicon.ico', type: null, sizes: '16x16 32x32 48x48' },
      { rel: 'icon', href: '/faviax-icon-32.png', type: 'image/png', sizes: '32x32' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', type: null, sizes: '180x180' },
    ]);
  }
  for (const [iconPath, expectedType] of [
    ['/favicon.ico', 'image/x-icon'],
    ['/faviax-icon-32.png', 'image/png'],
    ['/apple-touch-icon.png', 'image/png'],
  ]) {
    const res = await page.request.get(`${BASE_URL}${iconPath}`);
    assert.equal(res.status(), 200, `${iconPath} did not return 200`);
    assert.equal(res.headers()['content-type'], expectedType, `${iconPath} unexpected content-type`);
  }

  // Inicio -> Música -> Artist Profile links
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Escuchar música' }).first().click();
  await page.waitForURL(`${BASE_URL}/musica`);
  await page.getByRole('tab', { name: /Afterglow Archives/i }).click();
  await page.waitForURL(`${BASE_URL}/musica?album=afterglow-archives`);
  const spotifyHref = await page.locator('main a', { hasText: 'Spotify' }).first().getAttribute('href');
  assert.equal(spotifyHref, 'https://open.spotify.com/artist/56CFy7vV7BRSz5WULA9itc');

  // Direct reload on /musica?album=afterglow-archives
  await page.reload({ waitUntil: 'networkidle' });
  assert.match(await page.locator('.album-heading').textContent(), /Afterglow Archives/);
  const musicText = await page.locator('main').textContent();
  assert.doesNotMatch(musicText, /Album-specific links|Enlaces específicos del álbum/i);

  // Inicio -> Universo -> filter + search -> detail -> Cronología
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Explorar Neo-Astra' }).click();
  await page.waitForURL(`${BASE_URL}/universo`);
  await page.getByRole('button', { name: 'Personajes' }).click();
  await page.fill('#archive-search', 'Lyra');
  await page.locator('.archive-card a[href="/universo/lyra-nox"]').click();
  await page.waitForURL(`${BASE_URL}/universo/lyra-nox`);
  assert.equal((await page.locator('h1').textContent()).trim(), 'Lyra Nox');

  // Browser Back & Forward
  await page.goBack();
  await page.waitForURL(/\/universo/);
  await page.goForward();
  await page.waitForURL(`${BASE_URL}/universo/lyra-nox`);

  // Detail -> Cronología
  await page.locator('main').getByRole('link', { name: 'Cronología', exact: true }).click();
  await page.waitForURL(`${BASE_URL}/cronologia`);
  for (const year of ['2085', '2087', '2097']) {
    assert.equal(await page.locator(`#year-${year}`).count(), 1, `Missing milestone ${year}`);
  }

  // Inicio -> Libros (verify Book I Amazon link + Spanish note & Coming Soon on Vols II & III)
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Explorar Libros' }).click();
  await page.waitForURL(`${BASE_URL}/libros`);
  const bookTitles = await page.locator('.book-card h2').allTextContents();
  assert.deepEqual(bookTitles, [
    'I. Neon Constellations',
    'II. Afterglow Archives',
    'III. Becoming Light',
  ]);
  const vol1Card = page.locator('.book-card').nth(0);
  const amazonHref = await vol1Card.locator('a').getAttribute('href');
  assert.equal(amazonHref, 'https://www.amazon.com/Neon-Constellations-Memory-Light-Book-ebook/dp/B0HRQ16Z1V');
  assert.match(await vol1Card.textContent(), /También disponible en español/);
  assert.equal(await page.locator('.book-card').nth(1).locator('a').count(), 0);
  assert.match(await page.locator('.book-card').nth(1).textContent(), /Muy pronto/);
  assert.equal(await page.locator('.book-card').nth(2).locator('a').count(), 0);
  assert.match(await page.locator('.book-card').nth(2).textContent(), /Muy pronto/);

  // Explorar contact check (no pending channels box; mailto directed to favio.cuentas@orvexaio.com)
  await page.goto(`${BASE_URL}/explorar`, { waitUntil: 'networkidle' });
  const exploreText = await page.locator('main').textContent();
  assert.doesNotMatch(exploreText, /Canales y recursos por configurar|Pending channels & links/i);
  assert.equal(await page.locator('a[href="mailto:favio.cuentas@orvexaio.com"]').count() >= 1, true);
  await page.fill('#contact-name', 'Aeron Vale');
  await page.fill('#contact-email', 'aeron@neo-astra.test');
  await page.fill('#contact-subject', 'Consulta FAVIAX');
  await page.fill('#contact-message', 'Mensaje de prueba de contacto.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  const mailtoHref = await page.locator('#contact-mailto-fallback').getAttribute('href');
  assert.match(mailtoHref, /^mailto:favio\.cuentas@orvexaio\.com\?subject=Consulta%20FAVIAX&body=/);

  // Merch status check (no prices/stock/checkout buttons)
  await page.goto(`${BASE_URL}/merch`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('button:has-text("Comprar"), button:has-text("Añadir")').count(), 0);

  // Bilingual ES/EN persistence
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.locator('[data-lang-btn="en"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.getByRole('link', { name: 'Listen to Music' }).first().isVisible(), true);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  await page.locator('[data-lang-btn="es"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'), 'es');

  // Legacy hash alias
  await page.goto(`${BASE_URL}/#world`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').textContent(), 'The Signal Archive');

  // Keyboard focus check
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  const activeId = await page.evaluate(() => document.activeElement?.id);
  assert.equal(activeId, 'skip-link');

  // Mobile menu check at 360px
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  const menuBtn = page.locator('#menu-toggle');
  await menuBtn.click();
  assert.equal(await menuBtn.getAttribute('aria-expanded'), 'true');
  await page.locator('#primary-nav').getByRole('link', { name: 'Universo' }).click();
  await page.waitForURL(`${BASE_URL}/universo`);
  assert.equal(await menuBtn.getAttribute('aria-expanded'), 'false');

  // Optional comparable screenshots
  if (SCREENSHOT_DIR) {
    await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
    await page.setViewportSize({ width: 1440, height: 900 });
    for (const [name, route] of [
      ['inicio-1440', '/'],
      ['musica-1440', '/musica'],
      ['universo-1440', '/universo'],
      ['libros-1440', '/libros'],
      ['explorar-1440', '/explorar'],
    ]) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${name}.png`), fullPage: false });
    }
  }

  assert.deepEqual(errors, [], `Console/page errors during journeys: ${errors.join(' | ')}`);
  await context.close();
  console.log('ALL E2E CHECKS PASSED.');
} finally {
  await browser.close();
  if (serverProc) serverProc.kill();
}
