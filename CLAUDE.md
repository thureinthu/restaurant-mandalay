# Restaurant Mandalay – website

One-page website for **Mandalay**, a family-run Burmese restaurant in Köln, owned by Thurein's parents. Thurein (UX designer) leads design; Claude builds.

## Stack
- Plain static site: HTML + CSS + a little vanilla JS. No framework, no build step.
- Open `index.html` directly, or use the VS Code "Live Server" extension for auto-reload.

## Structure
- `index.html` – the page (sections: hero, `#uns`, `#karte`, `#besuch`, footer)
- `impressum.html`, `datenschutz.html` – legal pages; share the nav and footer with `index.html` (copied, so change all three together)
- `css/styles.css` – all styles; design tokens (colors) at the top in `:root`
- `js/main.js` – mobile burger menu
- `assets/images|fonts|icons/` – site assets
- `design/drafts/` – original design exports, kept as reference; never edited
- `design/references/` – moodboards, screenshots, inspiration
- `design/explorations/` – clickable prototypes (e.g. `hero-1/2/3-*.html` hero ideas); use the real `css/styles.css` plus `hero-ideas.css`, never linked from the live site

## Conventions
- Site language is **German** (`lang="de"`); Burmese text gets `lang="my"`. Talk with Thurein in English.
- Fonts: Young Serif (headings), Figtree (body), Noto Sans Myanmar (Burmese script).
- Keep light/dark themes working: change colors via the tokens, not hardcoded values.
- Keep it accessible: focus styles, aria on the burger, reduced-motion support, sufficient contrast.
- Mobile first in testing: check ~375px, ~768px and desktop.

## Open items
- Contact details are real on all pages (owner Ma Khin Mar Win, Brüsseler Str. 53, 50674 Köln, 0221 510 12 96, aungthu@t-online.de) and must stay identical across `index.html`, `impressum.html` and `datenschutz.html`.
- Placeholder content still in `index.html`: menu & prices, opening hours, family names in "Über uns" and the footer ("Familie Aung") — confirm with the family.
- **Impressum** and **Datenschutz** pages exist but contain placeholders, highlighted with `<span class="todo">` (owner name, USt-IdNr., hosting provider). Each file has a TODO comment at the top. Have the final texts checked before launch.
- No real photos yet.
- Hosting/domain not decided.
