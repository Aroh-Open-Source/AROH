import { z } from "zod";

/**
 * Account Deletion Cascade Model
 * Defines exactly what categories are permanently purged, what is anonymized,
 * and what is retained for statutory compliance (e.g. accounting/tax/fraud prevention).
 */
export const DeletionCategoryActionSchema = z.enum([
  "permanent_purge",
  "cryptographic_anonymization",
  "retained_statutory_compliance"
]);
export type DeletionCategoryAction = z.infer<typeof DeletionCategoryActionSchema>;

export const DeletionPolicyItemSchema = z.object({
  category: z.string(),
  description: z.string(),
  action: DeletionCategoryActionSchema,
  legal_justification_or_standard: z.string(),
  grace_period_days: z.number().default(0)
});

export const AROH_DELETION_CASCADE_SCHEDULE: z.infer<typeof DeletionPolicyItemSchema>[] = [
  {
    category: "Identity & Credentials",
    description: "Email, password hash, display name, avatar, phone number, session tokens",
    action: "permanent_purge",
    legal_justification_or_standard: "Purpose fulfilled; right to erasure under DPDP Act 2023 Sec 12",
    grace_period_days: 0
  },
  {
    category: "Consent Records",
    description: "Historical consent log entries and timestamps",
    action: "cryptographic_anonymization",
    legal_justification_or_standard: "Fiduciary accountability audit trail; user identifiers hashed with irreversible salt",
    grace_period_days: 0
  },
  {
    category: "Aros Token Ledger & Transactions",
    description: "Economic ledger entries, rewards granted, and wallet balance changes",
    action: "retained_statutory_compliance",
    legal_justification_or_standard: "Financial record-keeping and fraud prevention under applicable Indian commercial/tax laws; account identity unlinked and pseudonymized",
    grace_period_days: 0
  },
  {
    category: "AI Inference & Session Prompts",
    description: "Any temporary prompts, scratch context, and model invocation histories",
    action: "permanent_purge",
    legal_justification_or_standard: "Zero persistence policy; purged upon session or account termination",
    grace_period_days: 0
  },
  {
    category: "Telemetry & Operational Logs",
    description: "IP addresses, user agent strings, API access traces",
    action: "cryptographic_anonymization",
    legal_justification_or_standard: "System security and DDoS defense; user IDs scrubbed immediately, raw IP logs rotated within 30 days",
    grace_period_days: 30
  }
];

/**
 * Data Export Schema
 * Generates an authenticated, portable JSON bundle of personal data.
 */
export const DataExportBundleSchema = z.object({
  export_id: z.string().min(5),
  user_id: z.string(),
  generated_at: z.string().datetime(),
  format_version: z.literal("1.0.0"),
  fiduciary_notice: z.string(),
  personal_profile: z.object({
    id: z.string(),
    email: z.string(),
    displayName: z.string().optional(),
    membershipLevel: z.string(),
    createdAt: z.string()
  }),
  consent_history: z.array(z.object({
    consent_id: z.string(),
    timestamp: z.string(),
    state: z.string(),
    categories: z.record(z.boolean()),
    affirmative_action: z.string()
  })),
  aros_economic_activity: z.object({
    current_balance: z.number(),
    transaction_count: z.number(),
    transactions: z.array(z.object({
      id: z.string(),
      amount: z.number(),
      type: z.string(),
      description: z.string(),
      timestamp: z.string()
    }))
  }),
  rights_and_grievances: z.object({
    submitted_rights_requests_count: z.number(),
    submitted_grievances_count: z.number()
  })
});
export type DataExportBundle = z.infer<typeof DataExportBundleSchema>;
