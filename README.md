# FAVIAX — Neon Constellations (Neo-Astra 2097)

Sitio web oficial de **FAVIAX**: proyecto musical synthwave y universo narrativo ambientado en **Neo-Astra City (2097)**.

> «La memoria es luz. El amor es frecuencia.» / «Memory is light. Love is frequency.»

---

## Arquitectura del proyecto

Aplicación web estática modular (HTML + CSS + ES Modules + History API SPA router) con soporte bilingüe **ES/EN** (`es` inicial, preferencia persistente en `localStorage`), rutas compartibles y fallback de SPA para despliegue en Vercel ([vercel.json](vercel.json)).

### Pantallas implementadas

1. **Inicio (`/`)**: Hero cinematográfico con skyline lluvioso de Neo-Astra, titular `NEON CONSTELLATIONS`, dos accesos principales (*Escuchar música* y *Explorar Neo-Astra*), acceso secundario a la novela/trilogía, avance de discografía, muestra del archivo y sectores del portal.
2. **Música / Transmissions (`/musica`)**: Selector entre *Neon Constellations* y *Neon Constellations: Afterglow Archives*, portada oficial, descripción, perfiles oficiales del artista y bloques condicionales para enlaces por álbum, reproductor autorizado, visualizers y pistas verificadas.
3. **Universo / The Signal Archive (`/universo` y `/universo/:slug`)**: Filtros por categoría (*Todos*, *Personajes*, *Lugares*, *Sistemas*, *Casas de Neón*), búsqueda en vivo y fichas enlazables sin spoilers para `Neo-Astra`, `Aeron Vale`, `Lyra Nox`, `Kade Ryder`, `SERAPH-9`, `AURA`, `E-Lattice`, `EIDOLON`, `Neon Pulse` y `Casas de Neón`.
4. **Crónicas / Neo-Astra Chronicles (`/cronicas`)**: Collage asimétrico de ciudad, personajes y entorno orbital con premisa sin spoilers y enlaces a Archivo, Cronología y Libros.
5. **Cronología (`/cronologia`)**: Hitos `2085` (despliegue urbano de AURA), `2087` (incidente SABLE RAIN) y `2097` (inicio de la historia principal), con alternancia imagen/texto en escritorio y diseño apilado en móvil.
6. **Libros (`/libros`)**: Trilogía literaria (*I. Neon Constellations*, *II. Afterglow Archives*, *III. Becoming Light*) claramente diferenciada de los álbumes musicales y sin estado comercial deducido.
7. **Explorar / Connect to the Signal (`/explorar`)**: Tarjetas de los perfiles oficiales verificados del artista y contacto directo hacia `favio.cuentas@orvexaio.com`.
8. **Merch / Equip the Signal (`/merch`)**: Hero con pasillo nocturno y estado breve editable (`MERCH_CONFIG` en `src/data.js`), sin precios, existencias ni acciones de compra ficticias.

---

## Comandos locales

```bash
# Iniciar servidor local con soporte para rutas directas (http://127.0.0.1:4173)
npm run dev

# Verificar sintaxis JS e inventario de recursos locales
npm run check

# Generar salida estática en dist/
npm run build

# Ejecutar pruebas end-to-end en Chrome (360px, 768px, 1440px)
npm test
```

---

## Inventario de recursos gráficos (`assets/`)

- **Arte oficial:**
  - `assets/album-neon-constellations.jpg` — Portada oficial *Neon Constellations* (álbum)
  - `assets/album-afterglow.jpg` — Portada oficial *Afterglow* (*Neon Constellations: Afterglow Archives*, álbum)
  - `assets/book-neon-constellations.jpg` — Portada oficial *I. Neon Constellations* (Book I)
  - `assets/book-afterglow.jpg` — Portada oficial *II. Afterglow Archives* (Book II)
  - `assets/album-cover-2.png` — Ilustración urbana nocturna bajo la lluvia (usada en el hito 2087 *SABLE RAIN* de Cronología)
  - `assets/hero-bg.png` — Ilustración de Neo-Astra (usada en Hero, AURA, Casas de Neón y 2085)
  - `assets/about-art.png` — Escena musical en vivo (usada en *Neon Pulse*)
- **Arte integrado del diseño de referencia:**
  - `assets/skyline-rain.jpg` — Skyline lluvioso de Neo-Astra (Hero, Neo-Astra, E-Lattice, 2097)
  - `assets/char-aeron.jpg` — Retrato conceptual de Aeron Vale
  - `assets/char-lyra.jpg` — Retrato conceptual de Lyra Nox
  - `assets/char-kade.jpg` — Retrato conceptual de Kade Ryder
- **Arte complementario generado para escenas faltantes:**
  - `assets/orbital-array.jpg` — Entorno orbital (SERAPH-9, EIDOLON, visual provisional Libro III)
  - `assets/merch-corridor.jpg` — Pasillo nocturno arquitectónico (Hero de *Merch / Equip the Signal*)

---

## Campos y enlaces pendientes por configurar (`src/data.js`)

Los botones sin destino verificado permanecen ocultos automáticamente en la interfaz. Edita `src/data.js` cuando cuentes con las URLs definitivas:

1. **Música (`DISCOGRAPHY`):**
   - `albumLinks.spotify`, `albumLinks.appleMusic`, `albumLinks.youtubeMusic`, `albumLinks.amazonMusic` (por cada álbum).
   - `visualizerUrl` (enlaces oficiales de YouTube por álbum o tema).
   - `audioSrc` (fuente de audio autorizada y funcional para habilitar el `<audio>`).
   - `tracks` (listado oficial verificado de pistas y duraciones por álbum).
2. **Libros (`TRILOGY`):**
   - `links.amazonKdp` (enlace verificado de Amazon / KDP por volumen).
   - `links.readSample` (enlace verificado de lectura o muestra oficial).
   - Portada oficial dedicada para *III. Becoming Light* (actualmente usa visual provisional etiquetado).
3. **Redes, Amazon Music y Contacto (`PENDING_CONFIG`):**
   - `amazonMusicArtistUrl`
   - `socialLinks`: `instagram`, `tiktok`, `x`, `discord`
   - `contactDestination`: configurado en `mailto:favio.cuentas@orvexaio.com`
4. **Merch (`PENDING_CONFIG` & `MERCH_CONFIG`):**
   - `merchStoreUrl` (URL de tienda oficial)
   - `merchItems` (catálogo real aprobado cuando esté disponible)
