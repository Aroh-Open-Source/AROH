import { z } from "zod";
import { MembershipTierSchema } from "../schemas/product";
import { MergeStrategySchema } from "../sync/schema";

/**
 * Seven-level provenance and verification taxonomy for all external or derived facts.
 * Ensures zero fabrication and explicit tracking of source confidence.
 */
export const ProvenanceVerificationStateSchema = z.enum([
  "VERIFIED",
  "IMPLEMENTED-REPORTED",
  "DOCUMENTED",
  "INFERRED",
  "PROPOSED",
  "UNKNOWN",
  "SUPERSEDED"
]);
export type ProvenanceVerificationState = z.infer<typeof ProvenanceVerificationStateSchema>;

/**
 * Adapter ownership boundary designating the governance relationship between AROH and the spoke.
 */
export const OwnershipBoundarySchema = z.enum([
  "external_spoke",    // Independently hosted / maintained external product
  "submodule_spoke",   // Independent Git repository attached as read-only monorepo submodule
  "platform_internal"  // Native core service maintained directly within AROH platform hub
]);
export type OwnershipBoundary = z.infer<typeof OwnershipBoundarySchema>;

/**
 * Physical inspection boundary defining access rules. Upholds absolute Products/ inviolability.
 */
export const InspectionBoundarySchema = z.enum([
  "read_only_tree",       // Local tree inspection permitted for metadata only; zero writes
  "subproject_gitlink",   // Parent Gitlink reference tracking; product repo is self-governed
  "external_remote",      // Inspected strictly via remote HTTP/Git API; zero local filesystem presence
  "inviolable_boundary"   // Hard platform barrier preventing any mutation by automated platform tooling
]);
export type InspectionBoundary = z.infer<typeof InspectionBoundarySchema>;

/**
 * Spoke runtime health and readiness status.
 */
export const SpokeHealthStatusSchema = z.enum([
  "healthy",       // Responding normally within acceptable latency
  "degraded",      // Operational but experiencing elevated latency or partial capability loss
  "unreachable",   // Network or server probe timeout / connection failure
  "offline",       // Spoke is intentionally disabled or in scheduled maintenance
  "maintenance",   // Explicit maintenance window announced
  "unknown"        // Health has not yet been probed or state cannot be determined
]);
export type SpokeHealthStatus = z.infer<typeof SpokeHealthStatusSchema>;

/**
 * Health check telemetry record for a spoke.
 */
export const SpokeHealthCheckSchema = z.object({
  status: SpokeHealthStatusSchema,
  lastCheckedAt: z.string().min(1, "lastCheckedAt ISO timestamp is required"),
  latencyMs: z.number().nonnegative().optional(),
  endpoint: z.string().optional(),
  message: z.string().optional()
});
export type SpokeHealthCheck = z.infer<typeof SpokeHealthCheckSchema>;

/**
 * Launch target specification distinguishing verified public deployments from internal routes.
 */
export const LaunchUrlTargetSchema = z.object({
  url: z.string().min(1, "Launch URL is required"),
  kind: z.enum(["external_web", "internal_route", "deep_link", "sandbox"]),
  verificationState: ProvenanceVerificationStateSchema,
  isAlive: z.boolean().optional()
});
export type LaunchUrlTarget = z.infer<typeof LaunchUrlTargetSchema>;

/**
 * Capability exposure contract defining what domain features the spoke provides to the ecosystem.
 */
export const SpokeCapabilityExposureSchema = z.object({
  id: z.string().min(1, "Capability ID is required"),
  title: z.string().min(1, "Capability title is required"),
  description: z.string().min(1, "Capability description is required"),
  status: z.enum(["available", "preview", "deprecated", "unavailable"]),
  requiredTier: MembershipTierSchema.default("basic"),
  verificationState: ProvenanceVerificationStateSchema.default("VERIFIED")
});
export type SpokeCapabilityExposure = z.infer<typeof SpokeCapabilityExposureSchema>;

/**
 * Permissions and authorization boundary restricting what ecosystem operations a spoke may perform.
 */
export const SpokePermissionsBoundarySchema = z.object({
  allowedArosOperations: z.array(
    z.enum(["read_balance", "request_debit", "request_credit", "webhook_subscribe"])
  ).default(["read_balance"]),
  requiresUserConsent: z.boolean().default(true),
  rateLimitRpm: z.number().int().positive().default(60),
  roleRequirement: z.enum(["user", "operator", "admin"]).default("user")
});
export type SpokePermissionsBoundary = z.infer<typeof SpokePermissionsBoundarySchema>;

/**
 * Synchronization and manifest reconciliation interface binding.
 * Guarantees that targetConsumerPath NEVER resolves inside Products/.
 */
export const SpokeSyncBindingSchema = z.object({
  manifestPath: z.string().min(1, "Manifest path is required"),
  mergeStrategy: MergeStrategySchema.default("downstream_wins"),
  protectedPaths: z.array(z.string()).default([]),
  targetConsumerPath: z.string().min(1, "Target consumer path is required").refine(
    (p) => !p.startsWith("Products/") && !p.startsWith("Products\\") && !p.startsWith("/Products"),
    { message: "targetConsumerPath must never resolve inside the protected Products/ directory" }
  )
});
export type SpokeSyncBinding = z.infer<typeof SpokeSyncBindingSchema>;

/**
 * Spoke version and ecosystem compatibility requirements.
 */
export const SpokeCompatibilitySchema = z.object({
  contractVersion: z.string().default("v1.0.0"),
  minimumAsdkVersion: z.string().min(1, "minimumAsdkVersion is required"),
  compatibleEcosystemVersions: z.array(z.string()).min(1, "At least one compatible ecosystem version required")
});
export type SpokeCompatibility = z.infer<typeof SpokeCompatibilitySchema>;

/**
 * Canonical Spoke Adapter Contract Schema.
 * Defines the complete boundary interface between AROH and an autonomous product spoke.
 */
export const SpokeAdapterContractSchema = z.object({
  spokeId: z.string().min(1, "Spoke ID is required"),
  displayName: z.string().min(1, "Display name is required"),
  ownershipBoundary: OwnershipBoundarySchema,
  inspectionBoundary: InspectionBoundarySchema.default("inviolable_boundary"),
  sourceProvenance: z.object({
    repositoryUrl: z.string().min(1, "Repository URL is required"),
    branch: z.string().default("main"),
    commitRef: z.string().optional(),
    verificationState: ProvenanceVerificationStateSchema
  }),
  launchUrl: LaunchUrlTargetSchema,
  docsUrl: z.string().optional(),
  apiEndpoint: z.string().optional(),
  healthCheck: SpokeHealthCheckSchema,
  capabilities: z.array(SpokeCapabilityExposureSchema).min(1, "At least one capability exposure required"),
  permissions: SpokePermissionsBoundarySchema,
  syncBinding: SpokeSyncBindingSchema,
  compatibility: SpokeCompatibilitySchema,
  lastVerifiedAt: z.string().min(1, "lastVerifiedAt timestamp is required"),
  metadataProvenance: ProvenanceVerificationStateSchema.default("VERIFIED")
});
export type SpokeAdapterContract = z.infer<typeof SpokeAdapterContractSchema>;

/**
 * Validates a candidate spoke adapter contract against the canonical schema.
 */
export function validateSpokeAdapterContract(data: unknown): SpokeAdapterContract {
  return SpokeAdapterContractSchema.parse(data);
}

/**
 * Factory for creating a safe degraded fallback state when a spoke is unreachable.
 * Ensures the platform fails closed for financial ops while maintaining showcase visibility.
 */
export function createDegradedSpokeState(
  spokeId: string,
  reason: string
): SpokeHealthCheck {
  return {
    status: "unreachable",
    lastCheckedAt: new Date().toISOString(),
    message: `Spoke [${spokeId}] is currently unreachable: ${reason}`
  };
}

/**
 * Evaluates whether a spoke health check indicates operational readiness.
 */
export function isSpokeOperational(health: SpokeHealthCheck): boolean {
  return health.status === "healthy" || health.status === "degraded";
}
