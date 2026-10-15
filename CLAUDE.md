# Restaurant Mandalay – website

One-page website for **Mandalay**, a family-run Burmese restaurant in Köln, owned by Thurein's parents. Thurein (UX designer) leads design; Claude builds.

## Stack
- Plain static site: HTML + CSS + a little vanilla JS. No framework, no build step.
- Open `index.html` directly, or use the VS Code "Live Server" extension for auto-reload.

## Structure
- `index.html` – the page (sections: hero, `#uns`, `#karte`, `#besuch`, footer)
- `css/styles.css` – all styles; design tokens (colors) at the top in `:root`
- `js/main.js` – mobile burger menu
- `assets/images|fonts|icons/` – site assets
- `design/drafts/` – original design exports, kept as reference; never edited
- `design/references/` – moodboards, screenshots, inspiration

## Conventions
- Site language is **German** (`lang="de"`); Burmese text gets `lang="my"`. Talk with Thurein in English.
- Fonts: Young Serif (headings), Figtree (body), Noto Sans Myanmar (Burmese script).
- Keep light/dark themes working: change colors via the tokens, not hardcoded values.
- Keep it accessible: focus styles, aria on the burger, reduced-motion support, sufficient contrast.
- Mobile first in testing: check ~375px, ~768px and desktop.

## Open items
- Placeholder content still in the draft: address (Musterstraße 12), phone (`+4900000000000`), email (`.example`), menu & prices, opening hours, family names — confirm with the family.
- **Impressum** and **Datenschutz** pages are legally required in Germany; footer currently has no links.
- Google Fonts are loaded from Google's servers → GDPR risk in Germany. Plan: self-host the fonts in `assets/fonts/`.
- No real photos yet.
- Hosting/domain not decided.
