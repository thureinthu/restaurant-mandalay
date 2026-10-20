# Restaurant Mandalay – website

One-page website for **Mandalay**, a family-run Burmese restaurant in Köln, owned by Thurein's parents. Thurein (UX designer) leads design; Claude builds.

## Quick start (code words)
- **"Weiter"** – start of a session:
  1. Explain in plain words, then run `git pull`, which downloads the latest version from GitHub. If there are local changes or the pull fails, stop and explain the situation simply instead of forcing anything.
  2. Read "Current status" below and give a short recap: what we did last, what's open.
  3. Suggest the next step and ask what Thurein wants to work on.
- **"Review changes in Figma"** – take design changes from Figma into the code:
  1. Read the desktop frame `2:2` and the phone frame `4:2` (see "Figma" below) with `get_screenshot` + `get_design_context`. This is read-only. If Thurein mentions a new frame or page, ask for its link.
  2. Compare them with the current `index.html` + `css/styles.css`. The frames were imported from the code, so every difference is a change by Thurein. Ignore known import glitches: invisible Burmese text, the hero circle overlapping the buttons on the phone frame, generic layer names.
  3. List the changes in plain words, numbered, with desktop/phone noted. Say how you'd build each one, mapping new colors to existing tokens or asking whether a color replaces a token or is new. Wait for Thurein's OK (all, or specific numbers).
  4. Implement, explain what changed, and ask Thurein to check in Live Server (375 px, 768 px, desktop).
  - Figma is the master design. After code changes that didn't come from Figma, offer to refresh the Figma frames (re-import), so the next review doesn't report them as differences.
- **"Feierabend"** – end of a session:
  1. Update "Current status" below (date, what was done, what's next).
  2. Explain what will be saved, then commit everything and `git push`.
  3. Confirm in one line that everything is on GitHub.

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

## Figma
- Design file: https://www.figma.com/design/2NfehXjKjFBXh7f0gUTYLP/Restaurant-Mandalay (fileKey `2NfehXjKjFBXh7f0gUTYLP`). Imports of `index.html`: desktop 1280 px = frame `2:2`, phone 375 px = frame `4:2`.
- Phone import trick: in the temp copy of the CSS, change `@media (max-width: …)` to `@media all`, replace `Xvw` with `calc(X * 3.75px)`, set `html, body { width: 375px }`, and send with `cssSelector: "body"`.
- Figma connection is set up in `.mcp.json` (Figma's official server). On a new computer, Thurein logs in once: `/mcp` → figma → Authenticate.
- **Code → Figma:** bundle `index.html` + `css/styles.css` into one HTML file in a temp folder, then use `html_to_figma`. It lands on a new page as plain editable layers (no components or variables).
- **Figma → code:** Thurein sends a link to a frame, Claude reads it (`get_design_context` + `get_screenshot`) and updates the code using the existing tokens in `styles.css`.
- Known issue: Burmese text (Noto Sans Myanmar) didn't render in the import. The font has to be available in Figma.

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
