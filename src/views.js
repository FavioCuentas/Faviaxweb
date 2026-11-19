/* =====================================================
   FAVIAX — View Renderers for All 8 Screens
   ===================================================== */

import {
  OFFICIAL_ARTIST_PROFILES,
  PENDING_CONFIG,
  DISCOGRAPHY,
  TRILOGY,
  UNIVERSE_ENTRIES,
  CHRONICLES_COLLAGE,
  TIMELINE_MILESTONES,
  MERCH_CONFIG,
  I18N,
} from './data.js';

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function profileIcon(id) {
  switch (id) {
    case 'spotify':
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 15c2.5-.8 5.2-.6 7.5.6M7.2 12c3.2-1 6.7-.7 9.6.8M6.5 9c4-1.2 8.4-.9 11.8 1"/></svg>`;
    case 'apple-music':
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`;
    case 'youtube-music':
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none"/></svg>`;
    default:
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="6" width="20" height="12" rx="3"/><polygon points="10 9 16 12 10 15" fill="currentColor" stroke="none"/></svg>`;
  }
}

function renderUniverseSubnav(lang, activeSubKey) {
  const t = I18N[lang].universeNav;
  const items = [
    { key: 'archivo', to: '/universo', label: t.archive },
    { key: 'cronicas', to: '/cronicas', label: t.chronicles },
    { key: 'cronologia', to: '/cronologia', label: t.timeline },
  ];
  return `
    <nav class="subnav" aria-label="${escapeHtml(I18N[lang].nav.universo)}">
      <div class="container subnav-inner">
        ${items
          .map(
            (item) => `
          <a href="${item.to}" data-link class="subnav-link ${activeSubKey === item.key ? 'is-active' : ''}" ${
              activeSubKey === item.key ? 'aria-current="page"' : ''
            }>
            <span class="subnav-dot" aria-hidden="true"></span>
            ${escapeHtml(item.label)}
          </a>`
          )
          .join('')}
      </div>
    </nav>
  `;
}

function renderArtistProfileChips(lang, compact = false) {
  const t = I18N[lang];
  return `
    <div class="platform-strip ${compact ? 'is-compact' : ''}" role="group" aria-label="${escapeHtml(t.artistProfilesLabel)}">
      <span class="platform-strip-label">${escapeHtml(t.artistProfilesLabel)}:</span>
      <div class="platform-chip-list">
        ${OFFICIAL_ARTIST_PROFILES.map(
          (p) => `
          <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="platform-chip" aria-label="${escapeHtml(t.musicPage.listenOn)} ${escapeHtml(p.name)} (${escapeHtml(t.artistProfilesLabel)})">
            ${profileIcon(p.id)}
            <span>${escapeHtml(p.name)}</span>
            <span aria-hidden="true" class="ext-arrow">↗</span>
          </a>`
        ).join('')}
      </div>
    </div>
  `;
}

export function renderInicio(lang) {
  const t = I18N[lang];
  const spotlightAlbums = DISCOGRAPHY;
  const previewEntries = UNIVERSE_ENTRIES.filter((e) =>
    ['neo-astra', 'aeron-vale', 'lyra-nox', 'kade-ryder', 'aura'].includes(e.slug)
  );

  return `
    <section class="hero" aria-label="NEON CONSTELLATIONS">
      <div class="hero-backdrop" aria-hidden="true">
        <img src="/assets/skyline-rain.jpg" alt="" class="hero-img hero-img-skyline" />
        <img src="/assets/hero-bg.png" alt="" class="hero-img hero-img-grid" />
        <div class="hero-rain-layer"></div>
        <div class="hero-scrim"></div>
      </div>

      <div class="container hero-shell">
        <div class="hero-telemetry">
          <span class="telemetry-pill">
            <span class="pulse-dot" aria-hidden="true"></span>
            ${escapeHtml(t.hero.badge)}
          </span>
          <span class="telemetry-meta">${escapeHtml(t.telemetryStatus)}</span>
        </div>

        <div class="hero-main">
          <p class="eyebrow">${escapeHtml(t.hero.eyebrow)}</p>
          <h1 class="hero-display">
            <span class="hero-word-white">NEON</span>
            <span class="hero-word-violet">CONSTELLATIONS</span>
          </h1>
          <p class="hero-phrase">
            <strong>«${escapeHtml(lang === 'es' ? t.hero.phraseEs : t.hero.phraseEn)}»</strong>
            <span class="hero-phrase-alt">${escapeHtml(lang === 'es' ? t.hero.phraseEn : t.hero.phraseEs)}</span>
          </p>
          <p class="hero-lead">${escapeHtml(t.hero.lead)}</p>

          <div class="hero-actions">
            <a href="/musica" data-link class="btn btn-primary">${escapeHtml(t.hero.ctaMusic)}</a>
            <a href="/universo" data-link class="btn btn-cyan">${escapeHtml(t.hero.ctaUniverse)}</a>
            <a href="/libros" data-link class="btn btn-ghost">${escapeHtml(t.hero.ctaNovel)}</a>
          </div>

          ${renderArtistProfileChips(lang, true)}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="home-music-heading">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">${escapeHtml(t.home.musicEyebrow)}</p>
            <h2 id="home-music-heading" class="section-title">${escapeHtml(t.home.musicTitle)}</h2>
            <p class="section-lead">${escapeHtml(t.home.musicLead)}</p>
          </div>
          <a href="/musica" data-link class="btn btn-ghost">${escapeHtml(t.home.musicLink)} →</a>
        </div>

        <div class="grid-2">
          ${spotlightAlbums
            .map(
              (album) => `
            <article class="panel album-preview-card">
              <a href="/musica?album=${escapeHtml(album.slug)}" data-link class="album-preview-media">
                <img src="${escapeHtml(album.cover)}" alt="${escapeHtml(album.title)}" loading="lazy" />
              </a>
              <div class="album-preview-body">
                <div class="meta-row">
                  <span class="badge badge-violet">${escapeHtml(album.type[lang])}</span>
                  <span class="mono-code">${escapeHtml(album.catalogCode)}</span>
                </div>
                <h3>${escapeHtml(album.title)}</h3>
                <p>${escapeHtml(album.summary[lang])}</p>
                <div class="tag-row">
                  ${album.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}
                </div>
                <div class="card-actions">
                  <a href="/musica?album=${escapeHtml(album.slug)}" data-link class="btn btn-sm btn-primary">${escapeHtml(t.hero.ctaMusic)}</a>
                </div>
              </div>
            </article>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="home-universe-heading">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">${escapeHtml(t.home.universeEyebrow)}</p>
            <h2 id="home-universe-heading" class="section-title">${escapeHtml(t.home.universeTitle)}</h2>
            <p class="section-lead">${escapeHtml(t.home.universeLead)}</p>
          </div>
          <a href="/universo" data-link class="btn btn-cyan">${escapeHtml(t.home.universeLink)} →</a>
        </div>

        <div class="archive-preview-grid">
          ${previewEntries
            .map(
              (entry) => `
            <article class="panel archive-card accent-${escapeHtml(entry.accent)}">
              <div class="archive-card-media">
                <img src="${escapeHtml(entry.image)}" alt="${escapeHtml(entry.name)}" loading="lazy" />
                <span class="mono-badge">${escapeHtml(entry.code)}</span>
              </div>
              <div class="archive-card-body">
                <span class="badge badge-cyan">${escapeHtml(entry.badge[lang])}</span>
                <h3>${escapeHtml(entry.name)}</h3>
                <p>${escapeHtml(entry.summary[lang])}</p>
                <a href="/universo/${escapeHtml(entry.slug)}" data-link class="card-link">${escapeHtml(t.universePage.openDossier)} →</a>
              </div>
            </article>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="home-books-heading">
      <div class="container">
        <article class="panel trilogy-banner">
          <div class="trilogy-banner-cover">
            <img src="${escapeHtml(TRILOGY[0].cover)}" alt="I. Neon Constellations" loading="lazy" />
          </div>
          <div class="trilogy-banner-copy">
            <p class="eyebrow">${escapeHtml(t.home.booksEyebrow)}</p>
            <h2 id="home-books-heading" class="section-title">${escapeHtml(t.home.booksTitle)}</h2>
            <p class="section-lead">${escapeHtml(t.home.booksLead)}</p>
            <p class="body-muted">${escapeHtml(TRILOGY[0].logline[lang])}</p>
            ${
              TRILOGY[0].availabilityNote
                ? `<div class="tag-row"><span class="badge badge-cyan">${escapeHtml(TRILOGY[0].availabilityNote[lang])}</span></div>`
                : ''
            }
            <div class="trilogy-pills">
              ${TRILOGY.map((book) => `<span class="tag-chip">${escapeHtml(book.title)}</span>`).join('')}
            </div>
            <div class="card-actions">
              ${
                TRILOGY[0].links.amazonKdp
                  ? `<a href="${escapeHtml(TRILOGY[0].links.amazonKdp)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">${escapeHtml(t.booksPage.buyLabel)} ↗</a>`
                  : ''
              }
              <a href="/libros" data-link class="btn btn-cyan">${escapeHtml(t.home.booksLink)}</a>
              <a href="/cronicas" data-link class="btn btn-ghost">${escapeHtml(t.nav.cronicas)}</a>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="section section-alt" aria-labelledby="home-sectors-heading">
      <div class="container">
        <div class="section-head">
          <div>
            <p class="eyebrow">${escapeHtml(t.home.sectorsEyebrow)}</p>
            <h2 id="home-sectors-heading" class="section-title">${escapeHtml(t.home.sectorsTitle)}</h2>
          </div>
        </div>
        <div class="grid-4">
          ${t.home.sectors
            .map(
              (sec) => `
            <a href="${escapeHtml(sec.to)}" data-link class="panel sector-card">
              <h3>${escapeHtml(sec.title)}</h3>
              <p>${escapeHtml(sec.desc)}</p>
              <span class="card-link" aria-hidden="true">→</span>
            </a>`
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

export function renderMusica(lang, params) {
  const t = I18N[lang];
  const requestedAlbum = params.get('album');
  const activeAlbum = DISCOGRAPHY.find((a) => a.slug === requestedAlbum) || DISCOGRAPHY[0];

  const albumLinkEntries = [
    { key: 'spotify', label: 'Spotify' },
    { key: 'appleMusic', label: 'Apple Music' },
    { key: 'youtubeMusic', label: 'YouTube Music' },
    { key: 'amazonMusic', label: 'Amazon Music' },
  ].filter((item) => Boolean(activeAlbum.albumLinks[item.key]));

  const hasVerifiedTracks = Array.isArray(activeAlbum.tracks) && activeAlbum.tracks.length > 0;
  const hasAuthorizedAudio = Boolean(activeAlbum.audioSrc);
  const hasVisualizer = Boolean(activeAlbum.visualizerUrl);

  return `
    <section class="page-hero container">
      <p class="eyebrow">${escapeHtml(t.musicPage.eyebrow)}</p>
      <h1 class="page-title">${escapeHtml(t.musicPage.title)}</h1>
      <p class="section-lead">${escapeHtml(t.musicPage.lead)}</p>

      <div class="album-tabs" role="tablist" aria-label="${escapeHtml(t.musicPage.albumSelectorLabel)}">
        ${DISCOGRAPHY.map(
          (album) => `
          <button
            type="button"
            role="tab"
            aria-selected="${album.slug === activeAlbum.slug ? 'true' : 'false'}"
            data-album-select="${escapeHtml(album.slug)}"
            class="tab-btn ${album.slug === activeAlbum.slug ? 'is-active' : ''}"
          >
            <span class="mono-code">${escapeHtml(album.catalogCode)}</span>
            <span>${escapeHtml(album.title)}</span>
          </button>`
        ).join('')}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <article class="panel music-spotlight">
          <div class="music-cover-wrap">
            <img src="${escapeHtml(activeAlbum.cover)}" alt="${escapeHtml(activeAlbum.title)}" class="music-cover-img" />
            <span class="cover-caption">${escapeHtml(t.musicPage.coverNoteOfficial)}</span>
          </div>

          <div class="music-details">
            <div class="meta-row">
              <span class="badge badge-violet">${escapeHtml(t.musicPage.typeLabel)}: ${escapeHtml(activeAlbum.type[lang])}</span>
              <span class="mono-code">${escapeHtml(activeAlbum.catalogCode)}</span>
            </div>
            <h2 class="album-heading">${escapeHtml(activeAlbum.title)}</h2>
            <p class="body-copy">${escapeHtml(activeAlbum.summary[lang])}</p>

            <div class="tag-row">
              ${activeAlbum.tags.map((tag) => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join('')}
            </div>

            <div class="music-links-block">
              <h3>${escapeHtml(t.musicPage.officialArtistHeading)}</h3>
              <p class="body-muted">${escapeHtml(t.musicPage.officialArtistHint)}</p>
              <div class="button-cluster">
                ${OFFICIAL_ARTIST_PROFILES.map(
                  (profile) => `
                  <a href="${escapeHtml(profile.url)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary-outline">
                    ${profileIcon(profile.id)}
                    <span>${escapeHtml(profile.name)}</span>
                    <span aria-hidden="true">↗</span>
                  </a>`
                ).join('')}
              </div>
            </div>

            ${
              albumLinkEntries.length > 0
                ? `<div class="music-links-block">
                    <div class="button-cluster">
                      ${albumLinkEntries
                        .map(
                          (item) => `
                        <a href="${escapeHtml(activeAlbum.albumLinks[item.key])}" target="_blank" rel="noopener noreferrer" class="btn btn-cyan">
                          ${escapeHtml(item.label)} ↗
                        </a>`
                        )
                        .join('')}
                    </div>
                  </div>`
                : ''
            }
          </div>
        </article>

        <div class="grid-2 music-lower-grid">
          <article class="panel">
            <div class="panel-head">
              <h3>${escapeHtml(t.musicPage.tracksHeading)}</h3>
              <span class="mono-code">${hasAuthorizedAudio ? 'AUDIO: READY' : 'AUDIO: PENDING'}</span>
            </div>
            ${
              hasAuthorizedAudio
                ? `<div class="audio-box">
                    <audio controls preload="none" src="${escapeHtml(activeAlbum.audioSrc)}"></audio>
                  </div>`
                : ''
            }
            ${
              hasVerifiedTracks
                ? `<ol class="track-list">
                    ${activeAlbum.tracks
                      .map(
                        (track, idx) => `
                      <li class="track-item">
                        <span class="mono-code">${String(idx + 1).padStart(2, '0')}</span>
                        <span class="track-title">${escapeHtml(track.title)}</span>
                        <span class="mono-code">${escapeHtml(track.duration || '')}</span>
                      </li>`
                      )
                      .join('')}
                  </ol>`
                : `<p class="status-note">${escapeHtml(t.musicPage.tracksPending)}</p>`
            }
          </article>

          <article class="panel">
            <div class="panel-head">
              <h3>Visualizers</h3>
              <span class="mono-code">${hasVisualizer ? 'YOUTUBE // READY' : 'VISUALIZER: PENDING'}</span>
            </div>
            ${
              hasVisualizer
                ? `<a href="${escapeHtml(activeAlbum.visualizerUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-cyan">${escapeHtml(t.musicPage.openVisualizer)} ↗</a>`
                : `<p class="status-note">${escapeHtml(t.musicPage.visualizerPending)}</p>`
            }
          </article>
        </div>
      </div>
    </section>
  `;
}

export function filterUniverseEntries(lang, activeCat, query) {
  const qLower = (query || '').trim().toLowerCase();
  return UNIVERSE_ENTRIES.filter((entry) => {
    const matchesCat = activeCat === 'all' || entry.category === activeCat;
    if (!matchesCat) return false;
    if (!qLower) return true;
    const haystack = [
      entry.name,
      entry.code,
      entry.badge[lang],
      entry.summary[lang],
      entry.dossier[lang],
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(qLower);
  });
}

export function renderUniversoResults(lang, filtered) {
  const t = I18N[lang];
  if (filtered.length === 0) {
    return `
      <div class="panel empty-panel">
        <p>${escapeHtml(t.universePage.emptyState)}</p>
        <button type="button" id="archive-reset-btn" class="btn btn-cyan">${escapeHtml(t.universePage.clearFilters)}</button>
      </div>
    `;
  }
  return `
    <div class="grid-3">
      ${filtered
        .map(
          (entry) => `
        <article class="panel archive-card accent-${escapeHtml(entry.accent)}">
          <div class="archive-card-media">
            <img src="${escapeHtml(entry.image)}" alt="${escapeHtml(entry.name)}" loading="lazy" />
            <span class="mono-badge">${escapeHtml(entry.code)}</span>
            ${
              entry.imageStatus === 'provisional'
                ? `<span class="provisional-pill">${escapeHtml(t.universePage.provisionalTag)}</span>`
                : ''
            }
          </div>
          <div class="archive-card-body">
            <span class="badge badge-cyan">${escapeHtml(entry.badge[lang])}</span>
            <h2>${escapeHtml(entry.name)}</h2>
            <p>${escapeHtml(entry.summary[lang])}</p>
            <div class="archive-card-foot">
              <span class="mono-code">${escapeHtml(entry.meta[lang])}</span>
              <a href="/universo/${escapeHtml(entry.slug)}" data-link class="card-link">${escapeHtml(t.universePage.openDossier)} →</a>
            </div>
          </div>
        </article>`
        )
        .join('')}
    </div>
  `;
}

export function renderUniverso(lang, params) {
  const t = I18N[lang];
  const activeCat = params.get('cat') || 'all';
  const query = (params.get('q') || '').trim();
  const filtered = filterUniverseEntries(lang, activeCat, query);

  const categories = ['all', 'personajes', 'lugares', 'sistemas', 'casas'];

  return `
    ${renderUniverseSubnav(lang, 'archivo')}

    <section class="page-hero container">
      <p class="eyebrow">${escapeHtml(t.universePage.eyebrow)}</p>
      <h1 class="page-title">${escapeHtml(t.universePage.title)}</h1>
      <p class="section-lead">${escapeHtml(t.universePage.lead)}</p>

      <div class="archive-controls">
        <div class="filter-pills" role="group" aria-label="${escapeHtml(t.universePage.categories.all)}">
          ${categories
            .map(
              (cat) => `
            <button
              type="button"
              data-archive-cat="${escapeHtml(cat)}"
              aria-pressed="${activeCat === cat ? 'true' : 'false'}"
              class="filter-pill ${activeCat === cat ? 'is-active' : ''}"
            >
              ${escapeHtml(t.universePage.categories[cat])}
            </button>`
            )
            .join('')}
        </div>

        <div class="search-wrap">
          <label for="archive-search" class="sr-only">${escapeHtml(t.universePage.searchLabel)}</label>
          <input
            id="archive-search"
            type="search"
            class="search-input"
            value="${escapeHtml(query)}"
            placeholder="${escapeHtml(t.universePage.searchPlaceholder)}"
            autocomplete="off"
          />
          <span class="mono-code results-count" id="archive-count">${escapeHtml(t.universePage.resultsCount(filtered.length))}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container" id="archive-results">
        ${renderUniversoResults(lang, filtered)}
      </div>
    </section>
  `;
}

export function renderUniversoDetail(lang, slug) {
  const t = I18N[lang];
  const entry = UNIVERSE_ENTRIES.find((e) => e.slug === slug);
  if (!entry) return renderNotFound(lang);

  const relatedEntries = (entry.related || [])
    .map((relSlug) => UNIVERSE_ENTRIES.find((e) => e.slug === relSlug))
    .filter(Boolean);

  return `
    ${renderUniverseSubnav(lang, 'archivo')}

    <section class="section">
      <div class="container">
        <div class="detail-topbar">
          <a href="/universo" data-link class="btn btn-ghost">← ${escapeHtml(t.universePage.backToArchive)}</a>
          <span class="mono-code">${escapeHtml(t.universePage.shareHint)}: /universo/${escapeHtml(entry.slug)}</span>
        </div>

        <article class="panel detail-panel accent-${escapeHtml(entry.accent)}">
          <div class="detail-media">
            <img src="${escapeHtml(entry.image)}" alt="${escapeHtml(entry.name)}" />
            ${
              entry.imageStatus === 'provisional'
                ? `<span class="provisional-pill">${escapeHtml(t.universePage.provisionalTag)}</span>`
                : ''
            }
          </div>
          <div class="detail-copy">
            <div class="meta-row">
              <span class="badge badge-violet">${escapeHtml(entry.badge[lang])}</span>
              <span class="mono-code">${escapeHtml(entry.code)}</span>
            </div>
            <h1 class="page-title">${escapeHtml(entry.name)}</h1>
            <p class="section-lead">${escapeHtml(entry.summary[lang])}</p>
            <p class="body-copy">${escapeHtml(entry.dossier[lang])}</p>
            <p class="mono-code">${escapeHtml(entry.meta[lang])}</p>

            <div class="card-actions">
              <a href="/cronologia" data-link class="btn btn-cyan">${escapeHtml(t.nav.cronologia)}</a>
              <a href="/musica" data-link class="btn btn-ghost">${escapeHtml(t.nav.musica)}</a>
            </div>
          </div>
        </article>

        ${
          relatedEntries.length > 0
            ? `<div class="related-block">
                <h2 class="section-subtitle">${escapeHtml(t.universePage.relatedHeading)}</h2>
                <div class="grid-3">
                  ${relatedEntries
                    .map(
                      (rel) => `
                    <a href="/universo/${escapeHtml(rel.slug)}" data-link class="panel related-card">
                      <span class="mono-code">${escapeHtml(rel.code)}</span>
                      <h3>${escapeHtml(rel.name)}</h3>
                      <p>${escapeHtml(rel.summary[lang])}</p>
                      <span class="card-link">${escapeHtml(t.universePage.openDossier)} →</span>
                    </a>`
                    )
                    .join('')}
                </div>
              </div>`
            : ''
        }
      </div>
    </section>
  `;
}

export function renderCronicas(lang) {
  const t = I18N[lang];
  return `
    ${renderUniverseSubnav(lang, 'cronicas')}

    <section class="page-hero container">
      <p class="eyebrow">${escapeHtml(t.chroniclesPage.eyebrow)}</p>
      <h1 class="page-title">${escapeHtml(t.chroniclesPage.title)}</h1>
      <p class="section-lead">${escapeHtml(t.chroniclesPage.lead)}</p>
    </section>

    <section class="section">
      <div class="container">
        <div class="chronicles-collage">
          ${CHRONICLES_COLLAGE.map(
            (tile) => `
            <a href="${escapeHtml(tile.to)}" data-link class="collage-tile tile-${escapeHtml(tile.span)}">
              <img src="${escapeHtml(tile.image)}" alt="${escapeHtml(tile.title)}" loading="lazy" />
              <div class="collage-overlay">
                <span class="mono-code">${escapeHtml(tile.tag[lang])}</span>
                <h2>${escapeHtml(tile.title)}</h2>
                <p>${escapeHtml(tile.caption[lang])}</p>
              </div>
            </a>`
          ).join('')}
        </div>

        <article class="panel premise-panel">
          <div>
            <h2>${escapeHtml(t.chroniclesPage.premiseTitle)}</h2>
            <p class="body-copy">${escapeHtml(t.chroniclesPage.premiseBody1)}</p>
            <p class="body-muted">${escapeHtml(t.chroniclesPage.premiseBody2)}</p>
          </div>
          <div class="premise-actions">
            <a href="/universo" data-link class="btn btn-primary">${escapeHtml(t.chroniclesPage.ctaArchive)}</a>
            <a href="/cronologia" data-link class="btn btn-cyan">${escapeHtml(t.chroniclesPage.ctaTimeline)}</a>
            <a href="/libros" data-link class="btn btn-ghost">${escapeHtml(t.chroniclesPage.ctaBooks)}</a>
          </div>
        </article>
      </div>
    </section>
  `;
}

export function renderCronologia(lang) {
  const t = I18N[lang];
  return `
    ${renderUniverseSubnav(lang, 'cronologia')}

    <section class="page-hero container">
      <p class="eyebrow">${escapeHtml(t.timelinePage.eyebrow)}</p>
      <h1 class="page-title">${escapeHtml(t.timelinePage.title)}</h1>
      <p class="section-lead">${escapeHtml(t.timelinePage.lead)}</p>
      <div class="timeline-jump-row">
        ${TIMELINE_MILESTONES.map(
          (m) => `<a href="#year-${escapeHtml(m.year)}" class="tag-chip">${escapeHtml(t.timelinePage.jumpTo)} ${escapeHtml(m.year)}</a>`
        ).join('')}
      </div>
    </section>

    <section class="section">
      <div class="container timeline-alternating">
        ${TIMELINE_MILESTONES.map(
          (item, index) => `
          <article id="year-${escapeHtml(item.year)}" class="panel timeline-row ${index % 2 === 1 ? 'is-reversed' : ''} accent-${escapeHtml(item.accent)}">
            <div class="timeline-media">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.imageAlt[lang])}" loading="lazy" />
              <span class="timeline-year-badge">${escapeHtml(item.year)}</span>
            </div>
            <div class="timeline-copy">
              <span class="mono-code">${escapeHtml(item.code)}</span>
              <h2>${escapeHtml(item.year)} — ${escapeHtml(item.title[lang])}</h2>
              <p class="body-copy">${escapeHtml(item.summary[lang])}</p>
              <p class="body-muted">${escapeHtml(item.note[lang])}</p>
              <div class="button-cluster">
                ${item.links
                  .map(
                    (lnk) => `<a href="${escapeHtml(lnk.to)}" data-link class="btn btn-sm btn-ghost">${escapeHtml(lnk.label[lang])} →</a>`
                  )
                  .join('')}
              </div>
            </div>
          </article>`
        ).join('')}
      </div>
    </section>
  `;
}

export function renderLibros(lang) {
  const t = I18N[lang];
  return `
    <section class="page-hero container">
      <p class="eyebrow">${escapeHtml(t.booksPage.eyebrow)}</p>
      <h1 class="page-title">${escapeHtml(t.booksPage.title)}</h1>
      <p class="section-lead">${escapeHtml(t.booksPage.lead)}</p>
      <p class="status-note">${escapeHtml(t.booksPage.distinctionNote)}</p>
    </section>

    <section class="section">
      <div class="container grid-3">
        ${TRILOGY.map((book) => {
          const hasBuy = Boolean(book.links.amazonKdp);
          const hasSample = Boolean(book.links.readSample);
          return `
            <article class="panel book-card">
              <div class="book-cover-frame">
                <img src="${escapeHtml(book.cover)}" alt="${escapeHtml(book.title)}" loading="lazy" />
                <span class="mono-badge">${escapeHtml(book.kind[lang])}</span>
                ${
                  book.coverStatus === 'provisional'
                    ? `<span class="provisional-pill">${escapeHtml(t.booksPage.provisionalArt)}</span>`
                    : `<span class="official-pill">${escapeHtml(t.booksPage.officialArt)}</span>`
                }
              </div>
              <div class="book-body">
                <h2>${escapeHtml(book.title)}</h2>
                <p class="body-copy">${escapeHtml(book.logline[lang])}</p>
                <p class="body-muted">${escapeHtml(book.synopsis[lang])}</p>

                ${
                  book.availabilityNote
                    ? `<div class="tag-row"><span class="badge badge-cyan">${escapeHtml(book.availabilityNote[lang])}</span></div>`
                    : ''
                }

                ${
                  hasBuy || hasSample
                    ? `<div class="button-cluster">
                        ${
                          hasBuy
                            ? `<a href="${escapeHtml(book.links.amazonKdp)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">${escapeHtml(t.booksPage.buyLabel)} ↗</a>`
                            : ''
                        }
                        ${
                          hasSample
                            ? `<a href="${escapeHtml(book.links.readSample)}" target="_blank" rel="noopener noreferrer" class="btn btn-cyan">${escapeHtml(t.booksPage.sampleLabel)} ↗</a>`
                            : ''
                        }
                      </div>`
                    : `<div class="book-coming-soon"><span class="badge badge-violet">${escapeHtml(t.booksPage.comingSoonLabel)}</span></div>`
                }
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </section>
  `;
}

export function renderExplorar(lang) {
  const t = I18N[lang];
  const socialEntries = Object.entries(PENDING_CONFIG.socialLinks).filter(([, url]) => Boolean(url));

  return `
    <section class="page-hero container">
      <p class="eyebrow">${escapeHtml(t.explorePage.eyebrow)}</p>
      <h1 class="page-title">${escapeHtml(t.explorePage.title)}</h1>
      <p class="section-lead">${escapeHtml(t.explorePage.lead)}</p>
    </section>

    <section class="section">
      <div class="container space-stack">
        <div>
          <h2 class="section-subtitle">${escapeHtml(t.explorePage.profilesTitle)}</h2>
          <p class="body-muted">${escapeHtml(t.explorePage.profilesSubtitle)}</p>
          <div class="grid-4">
            ${OFFICIAL_ARTIST_PROFILES.map(
              (profile) => `
              <a href="${escapeHtml(profile.url)}" target="_blank" rel="noopener noreferrer" class="panel social-card">
                <div class="social-icon-wrap">${profileIcon(profile.id)}</div>
                <span class="mono-code">${escapeHtml(t.artistProfilesLabel)}</span>
                <h3>${escapeHtml(profile.name)} <span aria-hidden="true">↗</span></h3>
                <span class="mono-url">${escapeHtml(profile.url.replace(/^https?:\/\//, ''))}</span>
              </a>`
            ).join('')}
          </div>
        </div>

        ${
          socialEntries.length > 0
            ? `<div class="grid-4">
                ${socialEntries
                  .map(
                    ([name, url]) => `
                  <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="panel social-card">
                    <h3>${escapeHtml(name)} ↗</h3>
                  </a>`
                  )
                  .join('')}
              </div>`
            : ''
        }

        <div class="grid-2">
          <article class="panel">
            <h3>${escapeHtml(t.explorePage.pendingTitle)}</h3>
            <ul class="pending-list">
              ${t.explorePage.pendingItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
            </ul>
          </article>

          <article class="panel">
            <div class="panel-head">
              <h3>${escapeHtml(t.explorePage.dryRunTitle)}</h3>
              <span class="badge badge-cyan">${escapeHtml(t.explorePage.dryRunBadge)}</span>
            </div>
            <p class="body-muted">${escapeHtml(t.explorePage.dryRunDesc)}</p>
            <form id="dry-run-contact-form" class="dry-run-form" novalidate>
              <div class="form-field">
                <label for="dry-name">${escapeHtml(t.explorePage.dryRunName)}</label>
                <input id="dry-name" name="name" type="text" placeholder="Aeron-097" autocomplete="name" />
              </div>
              <div class="form-field">
                <label for="dry-email">${escapeHtml(t.explorePage.dryRunEmail)}</label>
                <input id="dry-email" name="email" type="email" placeholder="signal@example.com" required autocomplete="email" />
              </div>
              <div class="form-field">
                <label for="dry-msg">${escapeHtml(t.explorePage.dryRunMsg)}</label>
                <textarea id="dry-msg" name="message" rows="2" placeholder="Memory is light."></textarea>
              </div>
              <button type="submit" class="btn btn-cyan">${escapeHtml(t.explorePage.dryRunSubmit)}</button>
              <div id="dry-run-feedback" class="dry-run-feedback" role="status" aria-live="polite" hidden></div>
            </form>
          </article>
        </div>
      </div>
    </section>
  `;
}

export function renderMerch(lang) {
  const t = I18N[lang];
  const copy = MERCH_CONFIG.editableStatus[lang];
  const hasStore = Boolean(PENDING_CONFIG.merchStoreUrl);
  const hasItems = Array.isArray(PENDING_CONFIG.merchItems) && PENDING_CONFIG.merchItems.length > 0;

  return `
    <section class="merch-hero">
      <div class="merch-hero-bg" aria-hidden="true">
        <img src="${escapeHtml(MERCH_CONFIG.heroImage)}" alt="" />
        <div class="merch-hero-scrim"></div>
      </div>

      <div class="container merch-hero-content">
        <p class="eyebrow">${escapeHtml(copy.eyebrow)}</p>
        <h1 class="page-title">${escapeHtml(copy.title)}</h1>
        <p class="section-lead">${escapeHtml(copy.subtitle)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${
          hasItems
            ? `<div class="grid-3">
                ${PENDING_CONFIG.merchItems
                  .map(
                    (item) => `
                  <article class="panel">
                    <h3>${escapeHtml(item.name)}</h3>
                    <p>${escapeHtml(item.description || '')}</p>
                  </article>`
                  )
                  .join('')}
              </div>`
            : `<article class="panel merch-status-panel">
                <h2>${escapeHtml(copy.subtitle)}</h2>
                <p class="body-copy">${escapeHtml(copy.description)}</p>
                <p class="mono-code">${escapeHtml(copy.note)}</p>
                <div class="card-actions">
                  ${
                    hasStore
                      ? `<a href="${escapeHtml(PENDING_CONFIG.merchStoreUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Store ↗</a>`
                      : ''
                  }
                  <a href="/musica" data-link class="btn btn-primary">${escapeHtml(t.merchPage.goMusic)}</a>
                  <a href="/explorar" data-link class="btn btn-ghost">${escapeHtml(t.merchPage.goExplore)}</a>
                </div>
              </article>`
        }
      </div>
    </section>
  `;
}

export function renderNotFound(lang) {
  const t = I18N[lang].notFound;
  return `
    <section class="section">
      <div class="container">
        <article class="panel empty-panel">
          <p class="eyebrow">${escapeHtml(t.eyebrow)}</p>
          <h1 class="page-title">${escapeHtml(t.title)}</h1>
          <p class="section-lead">${escapeHtml(t.desc)}</p>
          <a href="/" data-link class="btn btn-primary">${escapeHtml(t.cta)}</a>
        </article>
      </div>
    </section>
  `;
}
