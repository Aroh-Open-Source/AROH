# AROH Platform Cookie & Local Storage Policy

> **Document ID:** `AROH-PRIVACY-COOKIE-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. What Are Cookies and Local Storage?

Cookies and web storage technologies (such as HTML5 `localStorage` and `sessionStorage`) are small data packets placed on your device by your browser when you visit web applications. They allow web platforms to remember your login state, enforce security controls, and store user preferences across navigation events.

---

## 2. Our Cookie Governance Philosophy

In strict alignment with the DPDP Act 2023:
1. **Zero Unconsented Tracking:** We do not load or execute third-party advertising cookies or optional tracking scripts prior to obtaining your affirmative consent.
2. **Honest Classification:** We never classify tracking or analytics cookies as "strictly necessary".
3. **No Dark Patterns:** Rejecting optional cookies is as easy as accepting them—both options are presented with identical visual weight.

---

## 3. Cookie Categories & Inventory

### 3.1 Strictly Necessary (Essential) Cookies
These cookies are technically required for the platform to function securely. Disabling them would prevent access to authenticated services:

| Cookie / Key Name | Provider | Purpose | Duration | Storage Type |
|---|---|---|---|---|
| `aroh_consent_preferences_v1` | AROH Platform | Stores your category consent choices to prevent re-prompting on every page load | 180 days | Cookie & LocalStorage |
| `aroh_token` | AROH Platform | Cryptographic session token identifying authenticated user session | Session / 24h | Cookie / LocalStorage |
| `aroh_logout_event` | AROH Platform | Triggers cross-tab session invalidation upon user logout | Transient | LocalStorage Event |

### 3.2 Functional (Preference) Storage (Optional)
These items store your user interface customizations to enhance your experience:

| Key Name | Provider | Purpose | Duration | Storage Type |
|---|---|---|---|---|
| `aroh_intro_played` | AROH Platform | Prevents repeating the landing page intro video on subsequent visits | Session | SessionStorage |
| `aroh_theme_preference` | AROH Platform | Remembers light/dark mode preference | 365 days | LocalStorage |

### 3.3 Analytics & Performance (Optional)
Used strictly to monitor route response latency, error spikes, and server load:

| Key Name | Provider | Purpose | Duration | Storage Type |
|---|---|---|---|---|
| `aroh_telemetry_client_id` | AROH Telemetry | Pseudonymized client ID for aggregated performance diagnostics | 90 days | Cookie / LocalStorage |

### 3.4 Marketing & Referrals (Optional)
Used only if navigating to partner product spokes through external promotional campaigns:

| Key Name | Provider | Purpose | Duration | Storage Type |
|---|---|---|---|---|
| `aroh_marketing_campaign_ref` | AROH Showcase | Attribution token for partner showcase referrals | 30 days | Cookie |

---

## 4. How to Manage and Delete Cookies

You can change your preferences at any time:
1. Visit the **[Cookie Preference Center](/cookies)** or click "Cookies" in the footer.
2. Toggle individual categories or click **"Reject Optional Cookies"**.
3. You can also configure your web browser (Chrome, Firefox, Safari, Edge) to block or delete cookies via your browser settings.
