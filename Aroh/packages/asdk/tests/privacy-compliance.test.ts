import { describe, it, expect } from "vitest";
import {
  ConsentStateSchema,
  CookieCategorySchema,
  isCategoryAllowed,
  createDefaultConsentRecord,
  serializeConsentCookie,
  parseConsentCookie,
  ConsentRecordSchema,
  DataPrincipalRightTypeSchema,
  DataPrincipalRequestSchema,
  GrievanceTicketSchema,
  calculateStatutoryDeadline,
  AROH_DELETION_CASCADE_SCHEDULE,
  DataExportBundleSchema
} from "../src/privacy/index";

describe("AROH DPDP Privacy & Consent Engine", () => {
  it("enforces pre-consent blocking by default when state is 'unknown'", () => {
    const state = "unknown";
    expect(isCategoryAllowed("essential", state)).toBe(true);
    expect(isCategoryAllowed("functional", state)).toBe(false);
    expect(isCategoryAllowed("analytics", state)).toBe(false);
    expect(isCategoryAllowed("marketing", state)).toBe(false);
  });

  it("permits all categories when state is 'accepted'", () => {
    const state = "accepted";
    expect(isCategoryAllowed("essential", state)).toBe(true);
    expect(isCategoryAllowed("functional", state)).toBe(true);
    expect(isCategoryAllowed("analytics", state)).toBe(true);
    expect(isCategoryAllowed("marketing", state)).toBe(true);
  });

  it("blocks all optional categories when state is 'rejected'", () => {
    const state = "rejected";
    expect(isCategoryAllowed("essential", state)).toBe(true);
    expect(isCategoryAllowed("functional", state)).toBe(false);
    expect(isCategoryAllowed("analytics", state)).toBe(false);
    expect(isCategoryAllowed("marketing", state)).toBe(false);
  });

  it("evaluates category-by-category permissions when state is 'partial'", () => {
    const state = "partial";
    const prefs = {
      essential: true as const,
      functional: true,
      analytics: false,
      marketing: true
    };
    expect(isCategoryAllowed("essential", state, prefs)).toBe(true);
    expect(isCategoryAllowed("functional", state, prefs)).toBe(true);
    expect(isCategoryAllowed("analytics", state, prefs)).toBe(false);
    expect(isCategoryAllowed("marketing", state, prefs)).toBe(true);
  });

  it("immediately blocks all optional processing when state is 'withdrawn'", () => {
    const state = "withdrawn";
    const prefs = {
      essential: true as const,
      functional: true,
      analytics: true,
      marketing: true
    };
    // Even if preferences previously were true, withdrawn state takes absolute priority
    expect(isCategoryAllowed("essential", state, prefs)).toBe(true);
    expect(isCategoryAllowed("functional", state, prefs)).toBe(false);
    expect(isCategoryAllowed("analytics", state, prefs)).toBe(false);
    expect(isCategoryAllowed("marketing", state, prefs)).toBe(false);
  });

  it("validates default consent record against ConsentRecordSchema", () => {
    const defaultRecord = createDefaultConsentRecord("1.0.0", "1.0.0");
    const result = ConsentRecordSchema.safeParse(defaultRecord);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.consent_state).toBe("unknown");
      expect(result.data.preferences.essential).toBe(true);
      expect(result.data.preferences.functional).toBe(false);
    }
  });

  it("accurately serializes and deserializes consent cookies", () => {
    const record = {
      consent_id: "123e4567-e89b-12d3-a456-426614174000",
      data_principal_id: null,
      policy_version: "1.0.0",
      notice_version: "1.0.0",
      consent_state: "partial" as const,
      preferences: {
        essential: true as const,
        functional: true,
        analytics: false,
        marketing: false
      },
      timestamp: "2026-09-11T12:00:00.000Z",
      source: "preference_center" as const,
      affirmative_action: "save_custom"
    };

    const cookieStr = serializeConsentCookie(record);
    const parsed = parseConsentCookie(cookieStr);

    expect(parsed).not.toBeNull();
    expect(parsed?.state).toBe("partial");
    expect(parsed?.preferences.functional).toBe(true);
    expect(parsed?.preferences.analytics).toBe(false);
    expect(parsed?.version).toBe("1.0.0");
  });

  it("validates Data Principal Rights schema and statutory deadline calculation", () => {
    const baseDate = new Date("2026-09-11T12:00:00Z");
    const deadline = calculateStatutoryDeadline(baseDate, 30);
    expect(new Date(deadline).getTime()).toBeGreaterThan(baseDate.getTime());

    const requestPayload = {
      request_id: "123e4567-e89b-12d3-a456-426614174001",
      right_type: "erasure" as const,
      data_principal_identifier: "principal@example.com",
      is_authenticated: true,
      details: "Please delete my account data permanently.",
      submitted_at: baseDate.toISOString(),
      status: "submitted" as const,
      status_updated_at: baseDate.toISOString(),
      assigned_officer: "Unassigned (Pending Triage)",
      statutory_deadline: deadline,
      audit_trail: [
        {
          timestamp: baseDate.toISOString(),
          action: "request_received",
          actor: "system"
        }
      ]
    };

    const parsed = DataPrincipalRequestSchema.safeParse(requestPayload);
    expect(parsed.success).toBe(true);
  });

  it("enforces 90-day statutory cap on Grievance Ticket schema", () => {
    const now = new Date();
    const deadline = calculateStatutoryDeadline(now, 90);

    const ticket = {
      ticket_id: "123e4567-e89b-12d3-a456-426614174002",
      complainant_identifier: "complainant@example.com",
      complainant_type: "data_principal" as const,
      category: "consent_violation" as const,
      subject: "Consent not respected in marketing",
      description: "Received marketing alerts after clicking withdraw all consent.",
      submitted_at: now.toISOString(),
      status: "submitted" as const,
      statutory_deadline_days: 90,
      statutory_deadline_date: deadline,
      assigned_grievance_officer: "[GRIEVANCE_OFFICER_NAME]",
      escalated_to_board: false,
      audit_trail: []
    };

    const parsed = GrievanceTicketSchema.safeParse(ticket);
    expect(parsed.success).toBe(true);
  });

  it("verifies account deletion cascade schedule completeness", () => {
    expect(AROH_DELETION_CASCADE_SCHEDULE.length).toBeGreaterThanOrEqual(4);
    const actions = AROH_DELETION_CASCADE_SCHEDULE.map((item) => item.action);
    expect(actions).toContain("permanent_purge");
    expect(actions).toContain("cryptographic_anonymization");
    expect(actions).toContain("retained_statutory_compliance");
  });

  it("validates structured data export bundle schema", () => {
    const bundle = {
      export_id: "123e4567-e89b-12d3-a456-426614174003",
      user_id: "usr_98765",
      generated_at: new Date().toISOString(),
      format_version: "1.0.0" as const,
      fiduciary_notice: "Generated under Section 11 DPDP Act 2023.",
      personal_profile: {
        id: "usr_98765",
        email: "dev@example.com",
        displayName: "Developer",
        membershipLevel: "enterprise",
        createdAt: "2026-08-01T00:00:00Z"
      },
      consent_history: [],
      aros_economic_activity: {
        current_balance: 1000,
        transaction_count: 2,
        transactions: [
          {
            id: "t1",
            amount: 500,
            type: "reward",
            description: "Initial Grant",
            timestamp: "2026-08-01T00:01:00Z"
          }
        ]
      },
      rights_and_grievances: {
        submitted_rights_requests_count: 0,
        submitted_grievances_count: 0
      }
    };

    const parsed = DataExportBundleSchema.safeParse(bundle);
    expect(parsed.success).toBe(true);
  });
});
