# Restaurant Mandalay – website

One-page website for **Mandalay**, a family-run Burmese restaurant in Köln, owned by Thurein's parents. Thurein (UX designer) leads design; Claude builds.

## Quick start (code words)
- **"Weiter"** – start of a session:
  1. Explain in plain words, then run `git pull`, which downloads the latest version from GitHub. If there are local changes or the pull fails, stop and explain the situation simply instead of forcing anything.
  2. Read "Current status" below and give a short recap: what we did last, what's open.
  3. Suggest the next step and ask what Thurein wants to work on.
- **"Review changes in Figma"** – take design changes from Figma into the code:
  1. Read the desktop frame `25:2`, the phone frame `26:224` and the open-menu frame `27:443` (see "Figma" below) with `get_screenshot` + `get_design_context`. Also check the "Components" page if Thurein changed a component. This is read-only. If Thurein mentions a new frame or page, ask for its link.
  2. Compare them with the current `index.html` + `css/styles.css`. The frames were rebuilt from the code, so every difference is a change by Thurein. Known differences that are not changes: Burmese text uses Padauk in Figma (Noto Sans Myanmar isn't available there), the menu shows only the Vorspeisen tab, colors are light theme only.
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
- Design file: https://www.figma.com/design/2NfehXjKjFBXh7f0gUTYLP/Restaurant-Mandalay (fileKey `2NfehXjKjFBXh7f0gUTYLP`).
  - Page **"Website"**: desktop 1280 px = frame `25:2`, phone 375 px = frame `26:224`, open mobile menu = frame `27:443`. All auto layout, built from component instances; content max 1040 px wide, so frames can be resized.
  - Page **"Components"**: auto-layout components grouped in sections (Images, Icons, Buttons, Menu, Header & navigation, Content, Footer, Neu bei uns & Links): Logo, Illustration/Mohinga, Icon/Menu|Close|Chevron, Button, Tag, Tab, Tab / Split, Filter item, Filter list, Dish, Header (Desktop / Mobile / Mobile slim bar), Mobile menu, Fact, Hours row, Reservation box, Map (21:9 / 16:9), Footer, Crayon underline (PNG tile of `--crayon-line`), Nav link (Default / Hover), Text link, Dish card (Photo / Placeholder), Slider arrow (Prev / Next), Slider controls.
  - The free Figma plan limits MCP tool calls; when the limit is hit, Figma work has to wait until it resets.
  - Variables: "Color" (`color/bg`, `color/jade` … same names as the CSS tokens, light theme; dark values are in each variable's description, because the free Figma plan allows only one mode) and "Spacing" (`space/*`, `radius/*`). Plus text styles (Display/Heading/Body/Dish/Caption/Burmese) and shadow styles.
- Figma connection is set up in `.mcp.json` (Figma's official server). On a new computer, Thurein logs in once: `/mcp` → figma → Authenticate.
- **Code → Figma:** update the components and frames with `use_figma`, reusing the existing components and variables (no more `html_to_figma` imports, they only make plain layers). Images go in with `upload_assets` (curl must run from the image's folder). The Mohinga drawing is a PNG rendered with headless Edge, because Figma can't import the SVG crayon filter.
- **Figma → code:** Thurein sends a link to a frame, Claude reads it (`get_design_context` + `get_screenshot`) and updates the code using the existing tokens in `styles.css`.
- Burmese text: Figma uses **Padauk** (Noto Sans Myanmar isn't available in Figma).

## Structure
- `index.html` – the page (sections: hero, `#uns`, "Neu bei uns" (`.try`: 4 dishes from "Empfehlungen" with 4:3 photos from `assets/images/dishes/`; 2 × 2 on desktop and tablets, swipeable CSS scroll-snap row on phones ≤760 px with controls from `js/main.js` (‹ › arrows + one dot per dish, active dot stretched; auto loop every 5 s that pauses on hover/focus/off screen, stops for good once the visitor uses the slider, and is off with reduced motion); button opens that tab via `data-tab`), `#karte`, `#besuch`, footer). The head has the share preview (`og:` tags) and restaurant details for search engines (schema.org JSON-LD).
- Tab icon: `assets/icons/favicon-48.png`, `favicon-192.png`, `apple-touch-icon.png` = the header logo on a red circle (rendered with headless Edge from `Mandalay-Logo-02.png`), linked in the head of all 3 pages.
- `impressum.html`, `datenschutz.html` – legal pages; share the nav and footer with `index.html` (copied, so change all three together)
- `css/styles.css` – all styles; design tokens (colors) at the top in `:root`
- `js/main.js` – mobile navigation (full-screen menu with call + e-mail buttons, sticky slim bar on phones/tablets ≤1024 px: slides in once the big header is out of view and **always stays visible**, at Thurein's request, while desktop has no sticky header; it sets `--bar-h` for `scroll-padding-top`); "back to top" Mohinga bowl (desktop/tablet: the hero bowl flies into the bottom right corner while scrolling and turns into the top view `mohinga-top.svg`, 84 px, with a hopping ↑ arrow above it; phones, legal pages and reduced motion: the top view just fades in, 68 px on phones; styles in the "Back to top" bowl block of `styles.css`); menu (Speisekarte) category tabs + "Hauptgerichte" filter (split pill: tab shows all, arrow opens the filter) (without JS the whole menu shows as one list)
- `assets/images|fonts|icons/` – site assets
- `assets/icons/Menu.svg` – burger icon, copied **inline** into the `.burger` button of all 3 pages (paths `.l1/.l2/.l3`, `fill="currentColor"`), so CSS can animate it into an ✕ (`nav.open`). If the icon changes, update all 3 pages.
- `assets/images/Mandalay-Logo-02.png` – white round badge logo, shown in the header of all 3 pages: visible circle about 88 px (64 px on phones, ~48 px in the slim scroll bar). The PNG has ~8% transparent margin, so `--logo-size` on `nav` is larger and the margin is pulled in with negative margins. `Mandalay-Logo-01.png` is the same logo in gold (for light backgrounds).
- `assets/images/drawings/` – hand-coded wax-crayon SVG drawings (Mohinga side view + `mohinga-top.svg` top view, Lahpet Thoke, Ohn No Khao Swe, samosas, milk tea, pot/leaf/chili icons). The crayon look comes from an SVG filter (`#wax`) + hatch pattern inside each file; preview with `qlmanage -t` (Quick Look) when no browser is available.
- `assets/images/karte-mandalay.jpg` – Google Maps screenshot for the map in `#besuch` (static, clicks open Google Maps)
- `design/drafts/` – original design exports, kept as reference; never edited
- `design/references/` – moodboards, screenshots, inspiration
- `design/explorations/` – clickable prototypes (`hero-1-schuessel`, `hero-2-split`, `hero-3-video`, `hero-4-illustration`); use the real `css/styles.css` plus `hero-ideas.css`, never linked from the live site

## Conventions
- Site language is **German** (`lang="de"`); Burmese text gets `lang="my"`. Talk with Thurein in English.
- Fonts: Young Serif (headings), Figtree (body), Noto Sans Myanmar (Burmese script).
- Keep light/dark themes working: change colors via the tokens, not hardcoded values.
- Wax crayon style in the UI: **only for underlines** (text links always, desktop nav links on hover/focus), via `--crayon-line` in the "Crayon underline" block of `styles.css` (a gold SVG stroke with the drawings' wax filter). Components (buttons, tags, tabs, dots…) stay clean; a crayon version of them was tried and dropped.
- Keep it accessible: focus styles, aria on the burger, reduced-motion support, sufficient contrast.
- Mobile first in testing: check ~375px, ~768px and desktop.

## Open items
- Contact details are real on all pages (owner Ma Khin Mar Win, Brüsseler Str. 53, 50674 Köln, 0221 510 12 96, aungthu@t-online.de) and must stay identical across `index.html`, `impressum.html` and `datenschutz.html`.
- Menu (`#karte`) is real, taken from `material/finale%20Speisekarte.pdf` (2026-10-21). Still open: Burmese script for dish names (the PDF's Burmese text can't be extracted, so ask the family for it as plain text), and a few unclear spots in the PDF (B1 name, prices of Rind 60–63, "Europagras", the "9" next to Kabeljau).
- Placeholder content still in `index.html`: opening hours, family names in "Über uns" and the footer ("Familie Aung") — confirm with the family.
- **Impressum** and **Datenschutz** pages exist but contain placeholders, highlighted with `<span class="todo">` (Handelsregister number, USt-IdNr., Wirtschafts-ID, hosting provider). Each file has a TODO comment at the top. Have the final texts checked before launch.
- Online reservation: "Online reservieren" buttons link to OpenTable (rid 516183) as a plain link that opens in a new tab; the official OpenTable script/widget was deliberately not embedded (privacy; an on-page calendar window was tried and dropped). Test the link once in a browser, and have the OpenTable paragraph in `datenschutz.html` checked (marked `todo`).
- Map in `#besuch` is Thurein's Google Maps screenshot without Google's own logo/credit bar; a text credit "Kartendaten © 2026 Google" was added. Better: a new screenshot that includes Google's credit bar. Have the use checked before launch.
- No real photos yet. First real photo: `assets/images/shared image/Innenraum.jpg` (dining room), cropped to 1200×630 as `assets/images/share-mandalay.jpg` for the share preview.
- Once the domain is known: add `og:url` + `og:image` (full addresses) and `url`, `image`, `hasMenu` to the JSON-LD in `index.html` (TODO comments there). Once the hours are confirmed: add `openingHoursSpecification` to the JSON-LD.
- "Neu bei uns" texts are drafts: have the family check them.
- "Neu bei uns" photos (Mohinga, Ohn Noh Kaukswe, Lape' Thou') are free stand-ins from Wikimedia Commons (credit line under the cards, required by CC BY-SA). Gjin Thou' (ginger salad) has a "Foto folgt" placeholder because no free photo exists. Replace all with the restaurant's own photos (1200×900, 4:3, same angle and light), then delete the credit line.
- Hosting/domain not decided.
- The family's old website may still run Google Analytics with an outdated privacy text, which is a legal risk until it's taken down or fixed.

## Current status (update at the end of each session)
_Last updated: 2026-10-22_
- **Done on 2026-10-21:** "Über uns" re-laid out (headline + text side by side, three points in a row); real menu from the PDF (101 dishes, tabs Vorspeisen · Empfehlungen · Hauptgerichte ▾ · Menüs · Desserts, Hauptgerichte shows all with a type filter, German + English, allergens, columns filled top to bottom); "Besuch" full width with Google Maps picture (click opens Google Maps), hours + address next to the reservation box; wax-crayon Mohinga drawing in the hero (animated steam) replacing the decorative circle; new mobile navigation (full-screen red menu, slim bar on scroll up, call + "Online reservieren" buttons); OpenTable reservation link.
- **Done later on 2026-10-21 (on the desktop computer):**
  - The real white logo (`Mandalay-Logo-02.png`) is now in the header of all 3 pages.
  - Nav links on desktop use Young Serif.
  - The burger is the inline `assets/icons/Menu.svg` (40 px). It animates into an ✕.
  - The Mohinga bowl is hidden on phones (≤760 px).
  - "Besuch" headline: "Wo Sie uns finden", centered.
  - Typo "einzie" → "einzige" fixed.
  - Phones/tablets: the header is now always sticky. It shrinks smoothly into the slim bar while scrolling down from the top, and grows back on the way up. Scroll-linked via `--p` (0 = slim, 1 = full); `--bar-h` is used for `scroll-padding-top`.
- **Done on 2026-10-22:** Figma rebuilt from the code. New "Components" page (auto-layout components, color/spacing variables, text + shadow styles), and new desktop, phone and open-menu frames on the "Website" page built from them. Old imported frames deleted. Then the "back to top" Mohinga bowl went live (tried as a prototype first, prototype files removed). It isn't in Figma yet. Then: tab icon, share preview, restaurant details for search engines, and the "Neu bei uns" section.
- **Done later on 2026-10-22:**
  - "Neu bei uns": 4 dishes (Mont Hin Ga, Ohn Noh Kaukswe, Lape' Thou', Gjin Thou') with stand-in photos from Wikimedia Commons + credit line, "Foto folgt" placeholder for Gjin Thou'. 2 × 2 on desktop/tablet, square photo corners, centred button. Phones: swipeable slider with ‹ › arrows, dots (active one stretched) and a 5 s auto loop.
  - "Back to top" bowl: smoother flight (only transforms, scrolls with the page until it lands), flip instead of crossfade as a short timed animation at the halfway point (flips back earlier on the way up).
  - Crayon style tried for all components and dropped; kept only for underlines (text links always, desktop nav links draw in on hover). Desktop nav links are white, cream on hover.
  - Figma updated: new components (see Figma above), "Neu bei uns" in the desktop and phone frames, white nav, crayon footer links. The final check screenshot couldn't be taken (Figma call limit), so Thurein checks the phone slider and the photo shapes in Figma. The "back to top" bowl is still not in Figma.
- **Next:**
  - Thurein photographs the 4 dishes at the restaurant (same angle and light) → replace the stand-ins, delete the credit line.
  - New local files from Thurein, not on GitHub yet: `assets/icons/Outline/Interface/Caret left.svg` + `Caret right.svg`, `assets/images/Inwersalat.jpg`, `assets/images/M_and_Beef_okkra_n.jpg`. Ask where they're from (the repo is public), then add them (Inwersalat could replace the "Foto folgt" placeholder).
  - Check the Figma phone frame ("Neu bei uns" slider).
  - Still open from before: test the sticky header and burger on a real phone (same Wi-Fi: Live Server + the computer's IP address, port 5500), and check how long dish names wrap on the phone.
- **Decide:**
  - The GitHub repo is **public**. Suggested making it private (Settings → Change visibility).
  - The menu PDF `material/finale Speisekarte (1).pdf` is not on GitHub yet (only on the desktop computer). Upload it once the repo is private or Thurein agrees.
  - `tools/make-map.js` (old OpenStreetMap map script) is only on the desktop computer and is no longer used, since the site uses a Google Maps screenshot.
- **Hero headline:** still wraps onto two lines because of `max-width: 12ch` on `.hero h1`. A fix was proposed (remove the limit, lower the max size), but it isn't decided yet.
- **On hold:** questions for the family for the Impressum. Is the business in the Handelsregister? If not, delete that block and change "Vertreten durch" to "Inhaberin". Do a USt-IdNr. and a Wirtschafts-ID exist?
- **Small fixes:** footer "Familie Aung" is a placeholder.
