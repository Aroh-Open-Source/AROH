import { z } from "zod";

/**
 * Data Principal statutory rights under the Digital Personal Data Protection Act, 2023.
 */
export const DataPrincipalRightTypeSchema = z.enum([
  "access_summary",    // Right to access summary of personal data & processing activities
  "access_identities", // Right to know identities of all other Data Fiduciaries & Data Processors shared with
  "correction",        // Right to correction of inaccurate or misleading personal data
  "completion",        // Right to completion of incomplete personal data
  "updating",          // Right to update out-of-date personal data
  "erasure",           // Right to erasure of personal data no longer necessary for specified purpose
  "nomination",        // Right to nominate an individual to exercise rights in event of death/incapacity
  "withdrawal",        // Right to withdraw consent
  "grievance"          // Right of grievance redressal
]);
export type DataPrincipalRightType = z.infer<typeof DataPrincipalRightTypeSchema>;

export const RequestStatusSchema = z.enum([
  "submitted",
  "identity_verified",
  "assigned",
  "in_review",
  "additional_info_requested",
  "fulfilled",
  "rejected",
  "cancelled"
]);
export type RequestStatus = z.infer<typeof RequestStatusSchema>;

export const DataPrincipalRequestSchema = z.object({
  request_id: z.string().min(5),
  right_type: DataPrincipalRightTypeSchema,
  data_principal_identifier: z.string().min(3), // Email, phone, or authenticated account ID
  is_authenticated: z.boolean(),
  details: z.string().min(5).max(3000),
  nominee_details: z.object({
    name: z.string().min(1),
    relationship: z.string().min(1),
    contact_email: z.string().email().optional(),
    contact_phone: z.string().optional()
  }).optional(),
  submitted_at: z.string().datetime(),
  status: RequestStatusSchema,
  status_updated_at: z.string().datetime(),
  assigned_officer: z.string().default("Unassigned (Pending Triage)"),
  resolution_notes: z.string().optional(),
  statutory_deadline: z.string().datetime(), // Maximum statutory deadline (e.g. 30-90 days depending on effective rules)
  audit_trail: z.array(z.object({
    timestamp: z.string().datetime(),
    action: z.string(),
    actor: z.string(),
    comment: z.string().optional()
  }))
});
export type DataPrincipalRequest = z.infer<typeof DataPrincipalRequestSchema>;

/**
 * Grievance Redressal Ticket Schema
 * Section 13, DPDP Act, 2023 & DPDP Rules, 2025.
 */
export const GrievanceTicketSchema = z.object({
  ticket_id: z.string().min(5),
  complainant_identifier: z.string().min(3),
  complainant_type: z.enum(["data_principal", "authorized_representative", "parent_guardian", "nominee"]),
  category: z.enum([
    "consent_violation",
    "unauthorized_processing",
    "data_breach_concern",
    "rights_denial",
    "delayed_response",
    "inaccurate_data",
    "other_statutory_grievance"
  ]),
  subject: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  submitted_at: z.string().datetime(),
  status: RequestStatusSchema,
  statutory_deadline_days: z.number().default(90), // Standard maximum under DPDP Rules
  statutory_deadline_date: z.string().datetime(),
  assigned_grievance_officer: z.string().default("[GRIEVANCE_OFFICER_DESIGNATED]"),
  resolution_summary: z.string().optional(),
  escalated_to_board: z.boolean().default(false), // Data Protection Board of India escalation tracking
  audit_trail: z.array(z.object({
    timestamp: z.string().datetime(),
    action: z.string(),
    actor: z.string(),
    note: z.string().optional()
  }))
});
export type GrievanceTicket = z.infer<typeof GrievanceTicketSchema>;

/**
 * Calculates statutory deadline date given days from submission.
 */
export function calculateStatutoryDeadline(submittedDate: Date, days = 90): string {
  const deadline = new Date(submittedDate.getTime() + days * 24 * 60 * 60 * 1000);
  return deadline.toISOString();
}
