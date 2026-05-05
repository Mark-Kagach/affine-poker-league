# AFFINE Poker Club — Leaderboard

Retro-arcade leaderboard for the AFFINE Poker Club. 80s neon noir, pixel
portraits, looping chiptune. Built with Next.js, deployed on Vercel.

Live: <https://affinepoker.club>

## Repo layout

```
.
├── PRD.md         # Product requirements document (source of truth)
├── README.md      # this file
└── web/           # Next.js app
    ├── app/       # routes + components + data
    ├── public/    # static assets (jingle.wav, portraits/, etc.)
    └── scripts/   # gen-jingle.mjs (synthesizes the soundtrack)
```

## Local dev

```bash
cd web
npm install
npm run dev
```

Open <http://localhost:3000>.

## Updating standings

1. Edit `web/app/data/players.json` with the latest values from the [Google
   Sheets ledger](https://docs.google.com/spreadsheets/d/1LfVzI--nbpzwVqDZLQmMFmBHsJeaOm1ePfrSDAlIjZU/edit).
2. Snapshot the current ranks into `previousRank` so the ▲/▼ indicators
   reflect the move.
3. Commit and push — Vercel auto-deploys.

## Regenerating the soundtrack

```bash
cd web
node scripts/gen-jingle.mjs
```

Edit the chord progression / note arrays in
[web/scripts/gen-jingle.mjs](web/scripts/gen-jingle.mjs) first.
