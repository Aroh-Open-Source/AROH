# AROH Platform Cookie & Tracking Preference Policy

> **Document ID:** `AROH-PRIVACY-PREF-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Technical Pre-Consent Enforcement Standard

Under AROH's privacy architecture:
1. **Default State is 'Unknown':** Prior to the user interacting with the Cookie Banner, the system evaluates `consent_state === "unknown"`.
2. **Strict Pre-Consent Blocking:** In the `unknown` state, **all non-essential scripts, trackers, analytics, and marketing cookies are strictly blocked**. No third-party network requests are dispatched for non-essential purposes.
3. **Deterministic Evaluation:** The platform utility `isCategoryAllowed(category, state, preferences)` in `@aroh/asdk` returns `false` for any optional category until explicit affirmative action occurs.

---

## 2. Banner Interaction Rules

The AROH Cookie Banner (`apps/web/app/components/cookie-banner.tsx`) enforces the following invariants:
1. **Three Visible Choices:**
   - **Accept All:** Sets `consent_state: "accepted"`, enabling functional, analytics, and marketing categories.
   - **Reject Optional:** Sets `consent_state: "rejected"`, keeping only essential cookies active.
   - **Manage Preferences:** Opens the accessible preference drawer allowing category-by-category granularity.
2. **Visual Parity:** "Accept All" and "Reject Optional" are rendered with identical visual weight and contrast. There are no dimmed, hidden, or deceptive links.
3. **Banner Dismissal:** Closing or navigating without making a choice maintains the `unknown` (blocked) state. Mere scrolling or clicking unrelated links does NOT constitute affirmative consent.

---

## 3. Preference Persistence & Expiration

1. **Storage:** User preferences are persisted in the first-party cookie `aroh_consent_preferences_v1`.
2. **Duration:** Cookie preferences expire after **180 days (6 months)**. Upon expiration, the user will be presented with an updated notice to reaffirm preferences.
3. **Re-Prompting on Policy Updates:** If AROH publishes a material change to data processing purposes (e.g. introducing a new external analytics processor), the version identifier increments and triggers a fresh consent prompt.
