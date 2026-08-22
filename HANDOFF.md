# HANDOFF — ourchemistry.ai (PART 1 of 2)

> Give this file + HANDOFF-2.md to the next AI. Everything is here.

## CONTEXT

Project: `C:\Ourchemistry` — **ourchemistry.ai**, launch site for a voice-first,
photo-free dating/matrimony app. Next.js **14.2.35** (App Router), React 18,
Zustand, Framer Motion, Tailwind 3.4. 10 locales: en ur ar fr tr id ms de bn es
(ur + ar are RTL). No-scroll constellation UI with 7 stations.

**The site builds and runs.** `npm run build` passes (15 pages). Git repo
initialized, 2 commits: `f64283f` (main app, 58 files) and `313f2ef`
(netlify.toml + serverless-safe waitlist API). Not pushed to GitHub yet.
DO NOT redo foundational work — read HANDOFF-2.md "Already finished" first.

## THE CURRENT TASK (user's latest request — IN PROGRESS)

Six features requested:
1. **Brand "ourchemistry.ai"** — visible top-center of the page
2. **"The Science" section full redesign** — currently 3 feature cards,
   expand to **5 cards**, make it visually stunning
3. **Living heartline (ECG)** — animated pulse line that looks DIFFERENT on
   every page view / reload (randomized waveform) + natural heartbeat motion
4. **Tutorial on every page** — contextual help explaining what each page is
   and what to do there
5. **Google login** — complete account login UI (Google + email design)
6. **Interactivity audit** — written recommendations (see section below)

## WHAT IS ALREADY DONE FOR THIS TASK

Translation source files (keys: features.voiceDna, features.voiceDnaSub,
features.element, features.elementSub, tutorial.*, login.*):

- scripts/ext-en.json      (en)          DONE
- scripts/ext-ur.json      (ur)          DONE
- scripts/ext-ar.json      (ar)          DONE
- scripts/ext-fr-tr.json   (fr + tr)     DONE
- scripts/ext-id-ms.json   (id + ms)     DONE
- scripts/ext-de-es.json   (de + es)     DONE
- scripts/ext-bn.json      (bn)          **NOT CREATED YET — STEP 1**

## STEP-BY-STEP REMAINING WORK

### STEP 1 — Create `scripts/ext-bn.json` (Bengali translations, ready-to-use)

```json
{
  "bn": {
    "features": {
      "voiceDna": "ভয়েস ডিএনই ম্যাচিং",
      "voiceDnaSub": "তিনটি কথিত শব্দ একটি অনন্য শাব্দিক স্বাক্ষরে পরিণত হয়। আমরা মুখ নয়, অনুরণন মিলাই।",
      "element": "মৌল সামঞ্জস্য",
      "elementSub": "আপনার মৌল আবিষ্কার করুন এবং দেখুন কোন বন্ধন সবচেয়ে গভীর — পরিমাপযোগ্য কেমিস্ট্রি।"
    },
    "tutorial": {
      "open": "কীভাবে কাজ করে",
      "close": "বুঝেছি",
      "on": "আপনি আছেন",
      "hero": { "title": "ourchemistry-তে স্বাগতম", "body": "সোয়াইপ নেই, ছবি নেই। তীর চিহ্ন বা নিচের ডক দিয়ে পৃথিবীগুলোতে ঘুরুন। প্রস্তুত হলে ওয়েটলিস্টে আপনার স্পার্ক সংরক্ষণ করুন।" },
      "features": { "title": "বিজ্ঞান", "body": "পাঁচটি স্তম্ভ প্রতিটি ম্যাচ চালায়। প্রতিটি কার্ড পড়ুন, তারপর বন্ড ল্যাবে বিশ্বব্যাপী চার্জ অনুভব করুন।" },
      "bond": { "title": "বন্ড ল্যাব", "body": "দুটি পরমাণু একসাথে টানুন। প্রতিটি সাইনআপ চার্জ বাড়ায়। ১০০ শতাংশে প্রথম স্পার্ক জ্বলে ওঠে।" },
      "voice": { "title": "ভয়েস ডিএনএ", "body": "যেকোনো তিনটি শব্দ বলুন। আমরা আপনার কণ্ঠকে একটি অনন্য প্রতীকে রূপান্তরিত করি, যা আপনার ডিভাইসেই প্রক্রিয়া হয়।" },
      "quiz": { "title": "মৌল কুইজ", "body": "তিনটি প্রশ্নের উত্তর দিয়ে আপনার মৌল আবিষ্কার করুন, তারপর শেয়ার করুন।" },
      "waitlist": { "title": "ওয়েটলিস্ট", "body": "আপনার জায়গা নিশ্চিত করতে ইমেইল দিন। মৌলিক কেমিস্ট্রি চিরতরে বিনামূল্যে।" },
      "faq": { "title": "ভালো প্রশ্ন", "body": "যেকোনো প্রশ্ন খুলতে ট্যাপ করুন। লঞ্চ, মূল্য এবং গোপনীয়তা সব এখানে।" }
    },
    "login": {
      "title": "আবার স্বাগতম",
      "sub": "আপনার স্পার্ক নিরাপদ রাখতে সাইন ইন করুন",
      "google": "Google দিয়ে চালিয়ে যান",
      "email": "ইমেইল ঠিকানা",
      "password": "পাসওয়ার্ড",
      "submit": "সাইন ইন",
      "or": "অথবা",
      "signup": "অ্যাকাউন্ট তৈরি করুন",
      "noAccount": "ourchemistry-তে নতুন?",
      "privacy": "কণ্ঠ আগে, ছবি নেই। আমরা কখনো আপনার তথ্য বিক্রি করি না।"
    }
  }
}
```

### STEP 2 — Create `scripts/merge-ext.js` and run it

Deep-merge every `scripts/ext-*.json` into `dictionaries/<locale>.json`.
Rules: never delete existing keys; `features` gets 4 NEW keys added next to
the existing 6; `tutorial` and `login` are brand-new top-level sections.
Pattern to follow: existing `scripts/fix-and-extend-dicts.js`.
Deep-merge helper: recursive object merge; then write with
`JSON.stringify(dict, null, 2) + '\n'`.
Run: `node scripts/merge-ext.js` — expect "merged 10 locales".

### STEP 3 — `components/BrandMark.jsx` (NEW file, ~40 lines)

'use client'. Renders fixed top-center: `position:fixed; top:12px;
left:50%; transform:translateX(-50%); z-index:45`. Content:
"ourchemistry" in display font + ".ai" in accent gradient, mono ".ai".
Below it optionally TAGLINE "The Science of Us" tiny letterspaced.
`pointer-events:none`. Import BRAND, TAGLINE from `../lib/config`.
On small screens (< 640px) keep it but shrink; the Countdown component
(top-left) already hides partially on tiny screens — if they collide,
reduce Countdown to seconds-only on mobile (it has mobile logic already).

### STEP 4 — Redesign The Science (5 cards) in `components/ConstellationStage.jsx`

The `Features` function is INLINE inside ConstellationStage.jsx (not a
separate file). Currently 3 items (EyeOff/Link2/HeartHandshake icons from
lucide-react). Change to 5 items:
1. anti      — EyeOff          — #5eead4 (existing)
2. voiceDna   — AudioLines      — #ffd7a1 (NEW)
3. trial      — Link2           — #a78bfa (existing)
4. matrimony  — HeartHandshake  — #ff8fb2 (existing)
5. element    — FlaskConical    — #67e8f9 (NEW)
Import AudioLines + FlaskConical from lucide-react.
Redesign requirements (make it attractive):
- grid-cols-1 sm:grid-cols-2 md:grid-cols-3, but 5 cards → make the last row
  span nicely (or use flex-wrap centered).
- Each card: glass panel, numbered (01–05 mono, colored), icon in a glowing
  ring, gradient top border in the card color, hover lift + glow,
  staggered entrance with framer-motion (delay = i * 0.08).
- Section header: dict.nav.science + ecg-style divider (see STEP 5).
