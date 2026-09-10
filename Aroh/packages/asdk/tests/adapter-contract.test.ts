import { describe, it, expect } from "vitest";
import {
  ProvenanceVerificationStateSchema,
  OwnershipBoundarySchema,
  InspectionBoundarySchema,
  SpokeHealthStatusSchema,
  SpokeHealthCheckSchema,
  LaunchUrlTargetSchema,
  SpokeCapabilityExposureSchema,
  SpokePermissionsBoundarySchema,
  SpokeSyncBindingSchema,
  SpokeCompatibilitySchema,
  SpokeAdapterContractSchema,
  validateSpokeAdapterContract,
  createDegradedSpokeState,
  isSpokeOperational
} from "../src/adapters/contract";

describe("Spoke Adapter Interface Contract Suite", () => {
  describe("Provenance Verification Taxonomy", () => {
    it("accepts all 7 canonical provenance states", () => {
      const canonicalStates = [
        "VERIFIED",
        "IMPLEMENTED-REPORTED",
        "DOCUMENTED",
        "INFERRED",
        "PROPOSED",
        "UNKNOWN",
        "SUPERSEDED"
      ] as const;

      for (const state of canonicalStates) {
        expect(ProvenanceVerificationStateSchema.parse(state)).toBe(state);
      }
    });

    it("rejects invalid or fabricated provenance states", () => {
      expect(() => ProvenanceVerificationStateSchema.parse("FABRICATED")).toThrow();
      expect(() => ProvenanceVerificationStateSchema.parse("UNVERIFIED_CLAIM")).toThrow();
      expect(() => ProvenanceVerificationStateSchema.parse("")).toThrow();
    });
  });

  describe("Ownership & Inspection Boundaries", () => {
    it("validates ownership boundaries correctly", () => {
      expect(OwnershipBoundarySchema.parse("external_spoke")).toBe("external_spoke");
      expect(OwnershipBoundarySchema.parse("submodule_spoke")).toBe("submodule_spoke");
      expect(OwnershipBoundarySchema.parse("platform_internal")).toBe("platform_internal");
      expect(() => OwnershipBoundarySchema.parse("arbitrary_vendor")).toThrow();
    });

    it("validates inspection boundaries correctly", () => {
      expect(InspectionBoundarySchema.parse("inviolable_boundary")).toBe("inviolable_boundary");
      expect(InspectionBoundarySchema.parse("read_only_tree")).toBe("read_only_tree");
      expect(InspectionBoundarySchema.parse("subproject_gitlink")).toBe("subproject_gitlink");
      expect(InspectionBoundarySchema.parse("external_remote")).toBe("external_remote");
      expect(() => InspectionBoundarySchema.parse("writable_tree")).toThrow();
    });
  });

  describe("Sync Binding & Products/ Inviolability Invariant", () => {
    it("accepts valid consumer target paths outside Products/", () => {
      const validBinding = {
        manifestPath: "manifests/omnistream-core.manifest.json",
        mergeStrategy: "downstream_wins" as const,
        protectedPaths: ["src/config/platform.json"],
        targetConsumerPath: "packages/asdk/src/adapters/omnistream"
      };
      expect(SpokeSyncBindingSchema.parse(validBinding)).toEqual(validBinding);
    });

    it("STRICTLY REJECTS any targetConsumerPath attempting to target Products/ directly", () => {
      const invalidBindingForward = {
        manifestPath: "manifests/omnistream-core.manifest.json",
        targetConsumerPath: "Products/OmniStream"
      };
      expect(() => SpokeSyncBindingSchema.parse(invalidBindingForward)).toThrow(
        "targetConsumerPath must never resolve inside the protected Products/ directory"
      );

      const invalidBindingBackslash = {
        manifestPath: "manifests/spedex-core.manifest.json",
        targetConsumerPath: "Products\\Spedex"
      };
      expect(() => SpokeSyncBindingSchema.parse(invalidBindingBackslash)).toThrow(
        "targetConsumerPath must never resolve inside the protected Products/ directory"
      );
    });
  });

  describe("Health & Readiness Representation", () => {
    it("evaluates healthy and degraded states as operational", () => {
      expect(isSpokeOperational({ status: "healthy", lastCheckedAt: "2026-09-10T11:00:00Z" })).toBe(true);
      expect(isSpokeOperational({ status: "degraded", lastCheckedAt: "2026-09-10T11:00:00Z" })).toBe(true);
    });

    it("evaluates unreachable, offline, maintenance, and unknown as non-operational", () => {
      expect(isSpokeOperational({ status: "unreachable", lastCheckedAt: "2026-09-10T11:00:00Z" })).toBe(false);
      expect(isSpokeOperational({ status: "offline", lastCheckedAt: "2026-09-10T11:00:00Z" })).toBe(false);
      expect(isSpokeOperational({ status: "maintenance", lastCheckedAt: "2026-09-10T11:00:00Z" })).toBe(false);
      expect(isSpokeOperational({ status: "unknown", lastCheckedAt: "2026-09-10T11:00:00Z" })).toBe(false);
    });

    it("creates deterministic degraded state on communication failure", () => {
      const degraded = createDegradedSpokeState("omnistream", "Connection timeout to edge player probe");
      expect(degraded.status).toBe("unreachable");
      expect(degraded.message).toContain("omnistream");
      expect(degraded.message).toContain("Connection timeout");
      expect(degraded.lastCheckedAt).toBeDefined();
    });
  });

  describe("Full SpokeAdapterContractSchema Validation", () => {
    const validOmniStreamContract = {
      spokeId: "omnistream",
      displayName: "OmniStream CineMorph",
      ownershipBoundary: "submodule_spoke" as const,
      inspectionBoundary: "inviolable_boundary" as const,
      sourceProvenance: {
        repositoryUrl: "https://github.com/UdayPatnala/OmniStream",
        branch: "main",
        commitRef: "8eb4ef0222a8f0ddef219c7b8b9d4bd5bd3c8f45",
        verificationState: "VERIFIED" as const
      },
      launchUrl: {
        url: "https://0mnistream.vercel.app/",
        kind: "external_web" as const,
        verificationState: "VERIFIED" as const,
        isAlive: true
      },
      docsUrl: "/explore/omnistream",
      apiEndpoint: undefined,
      healthCheck: {
        status: "healthy" as const,
        lastCheckedAt: "2026-09-10T11:00:00Z",
        latencyMs: 142
      },
      capabilities: [
        {
          id: "utube-discovery",
          title: "U-Tube Discovery Engine",
          description: "Curated YouTube video feeds with real-time semantic discovery",
          status: "available" as const,
          requiredTier: "basic" as const,
          verificationState: "VERIFIED" as const
        },
        {
          id: "cinemorph-theater",
          title: "CineMorph Theater",
          description: "Immersive 3D interactive theater environment",
          status: "available" as const,
          requiredTier: "basic" as const,
          verificationState: "VERIFIED" as const
        }
      ],
      permissions: {
        allowedArosOperations: ["read_balance" as const, "request_debit" as const],
        requiresUserConsent: true,
        rateLimitRpm: 120,
        roleRequirement: "user" as const
      },
      syncBinding: {
        manifestPath: "manifests/omnistream-core.manifest.json",
        mergeStrategy: "downstream_wins" as const,
        protectedPaths: ["src/config/platform.json"],
        targetConsumerPath: "packages/asdk/src/adapters/omnistream"
      },
      compatibility: {
        contractVersion: "v1.0.0",
        minimumAsdkVersion: "2.0.2",
        compatibleEcosystemVersions: ["v2.0.x", "v2.1.x"]
      },
      lastVerifiedAt: "2026-09-10T11:00:00Z",
      metadataProvenance: "VERIFIED" as const
    };

    it("parses and validates a complete canonical adapter contract", () => {
      const parsed = validateSpokeAdapterContract(validOmniStreamContract);
      expect(parsed.spokeId).toBe("omnistream");
      expect(parsed.capabilities.length).toBe(2);
      expect(parsed.permissions.allowedArosOperations).toContain("request_debit");
      expect(parsed.syncBinding.targetConsumerPath).toBe("packages/asdk/src/adapters/omnistream");
    });

    it("rejects contract missing mandatory fields", () => {
      const incomplete = { ...validOmniStreamContract, spokeId: "" };
      expect(() => validateSpokeAdapterContract(incomplete)).toThrow();
    });

    it("rejects contract with empty capabilities array", () => {
      const emptyCaps = { ...validOmniStreamContract, capabilities: [] };
      expect(() => validateSpokeAdapterContract(emptyCaps)).toThrow();
    });
  });
});
