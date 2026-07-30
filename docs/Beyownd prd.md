# Beyownd — Product Requirements Document (App V1)

## 1. Overview

**Product:** Beyownd mobile app — free career-readiness app for tier-3/4/5 Indian college students, starting with Surat.

**Core idea:** Students get weekly "Reality Tasks" (simulated real-world work, not passive video content), curated notes, and progress tracking — for free. This builds trust and a user base. Later, students who want a certificate for their college and deeper mentorship join a paid cohort (~2 months, ₹2000, real work required, certificate issued at the end).

**Why this app exists:** Tier-3/4/5 students want to do real work and grow, but don't have a roadmap or idea of how to start. Beyownd gives them that structure.

**Target timeline:** Publish V1 to the Play Store within 25 days, building ~4 hours/day.

---

## 2. Goals

- Ship a real, working app fast — feedback from real users matters more than a perfect feature set.
- Make the free app feel like a genuine tool for growth, not a stripped-down teaser for the paid cohort.
- Keep V1 scope tight: auth, weekly Reality Task, notes, and a cohort signup screen. Nothing else.

## 3. Non-Goals (V1)

- No mentor-matching or group logic inside the app (handled manually via WhatsApp for now).
- No community feed/chat inside the app.
- No social login, forgot-password flow, or email verification.
- No analytics dashboards — a simple counter is enough.

## 4. Target User

A student in a tier-3/4/5 Indian city, ambitious but without a clear roadmap, likely first heard about Beyownd through a friend or a community channel (WhatsApp/Instagram/college group).

---

## 5. Phase-Wise Plan (25 Days, ~4 hrs/day)

| Phase | Days | Focus | Output |
|---|---|---|---|
| **Phase 1 — Foundation** | 1–3 | Project setup, design system (colors/type/spacing), navigation skeleton | Empty app that runs, with theme + routing in place |
| **Phase 2 — Onboarding + Auth** | 4–7 | Onboarding slides, Signup, Login (UI only, local state) | Full auth UI flow, no backend yet |
| **Phase 3 — Home + Reality Task** | 8–12 | Home dashboard, Readiness Meter, Task list, Task detail, submission form (mock data) | Core loop feels real, even without backend |
| **Phase 4 — Notes** | 13–15 | Notes list + note detail screen (static/mock content) | Students can browse curated notes |
| **Phase 5 — Cohort screen** | 16–18 | Cohort signup screen, RevenueCat web-purchase hookup | Monetization path wired up |
| **Phase 6 — Backend wiring** | 19–23 | Express + Neon Postgres: auth, task submission, notes fetch, cohort signup — connect all screens to real APIs | App works end-to-end with real data |
| **Phase 7 — Polish + Publish** | 24–25 | Bug fixes, app icon, screenshots, Play Store listing, submission | App live on Play Store |

**Honest note:** this is tighter than the earlier 13-day-frontend + 15-day-backend split (28 days) — 25 days means backend wiring (Phase 6) has to move faster, likely by keeping API scope minimal (4 endpoints total: auth, tasks, notes, cohort-signup) rather than building it out fully.

---

## 6. Phase 2 Detail — Onboarding + Auth Flow

### Flow

```
App Launch
    │
    ▼
[Onboarding Slide 1] → [Slide 2] → [Slide 3]
    │ (Skip available on 1 & 2)         │
    │                                    ▼
    │                          [Get Started]
    │                                    │
    ▼                                    ▼
                              [Signup Screen] ←──┐
                                    │             │
                                    ▼             │
                              [Home Screen]       │
                                                   │
[Login Screen] ───(already have account)──────────┘
```

### Screen-by-screen wireframes

**Onboarding Slide 1 — What Beyownd is**
```
┌─────────────────────┐
│                      │
│     [illustration]   │
│                      │
│   Yeh sirf ek app    │
│   nahi, ek roadmap   │
│   hai.               │
│                      │
│   Real tasks, real   │
│   skills — har       │
│   hafte.             │
│                      │
│   ● ○ ○   [Skip]     │
│         [Next →]     │
└─────────────────────┘
```

**Onboarding Slide 2 — Notes**
```
┌─────────────────────┐
│     [illustration]   │
│                      │
│   Notes jo kaam       │
│   aayein, hype nahi   │
│                      │
│   Curated material,   │
│   copy-paste videos   │
│   nahi.                │
│                      │
│   ○ ● ○   [Skip]     │
│         [Next →]     │
└─────────────────────┘
```

**Onboarding Slide 3 — Cohort/Certificate**
```
┌─────────────────────┐
│     [illustration]   │
│                      │
│   Best kaam karne     │
│   walon ko internship │
│                      │
│   Cohort join karo,   │
│   certificate + real  │
│   opportunity paao    │
│                      │
│   ○ ○ ●               │
│    [Get Started →]    │
└─────────────────────┘
```

**Signup**
```
┌─────────────────────┐
│  ← Back              │
│                      │
│  Create your account │
│                      │
│  [ Full name       ] │
│  [ Email/Phone     ] │
│  [ Password        ] │
│  [ College (optional)]│
│                      │
│  [   Create account  ]│
│                      │
│  Already have account?│
│      Log in →         │
└─────────────────────┘
```

**Login**
```
┌─────────────────────┐
│  ← Back              │
│                      │
│  Welcome back         │
│                      │
│  [ Email/Phone     ] │
│  [ Password        ] │
│                      │
│  [      Log in      ] │
│                      │
│  New here? Sign up →  │
└─────────────────────┘
```

---

## 7. Later Phases — Wireframes TBD

Wireframes for Phase 3 (Home + Reality Task), Phase 4 (Notes), and Phase 5 (Cohort screen) will be added to this document as we reach each phase — same process: PRD detail → wireframe → UI direction → build.

---

## 8. Success Criteria (Informal, V1)

- App is live on the Play Store within 25 days.
- A student can sign up, see a Reality Task, submit it, read a note, and see the cohort signup screen — without confusion.
- First real user feedback collected within days of publishing.