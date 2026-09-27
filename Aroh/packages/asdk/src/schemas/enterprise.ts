import { z } from "zod";

/**
 * Enterprise Organization Roles
 */
export const OrganizationRoleSchema = z.enum([
  "owner",
  "admin",
  "billing_manager",
  "member"
]);
export type OrganizationRole = z.infer<typeof OrganizationRoleSchema>;

/**
 * Enterprise Organization Plan Tier
 */
export const EnterprisePlanTierSchema = z.enum([
  "starter",
  "growth",
  "enterprise"
]);
export type EnterprisePlanTier = z.infer<typeof EnterprisePlanTierSchema>;

/**
 * Enterprise Organization Schema
 */
export const OrganizationSchema = z.object({
  id: z.string().min(1, "Organization ID is required"),
  name: z.string().min(1, "Organization name is required"),
  slug: z.string().min(1, "Organization slug is required"),
  domain: z.string().optional(),
  planTier: EnterprisePlanTierSchema.default("starter"),
  ownerId: z.string().min(1, "Owner user ID is required"),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1)
});
export type Organization = z.infer<typeof OrganizationSchema>;

/**
 * Enterprise Organization Member Schema
 */
export const OrganizationMemberSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  userId: z.string().min(1),
  email: z.string().email(),
  role: OrganizationRoleSchema.default("member"),
  spendingLimitAros: z.number().nonnegative().default(1000),
  spentThisMonthAros: z.number().nonnegative().default(0),
  status: z.enum(["active", "invited", "suspended"]).default("active"),
  joinedAt: z.string().min(1)
});
export type OrganizationMember = z.infer<typeof OrganizationMemberSchema>;

/**
 * Enterprise Shared Team Wallet Schema
 */
export const TeamWalletSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  balance: z.number().nonnegative().default(0),
  currency: z.literal("AROS").default("AROS"),
  dailyCapAros: z.number().positive().default(10000),
  monthlyCapAros: z.number().positive().default(100000),
  spentTodayAros: z.number().nonnegative().default(0),
  spentThisMonthAros: z.number().nonnegative().default(0),
  updatedAt: z.string().min(1)
});
export type TeamWallet = z.infer<typeof TeamWalletSchema>;

/**
 * Enterprise Team Wallet Transaction Schema
 */
export const TeamWalletTransactionSchema = z.object({
  id: z.string().min(1),
  teamWalletId: z.string().min(1),
  orgId: z.string().min(1),
  memberUserId: z.string().min(1),
  memberEmail: z.string().email(),
  amount: z.number(), // positive for credits, negative for debits
  action: z.enum(["credit", "debit"]),
  description: z.string().min(1),
  receiptHash: z.string().min(1),
  timestamp: z.string().min(1)
});
export type TeamWalletTransaction = z.infer<typeof TeamWalletTransactionSchema>;

/**
 * SAML 2.0 Identity Provider (IdP) Configuration Schema
 */
export const SamlConfigSchema = z.object({
  id: z.string().min(1),
  orgId: z.string().min(1),
  idpEntityId: z.string().min(1, "IdP Entity ID is required"),
  idpSsoUrl: z.string().url("Valid IdP SSO URL is required"),
  certificate: z.string().min(1, "X.509 Certificate is required"),
  enabled: z.boolean().default(true),
  createdAt: z.string().min(1)
});
export type SamlConfig = z.infer<typeof SamlConfigSchema>;

/**
 * SCIM 2.0 User Provisioning Schema
 */
export const ScimUserSchema = z.object({
  schemas: z.array(z.string()).default(["urn:ietf:params:scim:schemas:core:2.0:User"]),
  id: z.string().min(1),
  userName: z.string().min(1),
  name: z.object({
    formatted: z.string().optional(),
    familyName: z.string().optional(),
    givenName: z.string().optional()
  }).optional(),
  emails: z.array(
    z.object({
      value: z.string().email(),
      primary: z.boolean().optional()
    })
  ),
  active: z.boolean().default(true),
  roles: z.array(OrganizationRoleSchema).optional()
});
export type ScimUser = z.infer<typeof ScimUserSchema>;
