# Day 3 — Data, Security & Architecture

Central question: **where should state live, and who is allowed to change it?**

## Step map

| Tag | What changes | Who |
|---|---|---|
| `d3-start` | Seeded `users` table with 3 demo accounts, `npm run role`, auth packages (`arctic`, `iron-session`, `zod`) | Prepared |
| `d3-01` | Encrypted session (`pg_session`), DAL `getCurrentUser`, GitHub OAuth (steps 1–5), login/logout/dev login, `UserMenu` in `<Suspense>` | Instructor |
| `d3-02` (= `d3-p1-start`) | Permission table (`PERMISSIONS`, `can`), `requirePermission`, `authInterrupts` (401/403), DAL read checks, order status action protection + zod | Instructor |
| `d3-03` (= `d3-p1-solution`) | **P1 solution:** `products:manage` (admin only): DAL checks, product detail page, `updatePricesAction`, `AdminNavigation` sidebar UI hint | Students |
| `d3-04` (= `d3-p2-solution`) | **P2 solution:** `profileSchema`, `requireUser`, `updateProfileAction`, `ProfileForm` with `useActionState`, error per field | Students |
| `d3-05` (= `d3-p3-solution`) | **P3 solution:** fixed IDOR (owner id from session) and mass assignment (only validated schema output saved, `updateUser` removed) | Students |
| `d3-end` | Day 3 finished state: recap, debugging challenges, mental model | Together |

## Final Mental Model

1. **Who?** `getSession()` → `findUserById()` → `User | null` (not signed in → 401).
2. **May they?** `can(user, permission)` (no → 403). Checks live in DAL for reads, line 1 of Server Actions for writes.
3. **Well-formed?** `schema.safeParse(input)` → error per field.
4. **Business rules?** State machine transitions, price increments, etc.
5. **Save:** Owner ID strictly from authenticated session; save only validated schema output.
