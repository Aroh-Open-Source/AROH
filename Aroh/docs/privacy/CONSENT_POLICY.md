# AROH Platform Consent Notice & Policy

> **Document ID:** `AROH-PRIVACY-CONSENT-V1.0`
> **Version:** `1.0.0`
> **Effective Date:** `2026-09-11`
> **Last Updated:** `2026-09-11`
> **Status:** `ACTIVE_NOW`
> **Statutory Baseline:** Section 6, DPDP Act 2023 & Rule 3, DPDP Rules 2025
> **Legal Review Status:** `LEGAL_REVIEW_REQUIRED`

---

## 1. Statutory Standards of Lawful Consent

Pursuant to **Section 6(1) of the Digital Personal Data Protection Act, 2023**, consent given by a Data Principal must satisfy five cumulative criteria:
1. **Free:** Given voluntarily, without coercion, deceptive design patterns (dark patterns), or negative consequences for refusing optional processing.
2. **Specific:** Tied to concrete, itemized processing purposes rather than vague, omnibus authorizations.
3. **Informed:** Accompanied by plain-language notice specifying the personal data collected and the purpose of processing.
4. **Unconditional:** Service access cannot be made conditional on consenting to processing that is not strictly necessary for that service.
5. **Unambiguous:** Expressed through a clear, affirmative action; silence, pre-ticked checkboxes, or inactivity cannot constitute lawful consent.

---

## 2. Separation of Necessary vs. Optional Processing

AROH strictly categorizes all platform data operations into distinct layers:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ESSENTIAL (Strictly Necessary)                           │
│    - Security, authentication, CSRF tokens, session integrity│
│    - Non-optional; essential to deliver core platform service│
├─────────────────────────────────────────────────────────────┤
│ 2. FUNCTIONAL (Optional)                                    │
│    - UI theme preferences, video playback flags, layout state│
│    - Requires affirmative opt-in; blocked by default         │
├─────────────────────────────────────────────────────────────┤
│ 3. ANALYTICS (Optional)                                     │
│    - Anonymous route timing, error counters, feature telemetry│
│    - Requires affirmative opt-in; blocked by default         │
├─────────────────────────────────────────────────────────────┤
│ 4. MARKETING (Optional)                                     │
│    - Partner showcase referrals and ecosystem alerts        │
│    - Requires affirmative opt-in; blocked by default         │
└─────────────────────────────────────────────────────────────┘
```

**Zero Pre-Ticked Boxes:** In the AROH Cookie & Privacy Preference Center, all optional categories (Functional, Analytics, Marketing) are **unchecked by default**. Users must affirmatively toggle categories on.

---

## 3. Auditable Consent Records

Every consent action (acceptance, rejection, partial preference save, or withdrawal) is transformed into an auditable cryptographic record conforming to `ConsentRecordSchema` in `@aroh/asdk`:

```json
{
  "consent_id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
  "data_principal_id": "user_auth_id_or_null",
  "policy_version": "1.0.0",
  "notice_version": "1.0.0",
  "consent_state": "accepted",
  "preferences": {
    "essential": true,
    "functional": true,
    "analytics": false,
    "marketing": false
  },
  "timestamp": "2026-09-11T12:00:00.000Z",
  "source": "preference_center",
  "affirmative_action": "custom_toggle_save"
}
```

Records are stored in local client state (`aroh_consent_preferences_v1`) and synchronized to server audit logs without collecting superfluous PII.

---

## 4. Right to Withdraw Consent (Section 6(4))

Under **Section 6(4) of the DPDP Act**, Data Principals have the statutory right to withdraw their consent at any time, with the explicit requirement that **withdrawal must be as easy to exercise as giving consent**.

### 4.1 How to Withdraw
1. Navigate directly to **[Consent Settings](/privacy/consent)** or click "Consent Settings" in the global footer.
2. Click the visible, prominent button: **"Withdraw All Optional Consent"**.
3. Alternatively, deselect individual categories and save.

### 4.2 Technical Enforcement upon Withdrawal
When you withdraw consent:
- Non-essential client cookies and local storage tokens are **instantly purged**.
- Any optional telemetry or analytics trackers are disabled immediately in memory.
- Server-side optional processing pipelines cease processing your data within statutory timeframes.
- Withdrawal does not affect the lawfulness of processing conducted prior to withdrawal.
- Core essential services (account authentication and ledger balance viewing) remain available.
