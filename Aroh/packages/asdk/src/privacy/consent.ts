import { z } from "zod";

/**
 * Consent state taxonomy aligned with DPDP Act 2023 & DPDP Rules 2025.
 * Consent must be free, specific, informed, unconditional, and unambiguous with affirmative action.
 */
export const ConsentStateSchema = z.enum([
  "unknown",    // Default pre-interaction state; non-essential processing MUST be blocked
  "accepted",   // User affirmatively accepted all categories
  "rejected",   // User affirmatively rejected all optional categories
  "partial",    // User affirmatively consented to a subset of optional categories
  "withdrawn"   // User previously consented and subsequently exercised right to withdraw
]);
export type ConsentState = z.infer<typeof ConsentStateSchema>;

/**
 * Cookie and processing categories.
 * Only 'essential' is permitted prior to affirmative consent.
 */
export const CookieCategorySchema = z.enum([
  "essential",   // Security, authentication, session tokens, core CSRF protection
  "functional",  // User UI preferences, theme, font size, language
  "analytics",   // Telemetry, performance counters, error rates
  "marketing"    // Promotional alerts, partner referrals
]);
export type CookieCategory = z.infer<typeof CookieCategorySchema>;

export const CategoryConsentPreferencesSchema = z.object({
  essential: z.literal(true), // Always true and non-negotiable for system operation
  functional: z.boolean().default(false),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false)
});
export type CategoryConsentPreferences = z.infer<typeof CategoryConsentPreferencesSchema>;

/**
 * Tamper-resistant, auditable consent record.
 * Must be stored without accumulating unnecessary PII.
 */
export const ConsentRecordSchema = z.object({
  consent_id: z.string().min(5),
  data_principal_id: z.string().nullable().optional(), // Anonymous identifier or user ID if authenticated
  policy_version: z.string(),
  notice_version: z.string(),
  consent_state: ConsentStateSchema,
  preferences: CategoryConsentPreferencesSchema,
  timestamp: z.string().datetime(),
  source: z.enum(["web_banner", "preference_center", "account_settings", "api", "system_default"]),
  affirmative_action: z.string(), // Description of affirmative action taken, e.g. "click_accept_all", "custom_toggle_save"
  withdrawn_at: z.string().datetime().nullable().optional(),
  withdrawal_method: z.string().nullable().optional()
});
export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

/**
 * Evaluates whether a specific processing category is currently permitted.
 */
export function isCategoryAllowed(
  category: CookieCategory,
  state: ConsentState,
  preferences?: Partial<CategoryConsentPreferences>
): boolean {
  // Essential is always permitted (strictly necessary for core service delivery)
  if (category === "essential") {
    return true;
  }

  // Pre-consent default (unknown), explicit rejection, or complete withdrawal blocks all optional processing
  if (state === "unknown" || state === "rejected" || state === "withdrawn") {
    return false;
  }

  // Accepted all allows functional, analytics, marketing
  if (state === "accepted") {
    return true;
  }

  // Partial consent requires explicit category opt-in
  if (state === "partial" && preferences) {
    return Boolean(preferences[category]);
  }

  return false;
}

/**
 * Generates an initial default consent record in 'unknown' state.
 */
export function createDefaultConsentRecord(policyVersion = "1.0.0", noticeVersion = "1.0.0"): ConsentRecord {
  return {
    consent_id: "urn:uuid:00000000-0000-4000-8000-000000000000",
    data_principal_id: null,
    policy_version: policyVersion,
    notice_version: noticeVersion,
    consent_state: "unknown",
    preferences: {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    },
    timestamp: new Date().toISOString(),
    source: "system_default",
    affirmative_action: "none_pre_interaction"
  };
}

/**
 * Cookie serialisation helper for client/edge consumption.
 */
export const CONSENT_COOKIE_NAME = "aroh_consent_preferences_v1";

export function serializeConsentCookie(record: ConsentRecord): string {
  return JSON.stringify({
    s: record.consent_state,
    p: record.preferences,
    v: record.policy_version,
    t: record.timestamp
  });
}

export function parseConsentCookie(raw: string | undefined): {
  state: ConsentState;
  preferences: CategoryConsentPreferences;
  version: string;
  timestamp: string;
} | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    const parsedState = ConsentStateSchema.safeParse(data.s);
    const parsedPrefs = CategoryConsentPreferencesSchema.safeParse(data.p);
    if (parsedState.success && parsedPrefs.success) {
      return {
        state: parsedState.data,
        preferences: parsedPrefs.data,
        version: typeof data.v === "string" ? data.v : "1.0.0",
        timestamp: typeof data.t === "string" ? data.t : new Date().toISOString()
      };
    }
    return null;
  } catch {
    return null;
  }
}
