# ourchemistry.ai — The Science of Us ⚗

**AI-Powered Dating & Matrimony — voice-first, photo-free, values-deep.**
A launch experience in 10 languages with a no-scroll constellation interface.

> Mind before face. Hear before you see. No photos — just chemistry.

---

## ✨ What this is

The pre-launch site for **ourchemistry.ai**: a dating & matrimony app that matches
people on **Voice DNA**, values and resonance instead of photos.

The site is a single-viewport, no-scroll experience with seven interactive stations:

| Station | What it does |
|---|---|
| **Hero** | Rotating lexicon, aurora glass, live launch countdown |
| **The Science** | Anti-Profile Discovery · 7-Day Bond Trial · Double-Blind Matrimony |
| **Bond Lab** | Drag two atoms together — global charge meter with haptics at 100% |
| **Voice DNA** | Real microphone capture with live frequency analysis → generative sigil |
| **Element Quiz** | "Which element are you?" (Ne / O / Au / C) with share |
| **Waitlist** | Email capture with referral codes and element numbers |
| **FAQ** | Launch, pricing, countries, bond trial |

Plus **Catalyst**, the floating AI concierge (rule-based brain), and an ambient
constellation canvas with particle bonds.

## 🌍 Internationalization

10 locales: `en · ur · ar · fr · tr · id · ms · de · bn · es`
RTL support for **Urdu** and **Arabic** (`dir="rtl"` + `lang` synced at runtime).

Routes: `/en`, `/ur`, … `/` redirects via middleware using `Accept-Language`.

## 🧱 Stack

- **Next.js 14** (App Router, SSG for all locales) + **React 18**
- **Tailwind CSS** + custom design system (`app/globals.css`)
- **Zustand** (view/locale state) · **Framer Motion** (scene transitions)
- **next/font**: Unbounded (display) · Space Grotesk (body) · JetBrains Mono (data)
- API: `POST /api/waitlist` — validation, normalization, dedupe, atomic JSON
  persistence, per-IP rate limiting (5 req/min)

## 🚀 Getting started

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build (all 10 locales prerendered)
npm start
```

## 📁 Structure

```
app/
  layout.jsx              # root layout: fonts, metadata, JSON-LD
  globals.css             # design system
  page.jsx → /[locale]    # middleware locale redirect
  [locale]/page.jsx       # the experience (SSG × 10)
  api/waitlist/route.js   # hardened waitlist endpoint
  robots.js · sitemap.js  # SEO metadata routes
  not-found.jsx · error.jsx · loading.jsx
components/               # ConstellationStage, BondMeter, VoiceDNACapture,
                          # ChemistryQuiz, WaitlistForm, CatalystOrb,
                          # Countdown, LocaleSwitcher, GlobalPulseMap, SigilArt…
dictionaries/*.json       # full translations × 10
lib/                      # config, i18n, store
scripts/                  # asset generation + dictionary maintenance
public/                   # favicon, icons, og.png, manifest
```

## 🔒 Security & privacy posture

- Security headers: HSTS, `nosniff`, `X-Frame-Options: DENY`, Referrer-Policy,
  Permissions-Policy (mic allowed only for the voice capture flow)
- API: body-size cap, email normalization, dedupe, rate limiting, atomic writes
- Voice capture is demo-only: audio is analyzed in-browser via WebAudio and
  never uploaded
- Waitlist data (`data/waitlist.json`) is gitignored — never commit user emails

## ♿ Accessibility & performance

- `prefers-reduced-motion` honored globally (all animations degrade)
- Keyboard navigation: **← / →** switch stations; focus-visible rings
- Semantic landmarks, `aria-*` states, RTL-aware layout
- First Load JS ≈ **134 kB**, all locales prerendered static

## 🧰 Maintenance scripts

```bash
node scripts/gen-icons.ps1          # regenerate brand PNGs/OG (PowerShell)
node scripts/scan-wrapped.js        # detect quote-wrapped corrupted files
node scripts/unwrap-files.js        # repair them
node scripts/fix-and-extend-dicts.js# validate + merge dictionary keys
```

## 🧠 Sovereign Architectural Engines

### 1. In-Browser Audio DSP & 64-D Voice DNA (`lib/dsp/pitchDetector.js`)
- **YIN Pitch Tracking Algorithm**: Extracts true physical fundamental frequency ($F_0$) in Hz from raw time-domain mic buffers.
- **Spectral Centroid & Timbre**: Computes frequency-weighted centroid reflecting vocal warmth and resonance.
- **Acoustic Hash & Sigil Determinism**: Generates a reproducible 64-dimensional acoustic vector and 32-bit seed powering the biometric visual sigil without server uploads.

### 2. Zero-Asset Procedural Web Audio Soundscape (`lib/audio/soundscape.js`)
- 100% procedural Web Audio synthesis with 0 asset downloads.
- Sub-bass cardiac heartbeats (75 Hz -> 36 Hz exponential glide), 528 Hz celestial resonance chimes, and crystalline fusion shimmer sparks.

### 3. AI Guardrails & Anti-PII Defense (`lib/security/guardrails.js`)
- System prompt exfiltration / injection prevention.
- Automatic redaction of domestic and international phone numbers, email addresses, and social handles during early connection stages.

### 4. 7-Day Bond Protocol State Machine (`lib/bond/bondStateMachine.js`)
- Sequential unlock curriculum (Voice Capsules -> Values Architecture -> Resonance Texting -> Portrait Unblur).
- Reciprocal gating and double-blind simultaneous resolution with zero-rejection architecture.

### 5. Sovereign Cryptographic Vanish Engine (`lib/security/cryptoVanish.js`)
- Ephemeral data zeroization in under 60 seconds.
- Verifiable SHA-256 Merkle tree calculation generating immutable flight receipts (`RCPT-VANISH-...`).

### 6. Database & Vector Match Engine (`lib/db/`)
- Drizzle ORM schema for PostgreSQL + `pgvector` (64-D acoustic embeddings).
- Cosine similarity matching engine for Voice DNA resonance.

---

## 📡 API Endpoints

- `POST /api/catalyst`: Intelligent AI Concierge endpoint with multi-language awareness and guardrails.
- `GET /api/bond` & `POST /api/bond`: 7-Day Protocol progression and double-blind resolution.
- `POST /api/vanish`: One-tap cryptographic erasure with Merkle flight records.
- `GET /api/waitlist` & `POST /api/waitlist`: Queue position, element assignment (*Aqua, Ignis, Terra, Ventus*), and referral boosts (+500 spots).

---

## 🧪 Verification & Testing

```bash
# Run full verification suite (Engines + APIs)
npm test

# Run individual suites
npm run test:engines
npm run test:apis
```

## 🗓 Launch

First spark: **February 14, 2027**.

---

*Built for ourchemistry — the science of us.*
