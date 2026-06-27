## Goal
Jab user ek complaint submit kar de, us device par dobara `/complaint` form na khule. Uski jagah uski latest complaint ka **status screen** (Pending / In Progress / Resolved + timeline) dikhe. Resolve hone ke baad hi naya form unlock ho. Koi existing feature nahi todenge.

## Scope (sirf yeh batch)
- Sirf frontend change in `src/pages/ComplaintPage.tsx`.
- LocalStorage par device-level lock.
- Baaki sab (UI overhaul, AI, maps, gamification, officer panel) — agle batches mein, taaki kuch break na ho.

## Behaviour
1. Successful submit hone par browser ke `localStorage` mein save karein:
   - `active_complaint_tracking_id`
   - `active_complaint_submitted_at`
2. Next time `/complaint` open hone par:
   - Agar saved tracking ID hai → Supabase se us complaint ka status fetch karein.
   - Agar status `Resolved` / `Closed` hai → lock clear karein, normal complaint form dikhayein.
   - Warna form ki jagah **Status Screen** render karein.
3. Status screen mein:
   - Tracking ID + copy button
   - Current status badge (Pending / In Progress / Resolved) — colored
   - Simple timeline: Submitted → In Progress → Resolved (current step highlight)
   - Category, location, submitted date
   - AI Solution (agar pehle se localStorage mein save hai turant dikhe)
   - Buttons: **Refresh status**, **Track full details** (existing `/track` page par jaye prefilled), **Cancel/Clear** (chhota link, confirmation ke saath — taaki user fasa na rahe agar zarurat ho)
4. Real-time auto-refresh: page khulne par fetch + har 30s par silently re-fetch.

## Non-goals (is batch mein nahi)
- Phone/user based lock
- UI redesign, dark/light overhaul
- AI, map, officer panel, gamification

## Technical notes
- File touched: `src/pages/ComplaintPage.tsx` (existing submit handler ke andar localStorage set; component top par lock-check + status view).
- DB: koi migration nahi. `complaints` table ka existing `status` column hi use hoga. RLS already public-by-tracking_id allow karta hai, to anon fetch chalega.
- Edge cases:
  - Tracking ID DB mein na mile → lock clear, form show.
  - Network fail → cached status + retry button.
  - User manually localStorage clear kare → form wapas khulega (acceptable).

## Validation
- Submit → reload `/complaint` → status screen dikhe.
- Admin se status `Resolved` karke reload → form wapas khule.
- Track page, Admin, baaki routes untouched aur kaam karein.
