# Restaurant Mandalay – website

One-page website for **Mandalay**, a family-run Burmese restaurant in Köln, owned by Thurein's parents. Thurein (UX designer) leads design; Claude builds.

## Working with Thurein
- Talk in **English**, in easy, plain language. Thurein is a designer, not a developer.
- **Explain before doing:** say in plain words what you're about to do and why, before doing it. Explain technical terms the first time they come up.
- **Before every terminal command:** explain in the chat text, step by step, what it does, what changes and what doesn't. Thurein can't read command lines. A short tool description is not enough, and commands without an explanation get rejected.
- In summaries, start with what changed for the website and its visitors, then the technical details. End with a clear next step.
- Thurein works from several computers. **Start of a session:** `git pull` (get the latest version). **End of a session:** commit + `git push`. Offer to do both.

## Stack
- Plain static site: HTML + CSS + a little vanilla JS. No framework, no build step.
- Open `index.html` directly, or use the VS Code "Live Server" extension for auto-reload.
- Code lives at https://github.com/thureinthu/restaurant-mandalay (branch `main`). Use only the GitHub account **thureinthu** (not ThureinDOM).

## Structure
- `index.html` – the page (sections: hero, `#uns`, `#karte`, `#besuch`, footer)
- `impressum.html`, `datenschutz.html` – legal pages; share the nav and footer with `index.html` (copied, so change all three together)
- `css/styles.css` – all styles; design tokens (colors) at the top in `:root`
- `js/main.js` – mobile burger menu
- `assets/images|fonts|icons/` – site assets
- `design/drafts/` – original design exports, kept as reference; never edited
- `design/references/` – moodboards, screenshots, inspiration
- `design/explorations/` – clickable prototypes (`hero-1-schuessel`, `hero-2-split`, `hero-3-video`, `hero-4-illustration`); use the real `css/styles.css` plus `hero-ideas.css`, never linked from the live site

## Conventions
- Site language is **German** (`lang="de"`); Burmese text gets `lang="my"`. Talk with Thurein in English.
- Fonts: Young Serif (headings), Figtree (body), Noto Sans Myanmar (Burmese script).
- Keep light/dark themes working: change colors via the tokens, not hardcoded values.
- Keep it accessible: focus styles, aria on the burger, reduced-motion support, sufficient contrast.
- Mobile first in testing: check ~375px, ~768px and desktop.

## Open items
- Contact details are real on all pages (owner Ma Khin Mar Win, Brüsseler Str. 53, 50674 Köln, 0221 510 12 96, aungthu@t-online.de) and must stay identical across `index.html`, `impressum.html` and `datenschutz.html`.
- Placeholder content still in `index.html`: menu & prices, opening hours, family names in "Über uns" and the footer ("Familie Aung") — confirm with the family.
- **Impressum** and **Datenschutz** pages exist but contain placeholders, highlighted with `<span class="todo">` (Handelsregister number, USt-IdNr., Wirtschafts-ID, hosting provider). Each file has a TODO comment at the top. Have the final texts checked before launch.
- No real photos yet.
- Hosting/domain not decided.
- The family's old website may still run Google Analytics with an outdated privacy text, which is a legal risk until it's taken down or fixed.

## Current status (update at the end of each session)
_Last updated: 2026-10-20_
- **Hero redesign (active):** four prototypes in `design/explorations/`, waiting for Thurein's feedback. Thurein suggested idea 4 (playful Mohinga illustration). The SVG there is a quick hand-coded sketch that hasn't been checked in a browser yet. Next: pick a direction, refine it, then build it into `index.html`.
- **On hold:** questions for the family for the Impressum. Is the business in the Handelsregister? If not, delete that block and change "Vertreten durch" to "Inhaberin". Do a USt-IdNr. and a Wirtschafts-ID exist?
- **Small fixes:** typo "einzie" → "einzige" in the `index.html` hero (Thurein's own text, ask before fixing); footer "Familie Aung" is a placeholder.
