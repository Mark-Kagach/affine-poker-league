# AFFINE Poker Club — Leaderboard Web App

**Document type:** Product Requirements Document (PRD)
**Status:** Draft v0.7  
**Last updated:** 2026-05-05

---

## 1. Vision

A single-page web app that displays the standings of the **AFFINE Poker Club** as if it were the high-score screen of an early-1980s arcade cabinet. The page should feel less like a spreadsheet and more like *Pac-Man's* high-score table — pixel portraits, chunky type, neon-on-black, and a faint CRT glow.

> "When you open the page, it should feel like you just walked into an arcade in 1984 and the club standings are the high score table."

---

## 2. Goals & Non-goals

### Goals (MVP)

- A single, **public, view-only** leaderboard page that any club member can open in a browser.
- **80s-style boot sequence** on page load: CRT power-on, pixel logo, "AFFINE POKER CLUB" title, "PRESS START" prompt.
- **Pixel logo** for the club: three poker chips stacked on the left, with "**A**FFINE / **P**oker / **C**lub" stacked next to them — each word's first letter colored to match its chip (gold A / cyan P / magenta C), the rest in light blue.
- Each row shows: **rank**, **pixel-art portrait**, **player name**, **score** (signed, +/-), and three muted accounting columns: **bought chips**, **final chips**, **games played**.
- A clear **rank-change indicator** showing how each player moved since the last game.
- Visual identity is unmistakably **80s arcade / retro pixel** — at a glance, no explanation needed.
- **Continuous moody 8-bit soundtrack** loops in the background. Tries to autoplay on page load; falls back to starting on the first user gesture if the browser blocks autoplay. Persistent mute toggle in a corner.
- **Casino / arcade ornaments** layered onto the page: marquee bulb lights along the leaderboard frame, card suits in the four corners (♠♥♦♣), and a synthwave perspective grid floor at the bottom.
- **"VIEW LEDGER" button** at the bottom links to the full Google Sheets accounting in a new tab.
- Loads fast on desktop and mobile.
- Easy for the club admin to update standings (without touching the code, ideally).

### Non-goals (MVP)

- No login / accounts / per-user dashboards. The site is fully public, read-only.
- No live game tracking, hand history, or in-app gameplay.
- No social features (comments, reactions, chat).
- No payments, payouts, or money handling.
- No admin web UI in v1 (data updated via file edit — see §7).
- No history view of past sessions.

---

## 3. Target Users

Club size: **~20 players**, fixed. No pagination needed.


| Persona                                          | Needs                                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| **Club player**                                | Wants to see where they rank, who's ahead, and brag rights. Opens on phone after a session. |
| **Club admin** (likely the user)               | Needs to update scores quickly after each session without redeploying.                      |
| **Curious visitor** (friend, prospective member) | Should immediately "get" the vibe of the club.                                              |


---

## 4. Core User Flows

### 4.1 View the leaderboard

1. User opens `affinepoker.club`.
2. **Boot sequence plays**: CRT-style power-on flash, APC pixel logo fades in, "AFFINE POKER CLUB" + "EST. 2026" reveal in sequence, "▶ PRESS START ◀" blinks in gold.
3. User clicks (or presses any key) → 8-bit jingle plays and the boot screen fades out (~450ms). If no interaction within ~5s, the boot screen auto-dismisses silently (no jingle, since browsers block autoplay until first gesture).
4. Leaderboard renders: rank → Δ → portrait → name → **score** (accent) → bought chips, final chips, games played (muted columns).
5. #1 row is visually emphasized — gold tint, blink, "★ CHAMPION" tag.
6. User can mute/unmute sound from a corner toggle (state persists via `localStorage`).
7. "▶ VIEW LEDGER ◀" button at the bottom of the page opens the full accounting in Google Sheets in a new tab.

### 4.2 Update standings (admin)

1. Admin updates the Google Sheet ledger (`Player Name`, `Total Buy-in`, `Final Chips`, `Final Score`, `Games Played`).
2. Admin transcribes the latest values into `web/app/data/players.json` (currently a manual step — see §10.2 for the deferred Sheets→JSON sync).
3. Current ranks are snapshotted into `previousRank` so the next ▲/▼ indicators reflect the move.
4. Admin commits / pushes; site auto-deploys (Vercel).
5. New standings live within a minute.

*(A web admin UI is out of scope for v1 but called out in §11.)*

---

## 5. Visual & Interaction Design

### 5.1 Style pillars

- **Era:** Arcade cabinets ~1980–1985. Reference points: *Pac-Man*, *Donkey Kong*, *Galaga* high-score screens.
- **Palette:** Black or very dark navy background; neon accents (magenta, cyan, lime, amber). Limit to ~6 colors.
- **Type:** Pixel/bitmap font. Recommend **"Press Start 2P"** (Google Fonts, free, evocative of the era).
- **Texture:** Subtle CRT effects — scanline overlay, slight vignette/glow, optional barrel curve. Must be *subtle enough to read*.
- **Motion:** Sparing. Blinking #1 indicator. Optional: portraits shimmer on hover. Avoid anything that hurts on mobile.

### 5.2 Layout (desktop)

```
+----------------------------------------------------------+
|         ★ AFFINE  POKER  LEAGUE ★                        |
|              -- HIGH SCORES --                           |
+----------------------------------------------------------+
| RANK | Δ  | PORTRAIT | NAME      | POINTS  | GAMES       |
|------|----|----------|-----------|---------|-------------|
|  01  | ▲2 |  [pix]   | ALICE     | 12,450  |  10         |
|  02  | ▼1 |  [pix]   | BOB       | 11,200  |  10         |
|  03  | —  |  [pix]   | CARMEN    | 10,800  |  9          |
|  ...                                                      |
+----------------------------------------------------------+
|              INSERT COIN  •  EST. 2026                   |
+----------------------------------------------------------+
```

Rebuy-ins are carried as metadata on each player and surfaced as a small annotation (e.g. tooltip on hover/tap, or a tiny "RB×3" tag under the name) — *not* a primary column. Final treatment locked in during POC.

### 5.3 Layout (mobile)

- Stack columns more tightly, but keep the same row structure.
- Portraits scale down; do not crop.
- Horizontal scroll is **not** acceptable — design the row to fit a 360px viewport.
- Rebuy-in annotation is suppressible if it doesn't fit; revealed on tap.

### 5.4 Emphasis & micro-details

- **Top-3 podium tiers:**
  - **#1 (gold / champion):** amber background tint, gradient row glow, blinking rank number, "★" medal prefix, gold score.
  - **#2 (silver):** pale silver-grey tint and glow, "✦" medal prefix.
  - **#3 (bronze):** warm copper tint and glow, "✦" medal prefix.
- **Rank-change indicator:** ▲ green for climbed, ▼ red for dropped, — for unchanged. Number indicates positions moved (e.g. ▲2). Driven by `previousRank` field.
- **Empty state:** "AWAITING FIRST PLAYER" in pixel type.

### 5.5 Music (in MVP)

- **Continuous looping soundtrack** at `/jingle.wav` (~1.7 MB, 53.3s loop), generated by `web/scripts/gen-jingle.mjs`. **Mood:** neon-drive synthwave + Street Fighter — dark, cool, techno-driven; minor key with a 4-on-the-floor pulse. **Key:** A minor. **Tempo:** 108 BPM. **Voices:**
  - Square-wave **lead** — sparse intro, building melodic phrases over Am - F - C - G with a Dm bridge.
  - Triangle-wave **bass** — walking line, long sustain.
  - Triangle-wave **kick** — pitched-down sweep (90→45 Hz) with a sharp envelope, on every quarter note. Provides the techno pulse.
  - 24 bars. Loop point is cross-faded so the cycle is seamless. Sample rate 16 kHz to keep file size reasonable.
- **Autoplay strategy** (browsers block unmuted autoplay, so we work around it):
  1. On page mount, `attemptAutoplay()` tries `.play()` unmuted.
  2. If blocked, falls back to `.play()` MUTED — most browsers allow this, so the loop is already running silently in the background.
  3. On the first user gesture anywhere (`pointerdown` / `keydown` / `touchstart`), audio is unmuted and becomes audible at the current playback position with no perceptible delay.
  4. The user's `apc.sound.muted` localStorage preference always wins.
- Once started, plays continuously while the page is open.
- Persistent **mute toggle** in the bottom-right corner ("♪ MUSIC ON" / "♪ MUSIC OFF"); state remembered via `localStorage` key `apc.sound.muted`. Default is unmuted.
- A single shared `HTMLAudioElement` is managed by `app/lib/audio.ts` so autoplay, boot screen, and toggle stay in sync.
- Re-generate the music anytime by editing the note arrays in `gen-jingle.mjs` and re-running `node scripts/gen-jingle.mjs`.

### 5.8 Casino / arcade ornaments

Decorative layers for the 80s neon-gambling vibe (all `aria-hidden`, all `pointer-events: none` so they never block interaction):

- **Pixel card rows** — three horizontal strips of mini pixel-art playing cards (A♠ K♥ Q♦ J♣ 10♠ A♥ K♦ Q♣) framing the leaderboard: above the logo, below the logo, and above the footer. Each card has a corner value, a center suit, a neon border (cyan for ♠/♣, magenta for ♥/♦), and a staggered pulse animation so the row breathes. `<PixelCardRow>` component. *Replaces the v0.6 marquee bulb lights.*
- **Corner card suits** — ♠ (cyan, top-left), ♥ (magenta, top-right), ♦ (gold, bottom-left), ♣ (lime, bottom-right). Fixed-position decorations in the four viewport corners with neon drop-shadow glow. `<CornerSuits>` component.
- **Synthwave grid floor** — perspective grid at the bottom 38vh of the page. Magenta lines on a dark background, rotated 64° on the X axis, with a top-fade gradient blending into the page background. Lines slowly scroll for subtle motion. `<GridFloor>` component.

### 5.6 Boot screen

A short arcade-style boot sequence that overlays the leaderboard on page load:

- CRT power-on flash + scan-down (~600ms).
- **Pixel logo (§5.7) is the entire title treatment** — chips + APC + "AFFINE POKER CLUB" tagline are all part of the single logo SVG. No separate H1.
- "EST. 2026" subtitle appears below.
- "▶ PRESS START ◀" prompt blinks in gold.
- On click / keypress: the looping chiptune starts and the screen fades out (~450ms), revealing the leaderboard.
- Auto-dismisses silently after 6s if no interaction (no music starts in that case — browsers block autoplay without a user gesture).

### 5.7 Pixel logo

A self-contained club crest. Hybrid HTML+SVG layout, two columns:

- **LEFT column** — three poker chips stacked vertically (1px gap between each). Colors top to bottom: gold, cyan, magenta. Each chip is its own small SVG (`<ChipBox>`) with top/bottom highlight + shadow bands, four white perimeter tabs, and a center white "value" patch.
- **RIGHT column** — three text lines stacked, each aligned with its matching chip:
  - **A**FFINE — `A` in gold, `FFINE` in light blue
  - **P**oker — `P` in cyan, `oker` in light blue
  - **C**lub — `C` in magenta, `lub` in light blue
  - Rendered in Press Start 2P. The accent letter is larger than the rest of the word for emphasis. Each colored letter has a matching neon glow.
- The whole logo scales from a single `--logo-unit` CSS variable, set from the `size` prop.
- **Used in two places:**
  - Boot screen — `size=42`, big and centered.
  - Leaderboard header — `size=26`, compact, between two pixel-card rows.

---

## 6. Data Model

Minimum fields per player:


| Field          | Type              | Required | Notes                                                                              |
| -------------- | ----------------- | -------- | ---------------------------------------------------------------------------------- |
| `id`           | string            | yes      | Stable key (e.g. slug).                                                            |
| `name`         | string            | yes      | Display name. Caps recommended for vibe.                                           |
| `portrait`     | string (path/URL) | yes      | Path to pixel-art portrait. See §6.1.                                              |
| `accent`       | string (hex)      | yes      | Per-player accent color used for the portrait border.                              |
| `score`        | number            | yes      | Leaderboard sort key. From sheet's `Final Score`. Can be negative.                 |
| `boughtChips`  | number            | yes      | Total chips bought in for the season. From sheet's `Total Buy-in`. Muted column.   |
| `finalChips`   | number            | yes      | Final chip stack value. From sheet's `Final Chips`. Muted column.                  |
| `gamesPlayed`  | number            | yes      | Number of sessions played. From sheet's `Games Played`. Muted column.              |
| `previousRank` | number            | yes      | Drives ▲/▼ indicator. Snapshotted by admin before each scores update.              |
| `joinedAt`     | ISO date          | optional | "EST. 2026" tag (currently unused on the row).                                     |


**Sort order:** descending by `score`. Ties broken by `gamesPlayed` (fewer = better, rewards efficiency), then `boughtChips` (fewer = better, rewards discipline), then alphabetical name.

**Score formatting:** rendered with explicit sign (e.g. `+1,990`, `-2,685`); positive = lime, negative = red. Champion (#1) overrides with the gold treatment.

*(Tiebreaker logic is a recommendation — adjust if club has formal rules.)*

### 6.1 Pixel portraits — chosen approach

**AI-generated pixel portraits derived from each player's real photo.** Each of the ~20 players supplies a head-and-shoulders photo; we run them through a pixel-art image generator to produce consistent ~64×64 pixel portraits.

**Display size (POC):** 80×80px on desktop, 56×56px on mobile (≈1.5–2× larger than the original POC sizing). Portraits sit in a high-contrast frame with a per-player accent border. Source images can be 32×32 or 64×64; CSS `image-rendering: pixelated` keeps the upscale crunchy.

Open sub-decision (see §10): which generation tool / service to standardize on.

---

## 7. Technical Architecture (High-level)

### 7.1 Stack recommendation

- **Framework:** Next.js (React) deployed on Vercel.
  - *Why:* fast static export, free tier, painless deploys on `git push`, easy to add a real DB later.
  - *Alternative:* plain HTML + a small JS file if we want zero build step. Simpler, but harder to grow.
- **Styling:** Plain CSS (or Tailwind). Either way, the pixel-look comes mostly from the font + a scanline overlay, not a heavy framework.
- **Data source (v1):** a single committed `players.json`. Edit → push → deploy.
- **Data source (v2):** Google Sheet + scheduled fetch, *or* a tiny serverless API + Postgres (Neon/Supabase). Decision deferred.
- **Sound:** static `.wav` asset in `web/public/jingle.wav`, generated by `web/scripts/gen-jingle.mjs`. `HTMLAudioElement` for playback; `localStorage` for mute preference.
- **Configuration:** `app/lib/config.ts` exports `SHEETS_URL` for the "VIEW LEDGER" button — replace the placeholder once the live sheet exists.

### 7.2 Performance targets

- < 200KB total page weight (excluding portraits and audio).
- Lighthouse performance ≥ 90 on mobile.
- No layout shift while loading portraits — reserve dimensions.
- Audio preloaded but not autoplayed.

### 7.3 Browser support

Latest 2 versions of Chrome, Safari, Firefox, Edge. iOS Safari + Chrome Android.

### 7.4 Hosting & domain

- **Hosting:** Vercel (free tier).
- **Domain:** `affinepoker.club` (custom — to be acquired and pointed at Vercel).

---

## 8. Build Phases

Mapped to the user's process (define → PRD → POC → remaining → polish → ship):


| Phase                            | What ships                                                                                                | Done when                                                    |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **0. Define + PRD** *(this doc)* | Aligned PRD, open questions resolved.                                                                     | User signs off on §10 below.                                 |
| **1. POC**                       | Static page, 15 placeholder players, retro styling, boot screen + jingle, pixel logo, ledger button.      | The "vibe" is right at a glance.                             |
| **2. Data layer**                | Reads from `players.json`; supports 20 players; sort + tiebreakers; ▲/▼ rank-change indicators wired.     | Admin can update scores by editing one file.                 |
| **3. Polish**                    | Mobile layout, scanline + glow, champion emphasis, real player portraits in, sound polished, mute toggle. | Looks intentional on a phone, sounds intentional in the ear. |
| **4. Ship**                      | Deployed to Vercel, `affinepoker.club` wired up, shared with members.                                     | URL works, club members can open it.                       |
| **5. (Stretch)**                 | Admin UI / Google Sheet sync / per-player tap-to-expand / hand-of-the-week.                               | Decided after v1 feedback.                                   |


---

## 9. Success Metrics

- Club members open the page after each session without prompting.
- Admin can update standings end-to-end in **< 2 minutes**.
- At least one club member says some version of "this is sick."
- Page renders correctly on the admin's and a typical member's phone.

---

## 10. Decisions & Remaining Open Questions

### 10.1 Resolved (v0.7)

- **Project name:** "AFFINE Poker **Club**" (was "League"). Acronym: **APC**.
- **Domain:** `affinepoker.club` (custom).
- Club size: **~20 players**, no pagination needed (POC currently shows 15 placeholder players).
- Auth: **none** — fully public, view-only site.
- Score: **points** (sum maintained externally; admin enters totals).
- Update cadence: **1–2 times per week**.
- Stats shown: **score** as the prominent column; **bought chips**, **final chips**, **games played** as muted accounting columns.
- Score is **signed** (positive lime / negative red); champion gets gold override.
- Data fields renamed/restructured: `points` → `score`; `rebuyIns` removed; `boughtChips` and `finalChips` added — matches the Google Sheet columns one-to-one.
- Rank-change indicator: **in MVP**, driven by `previousRank`.
- **Boot screen** in MVP — CRT power-on, logo reveal, "PRESS START" prompt.
- **Pixel logo** in MVP — three stacked chips left, big "APC" right, "AFFINE POKER CLUB" tagline below, all in one SVG.
- **Continuous 8-bit music** in MVP — generated WAV at `web/public/jingle.wav` (7.27s loop, polyphonic chiptune over a I-V-vi-IV progression); starts on PRESS START and loops the whole time the page is open.
- **Music control** in MVP — single shared audio element managed by `app/lib/audio.ts`; persistent mute toggle ("♪ MUSIC ON / OFF") in bottom-right; default unmuted but blocked by browser until first gesture.
- **Boot screen title is now part of the logo SVG** — no separate H1. The full "AFFINE POKER CLUB" wordmark lives in the logo's tagline.
- **Pixel logo redesigned** as a single composition: 3 stacked chips on the left, big "APC" on the right, "AFFINE POKER CLUB" tagline below.
- **"VIEW LEDGER" button** wired to the live Google Sheet: <https://docs.google.com/spreadsheets/d/1LfVzI--nbpzwVqDZLQmMFmBHsJeaOm1ePfrSDAlIjZU/edit>.
- **POC dataset is now the real ledger** — 14 players seeded from the live sheet (Nick, Pranav, Jonas, Okko, Adriana, Mark, Samuel, Sean, Phil, Mikhail, Michele, Kabir, London, Xylix).

**Added in v0.6:**

- **Music rewritten** — 43.6s loop in A minor at 88 BPM, square-wave lead + triangle-wave bass, dark/moody (not upbeat). Replaces the previous 7s upbeat chiptune.
- **Music autoplays on page load**, with a one-time gesture-listener fallback for browsers that block autoplay. (See §5.5.)
- **Logo chip spacing tightened** — 1px gap between chips (was 2px).
- **Logo gains a `withTagline` prop** so it can render in compact form (chips + APC only) for the leaderboard header.
- **Silver (#2) and bronze (#3) tier styling** — same row-glow treatment as gold #1, with ✦ medal prefixes.
- **Casino ornaments added** — marquee bulb lights, ♠♥♦♣ corner suits, synthwave grid floor.
- **Leaderboard header redesigned** — "★ AFFINE POKER CLUB ★" / "— HIGH SCORES —" text replaced with the compact pixel logo, sandwiched between two marquee-bulb strips.

**Added in v0.7:**

- **Music rewritten again** — neon-drive synthwave + Street Fighter vibe: A minor at 108 BPM, 53.3s loop. Three voices (square lead, triangle bass, pitched-sweep kick) for a 4-on-the-floor techno pulse. Replaces the v0.6 brooding ambient track.
- **Muted-autoplay trick** — audio.ts now plays muted on page load if unmuted autoplay is blocked, then unmutes on the first user gesture. Music becomes audible the instant the user touches the page (no "click to enable" delay).
- **Logo rebuilt** — chips + APC abbreviation replaced with a hybrid HTML+SVG layout: chips on the left, **A**FFINE / **P**oker / **C**lub stacked text on the right, each first letter colored to match its chip. Press Start 2P typography means mixed case actually works.
- **Logo chip spacing tightened** to 1px gap (kept from v0.6).
- **Pixel card rows** replace marquee bulb lights — same three positions on the leaderboard, now showing 8 mini pixel-art cards (A♠ K♥ Q♦ J♣ 10♠ A♥ K♦ Q♣) with a staggered pulse animation.
- **Avatar size** bumped to 80×80px desktop / 56×56px mobile (≈1.5–2× the original POC).
- **"VIEW LEDGER" button** in MVP — link at the bottom; URL configured in `app/lib/config.ts` (placeholder until the live sheet exists).
- History view of past sessions: **out of scope** for v1.
- Portraits: **AI-generated from real player photos** (POC currently uses colored-block placeholders).
- **Tech stack:** Next.js + Vercel confirmed (POC built on Next.js 16, app router, plain CSS modules).

### 10.2 Still open

1. **Live Google Sheets URL** — placeholder is in `app/lib/config.ts`. Drop in the real URL when the sheet is set up.
2. **Which pixel-art generation tool** for portraits? Options worth comparing:
  - PixelLab.ai (purpose-built, paid).
  - Stable Diffusion + a pixel-art LoRA (free, requires setup).
  - GPT-image / Midjourney with a pixel-style prompt + post-processing (fast, less control).
  - Manual touch-up pass over any of the above for consistency.
3. **Photo collection** — how do we collect a head-and-shoulders photo from each of the ~20 players? (Group text, shared folder, etc.)
4. **Score-update workflow** — JSON file edit + git push (committed), or do we want a Google Sheet → JSON sync in v1 to make it easier? (Note: Sheets is currently used for the ledger view, not as a data source.)
5. **Tiebreaker rules** — confirm: points DESC → games played ASC → rebuy points ASC → name ASC. Adjust if club has formal rules.
6. **Real player names** — placeholder POC uses arcade handles (ACE, SLICK, PIXEL…). Swap to real names + chosen tags before launch.

---

## 11. Out of scope (for v1, but candidates for later)

- Web-based admin UI for editing scores.
- Per-player profile pages (with stats over time, head-to-head, etc.).
- Authentication / private club mode.
- Live game tracking or session-in-progress display.
- Achievements / badges.
- Hand-of-the-week or photo gallery.
- Public API.
- History view of past sessions / season archive.

---

## 12. Risks


| Risk                                              | Mitigation                                                                          |
| ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Pixel aesthetic looks "cheap" instead of "retro." | Lock the palette, font, and scanline early in POC; reference real arcade screens.   |
| Portraits inconsistent across 20 players.         | Standardize on one generation tool + identical prompt/style; manual touch-up pass.  |
| Collecting 20 player photos drags the timeline.   | Start collection in parallel with POC build; use placeholder portraits until ready. |
| Admin friction (editing JSON) makes scores stale. | Keep file format dead-simple; document with example. Plan v2 admin UI / Sheet sync. |
| Mobile layout breaks the vibe.                    | Design mobile-first in POC, not as an afterthought.                                 |
| Sound feels gimmicky or annoying.                 | Mute by default; keep SFX short and sparse; tune in polish phase.                   |


