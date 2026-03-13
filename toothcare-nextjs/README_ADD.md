# TOOTHCARE — Patient Portal & Doctor Dashboard (Additive Module)

This document covers the new Supabase-powered features added on top of the existing Next.js site.

---

## 1. New Files Added

```
lib/
  supabaseClient.js          ← client-side Supabase helper (NEXT_PUBLIC_ keys only)
  supabase-server.js         ← server-side Supabase helper (SERVICE_ROLE_KEY)

components/
  FeaturePopup.jsx           ← informational first-visit popup banner

pages/
  login.jsx                  ← patient Google OAuth + doctor link
  doctor-login.jsx           ← doctor email + password form
  patient-dashboard.jsx      ← protected patient portal + booking flow
  admin-dashboard.jsx        ← protected doctor dashboard + availability editor
  api/
    doctor-check.js          ← POST: verify auth.uid → doctors table
    book.js                  ← POST: create appointment with validation
    create-doctor.js         ← POST: (admin) insert new doctor row

sql/
  create_tables.sql          ← full DDL for all 5 tables + RLS stubs
```

No existing pages were modified. To show the popup on the homepage, add this to `src/app/page.tsx`:

```tsx
import FeaturePopup from "@/components/FeaturePopup";
// inside the JSX:
<FeaturePopup />
```

---

## 2. Required Environment Variables

Add these to your `.env.local` (local dev) and Vercel project settings (production):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server only, never expose** |
| `NEXT_PUBLIC_APP_URL` | Full app URL e.g. `https://dentistwebfordemo.vercel.app` |
| `ADMIN_CREATE_KEY` | Secret string to protect `/api/create-doctor` |

---

## 3. Supabase Setup

### 3.1 Database Tables

Run `sql/create_tables.sql` in your **Supabase Dashboard → SQL → New query**.

This creates: `doctors`, `patients`, `services`, `availability`, `appointments`.

### 3.2 Google OAuth

1. In Supabase Dashboard → **Authentication → Providers → Google**: enable Google.
2. Add your Google OAuth Client ID and Secret.
3. Set the **Redirect URL** in Google Console to:
   ```
   https://<your-supabase-project>.supabase.co/auth/v1/callback
   ```
4. In Next.js, the `signInWithGoogle()` helper redirects to `/auth/callback`.
   You need a simple callback page — create `pages/auth/callback.jsx`:

```jsx
// pages/auth/callback.jsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

const PENDING_KEY = "toothcare_pending_booking";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const pending = sessionStorage.getItem(PENDING_KEY);
        router.replace(pending ? "/patient-dashboard" : "/patient-dashboard");
      } else {
        router.replace("/login");
      }
    });
  }, [router]);
  return <p style={{ padding: "3rem", textAlign: "center" }}>Completing sign-in…</p>;
}
```

---

## 4. Creating a Doctor Account (Step-by-Step)

1. **Create the auth user** in Supabase Dashboard → Authentication → Users → "Invite user"  
   (or have the doctor sign up via email confirmation).

2. **Copy the new user's UUID** from the Users table.

3. **Insert the doctor row** using the admin API:
   ```bash
   curl -X POST https://your-site.com/api/create-doctor \
     -H "x-admin-key: YOUR_ADMIN_CREATE_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "auth_uid": "<copied-uuid>",
       "name": "Dr. Sarah Chen",
       "email": "sarah@toothcare.com",
       "specialization": "Prosthodontics"
     }'
   ```

4. The doctor can now log in at `/doctor-login` using their email + password and be routed to `/admin-dashboard`.

---

## 5. Install

```bash
cd toothcare-nextjs
npm install     # installs @supabase/supabase-js (already done)
npm run dev     # start local dev server at http://localhost:3000
```

---

## 6. Testing Checklist

### Popup
- [ ] Open site in an incognito window → popup appears at bottom
- [ ] Click "Not Now" → popup disappears; `toothcare_popup_dismissed=true` in localStorage
- [ ] Reopen same window → popup no longer shows
- [ ] Click "Login / Access Portal" → navigates to `/login` (no forced auth for normal browsing)

### Patient Booking (Anonymous → Authenticated)
- [ ] From any page, click a "Book Appointment" CTA without logging in
- [ ] Auth modal appears; selection is stored in `sessionStorage` as `toothcare_pending_booking`
- [ ] Click "Sign in with Google" → Google OAuth flow starts
- [ ] After auth, redirected to `/patient-dashboard` with booking form pre-filled
- [ ] Complete booking → row appears in Supabase `appointments` table

### Patient Dashboard (Protected)
- [ ] Navigate directly to `/patient-dashboard` without logging in → friendly gate displayed
- [ ] Log in → dashboard shows upcoming appointments
- [ ] Book a new appointment through the 4-step UI → success banner appears

### Doctor Login
- [ ] Navigate to `/doctor-login`
- [ ] Enter valid email + password for a user in the `doctors` table → redirect to `/admin-dashboard`
- [ ] Enter credentials for a non-doctor user → error shown, user signed out

### Doctor Dashboard
- [ ] Today's appointments are listed with patient name, service, and time
- [ ] Upcoming (30 days) appointments render correctly
- [ ] Add a new availability slot → saved to `availability` table
- [ ] Toggle `is_available` off → slot no longer bookable by patients

### Booking Validation (via API)
- [ ] Try to book outside doctor availability → `409 Doctor is not available at the requested time slot`
- [ ] Try to book a conflicting slot → `409 This time slot is already booked`

---

## 7. Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` is used **only** in `pages/api/*.js` — never imported client-side.
- All API routes accept `POST` only (CSRF mitigation).
- Add RLS policies from `sql/create_tables.sql` before going to production.
- The `x-admin-key` on `/api/create-doctor` should be a strong random string stored in Vercel env vars.
