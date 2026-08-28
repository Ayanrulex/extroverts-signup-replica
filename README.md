# Extroverts — Signup Wizard Frontend Assessment

A polished, front-end-only React/Vite implementation inspired by the provided assessment brief and the public Extroverts app reference.

## Included
- Landing page with dark/purple visual language
- Terms & Conditions page
- Four-step progressive signup wizard
- Email + password validation
- OTP verification simulation (`123456`)
- Profile validation and age gating
- Pronouns shown only after an adult age is entered
- State → city dependent select
- Interest chips with minimum selection validation
- Loading state on submission
- Inline-friendly toast errors
- Back navigation and browser session persistence
- Success state
- Responsive mobile/tablet/desktop layout

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Notes

This is intentionally front-end only. No real OTP, authentication, database, or API is used. The form is stored in `sessionStorage` so refreshes during the demo don't lose progress.

Reference app: Extroverts — Party, Hangout, Vibe (`com.pro.nubpack`).
