# Ali Ibrahim Al Safwan — Portfolio

**AI Engineer | Automation | Cybersecurity**

A dependency-free personal portfolio for GitHub Pages. Plain HTML/CSS/JS — no build
step, no framework, no external network requests (self-hosted fonts, inline SVG
icons, canvas drawn in JS), no trackers.

Live at: **https://aliibrahimx.github.io/**

## Positioning

The site presents Ali as an **AI Engineer** working across AI, automation, and
cybersecurity, with his **Bachelor in Information Technology & Computing —
Networking and Security** (Arab Open University) as the technical foundation
underneath, not as the headline.

That hierarchy is deliberate and is expressed structurally, not just in copy:

- The hero states the title `AI Engineer | Automation | Cybersecurity` directly
  under the name, with "AI Engineer" carrying the accent colour.
- **What I build** (`#capabilities`) splits into a *Primary focus* tier
  (AI Engineering & Agents, Automation & Integration) and a *Technical
  foundation* tier (Cybersecurity & Networking, Software & Web). The tiers are
  visually distinct — primary cards are accent-lit, foundation cards are muted.
- **Technical stack** (`#stack`) leads with a full-width featured *AI &
  Intelligent Systems* card so AI is never a peer of HTML.
- **Projects** are ordered AI-first and filterable by area.
- The **career arc** in About shows the progression:
  IT & Networking → Cybersecurity & Enterprise IT → AI Engineering →
  AI Agents & Automation → Intelligent Systems.

**The main professional title and the company role are two different things.**
The headline `AI Engineer | Automation | Cybersecurity` is the professional
identity and must never be replaced by a company role. Separately, his role at
**SABBARAH AI** is *Co-Founder & AI Product and Growth Lead*, covering both the
AI/product side (agents, bilingual assistants, automation, integrations) and the
growth/business side (positioning, marketing content, customer acquisition).
Keep that distinction when editing `index.html`, the `INTENTS` array, and
`SYSTEM_INSTRUCTION`.

## Hero = one complete viewport

The hero is deliberately sized so the **entire** first screen is visible with no
part of the next section showing. `min-height: 100svh` (stable viewport height,
so mobile browser chrome collapsing can't leave it oversized) plus the tiers in
section 22 of `styles.css`, which progressively tighten the vertical rhythm:

| Condition | What changes |
|---|---|
| `max-height: 820px` | Reduced padding and margins (covers 768px/800px laptops) |
| `max-height: 750px` | Smaller display type; scroll cue hidden |
| `max-width: 819px` or `max-height: 700px` | Decorative terminal hidden — it restates the copy and, once stacked, pushes the hero past one screen |
| `max-width: 560px` | Compact spacing; social links become icon-only so they stay on one row |
| `max-width: 560px` + `max-height: 800px` | Tighter type for phones showing browser toolbars (~734px svh) |
| `max-width: 560px` + `max-height: 690px` | Eyebrow and focus pills hidden on the smallest screens |

Verified fitting exactly one viewport (hero height == viewport height, nothing
cut off) at 1920×1080, 1600×900, 1440×900, 1440×800, 1366×768, 1280×720,
1024×768, 820×1180, 768×1024, 390×844, 390×740, and 360×640.

**If you add anything to the hero, re-check those sizes** — the fit is tight by
design.

## Structure

```
index.html                   All markup and content
404.html                     Themed "packet lost" error page
css/styles.css               Tokens, components, sections, glow system, responsive
js/main.js                   Theme, nav, scroll systems, reveal, counters,
                             terminal, canvas, project filter
js/chatbot.js                Ali's Assistant — bilingual (EN/AR) AI assistant
assets/favicon.svg           Site icon (shield + A mark)
assets/og-image.png          1200×630 social preview (LinkedIn/X/WhatsApp)
assets/Ali-Al-Safwan-CV.pdf  CV served by the "Download CV" buttons
robots.txt                   Crawl rules
sitemap.xml                  Single-page sitemap
.nojekyll                    Tells GitHub Pages to skip Jekyll processing
```

## Updating the CV

The CV download lives in the **Contact section only** — deliberately not in the
hero, which is kept to a single pair of actions. The card links to
`assets/Ali-Al-Safwan-CV.pdf`; to publish a new version, **replace that file,
keeping the same filename** — no markup changes needed.

> Note: the PDF currently in place is the May 2026 CV, which is still written
> IT-first ("Networking & Security | IT Support & Infrastructure"). The website
> is now AI-first, so the CV is worth rewriting to match — same headline,
> SABBARAH AI as the current AI engineering role, and the AI/automation skills
> promoted above the IT ones.

## Ali's Assistant — the AI assistant widget

The launcher in the bottom-right corner opens **Ali's Assistant**, a bilingual
(English + Arabic) assistant that works with **zero setup**. It doubles as a
portfolio piece: it is a working sample of the kind of assistant Ali builds.

- **Hybrid by design**: a built-in intent engine always runs, grounded in
  everything on this page, so the assistant works on GitHub Pages with no API
  key and never shows an error to a visitor.
- **Optional AI upgrade**: paste a Gemini API key at the top of
  `js/chatbot.js` (setup notes are in the file header) and it answers freeform
  questions with the model, guided by a system instruction that restricts it to
  verified facts and tells it to refuse to invent. Any API error, rate limit, or
  session cap falls back to the built-in engine silently.
- **Two languages**: auto-detects each message's language and replies in kind
  (Gulf dialect included — وش / شنو / شلونك all work). The `auto / ع / EN`
  button in the chat bar pins a language.
- **Arabic normalization**: strips diacritics/tatweel and unifies أ/إ/آ → ا,
  ة → ه, ى → ي before matching, so spelling variants still hit.
- **Grounded knowledge**: intents covering the AI work, automation work,
  capabilities, professional title, SABBARAH AI, every project, the assistant's
  own architecture, education, certifications, languages, availability,
  location, CV download, and contact.
- **Context**: "tell me more" / "المزيد" continues the last topic; it remembers
  your name and keeps the transcript across reloads (`sessionStorage`).
- **Safe rendering**: assistant output is treated as untrusted — built as DOM
  text nodes, never HTML, so only recognised URLs and emails become links.
- **Debuggable**: in the console, `aliAssistant.respond('وش مشاريعه')` tests the
  engine directly. To teach it new answers, edit the `INTENTS` array — and keep
  `SYSTEM_INSTRUCTION` in sync so both paths tell the same story.

## Deploy

This folder is the site root. Push its contents to the `AliIbrahimX.github.io`
repository and GitHub Pages serves it at `https://aliibrahimx.github.io/`.

## Content that may need your confirmation

- **Skill levels** — each `<li class="skill-item">` has
  `data-level="learning|familiar|proficient"`; adjust any that don't match your
  self-assessment (the visible tier label text should match too).
- **SABBARAH AI start date** — the timeline says `2026 – Present`. Narrow it to
  a month if you want it precise.
- **Phone number** — your CV lists one; the website deliberately does not
  publish it. Add it to the Contact section if you want it public.

## Running locally

No build step — serve the folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Design notes

- **Zero external requests**: self-hosted Inter + JetBrains Mono (woff2,
  subset by unicode-range), inline SVG icons, canvas drawn in JS.
- **Theme**: dark by default (applied before first paint to avoid a flash),
  light mode via the header toggle; preference stored in `localStorage`,
  falling back to the OS setting. Every colour is a token, so both themes stay
  coherent.
- **Motion**: scroll reveals, the hero terminal animation, stat counters, and
  the canvas are all skipped or rendered instantly when the visitor has
  `prefers-reduced-motion: reduce` enabled.
- **Responsive**: verified with no horizontal overflow at 1440, 1024, 820, 560,
  and 390 px. The career arc flips from a horizontal rail to a vertical one, the
  featured cards stop spanning, the project filter becomes a single scrollable
  row, and project metadata stacks its labels.
- **Accessibility**: skip link, landmarks, `aria-pressed` on the theme toggle and
  filter chips, a live region announcing filter results, focus-visible outlines,
  and a full text transcript of the animated terminal in its `aria-label`.
