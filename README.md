# Ali Ibrahim Al Safwan — Portfolio

A dependency-free portfolio for GitHub Pages. Plain HTML/CSS/JS — no build step,
no framework, no external requests (system fonts, inline SVG icons, self-drawn
canvas background), no trackers.

Live at: **https://aliibrahimx.github.io/** (after the repo rename below)

## Structure

```
index.html          All markup and content
404.html            Themed "packet lost" error page
css/styles.css      Design tokens, components, sections, responsive rules
js/main.js          Theme, nav, scroll systems, reveal, counters, terminal, canvas
assets/favicon.svg  Site icon (shield + A mark)
assets/og-image.png 1200×630 social preview (link previews on LinkedIn/X/WhatsApp)
robots.txt          Crawl rules
sitemap.xml         Single-page sitemap
.nojekyll           Tells GitHub Pages to skip Jekyll processing
```

## Deploy

The site currently lives in the `AliIbrahim` repo and serves at
`https://aliibrahimx.github.io/AliIbrahim/`. That works, and everything here is
compatible with it.

### Optional upgrade: get the clean root URL

Rename the `AliIbrahim` repo (Settings → General → Repository name) to exactly
`AliIbrahimX.github.io` and the same site instantly moves to
`https://aliibrahimx.github.io/` — a nicer address for a CV. The old
`i3llaw.github.io` repo is no longer needed and can be deleted to avoid
confusion.

## Content that may need your confirmation

- **Skill levels** — each `<li class="skill-item">` has
  `data-level="learning|familiar|proficient"`; adjust any that don't match
  your self-assessment (the visible tier label text should match too).

## Running locally

No build step — serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Design notes

- **Zero external requests**: system font stacks (sans + mono), inline SVG
  icons, canvas drawn in JS. Nothing to block, break, or slow down.
- **Theme**: dark by default (set before first paint to avoid flashing),
  light mode via the header toggle; preference stored in `localStorage`,
  falling back to the OS setting.
- **Motion**: scroll reveals, the hero terminal animation, stat counters, and
  the canvas are all skipped or rendered instantly when the visitor has
  `prefers-reduced-motion: reduce` enabled.
- **No email by design**: contact routes through LinkedIn and GitHub, so there
  is no contact form (a form needs a backend and an inbox). If you later want
  one, Formspree + a real email address is a 10-minute add.
