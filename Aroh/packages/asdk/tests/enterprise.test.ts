import { describe, it, expect, beforeEach } from "vitest";
import { TeamWalletService } from "../src/services/team-wallet";
import { EnterpriseDirectoryService } from "../src/services/saml-scim";
import { User } from "../src/schemas/index";
import { ScimUser } from "../src/schemas/enterprise";

describe("Phase 5 Enterprise Suite: Team Wallets & Directory Federation", () => {
  const mockOwnerUser: User = {
    id: "usr_owner_1",
    email: "enterprise-lead@aroh.io",
    role: "admin",
    emailVerified: true,
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    TeamWalletService.resetStore();
    EnterpriseDirectoryService.resetStore();
  });

  describe("Team Wallet & Organization Lifecycle", () => {
    it("should initialize enterprise organization with dedicated team wallet and initial Aros allocation", () => {
      const { organization, member, wallet } = TeamWalletService.createOrganization(
        "Aroh Enterprise Core",
        mockOwnerUser,
        "enterprise"
      );

      expect(organization.name).toBe("Aroh Enterprise Core");
      expect(organization.slug).toBe("aroh-enterprise-core");
      expect(member.role).toBe("owner");
      expect(member.email).toBe("enterprise-lead@aroh.io");
      expect(wallet.balance).toBe(10000);
      expect(wallet.dailyCapAros).toBe(100000);
      expect(wallet.currency).toBe("AROS");
    });

    it("should allow adding team members with custom spending caps", () => {
      const { organization } = TeamWalletService.createOrganization(
        "Aroh Dev Guild",
        mockOwnerUser
      );

      const member = TeamWalletService.addMember(
        organization.id,
        "engineer@aroh.io",
        "member",
        3000
      );

      expect(member.email).toBe("engineer@aroh.io");
      expect(member.role).toBe("member");
      expect(member.spendingLimitAros).toBe(3000);
      expect(member.spentThisMonthAros).toBe(0);

      const members = TeamWalletService.getMembers(organization.id);
      expect(members).toHaveLength(2);
    });

    it("should reject duplicate member additions", () => {
      const { organization } = TeamWalletService.createOrganization("Dupe Org", mockOwnerUser);
      TeamWalletService.addMember(organization.id, "dev@aroh.io");

      expect(() => {
        TeamWalletService.addMember(organization.id, "dev@aroh.io");
      }).toThrow(/already in organization/);
    });
  });

  describe("Team Wallet Double-Entry Debits & Credits", () => {
    it("should allow valid debits within member spending quotas and update wallet balance", () => {
      const { organization } = TeamWalletService.createOrganization(
        "Fintech Operations",
        mockOwnerUser
      );
      const member = TeamWalletService.addMember(organization.id, "analyst@aroh.io", "member", 4000);

      const res = TeamWalletService.debitTeamWallet(
        organization.id,
        member.userId,
        1500,
        "SpeDex Logistics Routing Dispatch API"
      );

      expect(res.wallet.balance).toBe(8500); // 10000 - 1500
      expect(res.transaction.amount).toBe(-1500);
      expect(res.transaction.receiptHash).toMatch(/^rcpt_debit_/);
      expect(res.remainingMemberLimit).toBe(2500); // 4000 - 1500

      const txs = TeamWalletService.getTransactions(organization.id);
      expect(txs).toHaveLength(2); // genesis + debit
    });

    it("should enforce member spending limit quotas and reject excessive spends", () => {
      const { organization } = TeamWalletService.createOrganization(
        "Budget Constrained Team",
        mockOwnerUser
      );
      const member = TeamWalletService.addMember(organization.id, "junior@aroh.io", "member", 500);

      expect(() => {
        TeamWalletService.debitTeamWallet(
          organization.id,
          member.userId,
          600,
          "Attempted oversized inference call"
        );
      }).toThrow(/exceeds member monthly spending limit/);
    });

    it("should reject debits if team wallet has insufficient balance", () => {
      const { organization } = TeamWalletService.createOrganization("Empty Org", mockOwnerUser);
      const member = TeamWalletService.addMember(organization.id, "lead@aroh.io", "admin", 50000);

      expect(() => {
        TeamWalletService.debitTeamWallet(
          organization.id,
          member.userId,
          20000,
          "Exceeding wallet total"
        );
      }).toThrow(/Insufficient team wallet balance/);
    });

    it("should credit team wallet and enforce NO_MINOR_PAYMENT_FOR_AROS", () => {
      const { organization } = TeamWalletService.createOrganization("Credit Org", mockOwnerUser);

      const res = TeamWalletService.creditTeamWallet(
        organization.id,
        5000,
        "Enterprise Aros Pack Top-up",
        28 // adult funder
      );

      expect(res.wallet.balance).toBe(15000);
      expect(res.transaction.amount).toBe(5000);

      // Minor funding attempt must be rejected
      expect(() => {
        TeamWalletService.creditTeamWallet(
          organization.id,
          1000,
          "Minor funding attempt",
          16 // minor funder
        );
      }).toThrow(/Minors are legally prohibited from funding enterprise team wallets/);
    });
  });

  describe("Enterprise Directory Federation (SAML 2.0 & SCIM 2.0)", () => {
    it("should configure SAML IdP and validate valid signed assertions", () => {
      const { organization } = TeamWalletService.createOrganization("SSO Org", mockOwnerUser);

      const saml = EnterpriseDirectoryService.configureSaml(
        organization.id,
        "https://auth.enterprise-corp.com/idp",
        "https://auth.enterprise-corp.com/sso",
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."
      );

      expect(saml.idpEntityId).toBe("https://auth.enterprise-corp.com/idp");
      expect(saml.enabled).toBe(true);

      const validAssertion = {
        issuer: "https://auth.enterprise-corp.com/idp",
        subject: "staff@enterprise-corp.com",
        signatureValid: true,
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };

      const result = EnterpriseDirectoryService.validateSamlAssertion(organization.id, validAssertion);
      expect(result.isValid).toBe(true);
      expect(result.email).toBe("staff@enterprise-corp.com");
    });

    it("should reject tampered or invalid SAML assertions", () => {
      const { organization } = TeamWalletService.createOrganization("SSO Org 2", mockOwnerUser);

      EnterpriseDirectoryService.configureSaml(
        organization.id,
        "https://okta.aroh.io",
        "https://okta.aroh.io/sso",
        "MIIBIjANBg..."
      );

      const invalidSig = {
        issuer: "https://okta.aroh.io",
        subject: "staff@aroh.io",
        signatureValid: false,
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };

      const res = EnterpriseDirectoryService.validateSamlAssertion(organization.id, invalidSig);
      expect(res.isValid).toBe(false);
      expect(res.error).toMatch(/signature verification failed/);
    });

    it("should automate SCIM 2.0 user provisioning and deprovisioning", () => {
      const { organization } = TeamWalletService.createOrganization("SCIM Org", mockOwnerUser);

      const scimUser: ScimUser = {
        schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
        id: "scim_okta_usr_123",
        userName: "alice.ops@aroh.io",
        emails: [{ value: "alice.ops@aroh.io", primary: true }],
        active: true,
        roles: ["admin"]
      };

      // 1. Provision new member
      const provRes = EnterpriseDirectoryService.processScimUserEvent(
        organization.id,
        scimUser,
        "create"
      );
      expect(provRes.success).toBe(true);
      expect(provRes.action).toBe("member_provisioned");

      const members = TeamWalletService.getMembers(organization.id);
      const alice = members.find((m) => m.email === "alice.ops@aroh.io");
      expect(alice).toBeDefined();
      expect(alice?.role).toBe("admin");

      // 2. Deprovision member (deactivate)
      const deprovRes = EnterpriseDirectoryService.processScimUserEvent(
        organization.id,
        { ...scimUser, active: false },
        "update"
      );
      expect(deprovRes.success).toBe(true);
      expect(deprovRes.action).toBe("member_suspended");
      expect(alice?.status).toBe("suspended");
    });
  });
});
