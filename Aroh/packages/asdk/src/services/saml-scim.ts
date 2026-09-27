import { SamlConfig, ScimUser } from "../schemas/enterprise";
import { TeamWalletService } from "./team-wallet";

// In-memory directory configurations
const samlConfigsStore = new Map<string, SamlConfig>(); // orgId -> config

/**
 * Enterprise Directory & SSO Federation Service (SAML 2.0 & SCIM 2.0)
 * Domain: Identity & Enterprise Directory Federation (Domain 1)
 */
export class EnterpriseDirectoryService {
  /**
   * Configures SAML 2.0 IdP integration for an enterprise organization.
   */
  public static configureSaml(
    orgId: string,
    idpEntityId: string,
    idpSsoUrl: string,
    certificate: string
  ): SamlConfig {
    if (!idpEntityId || !idpSsoUrl || !certificate) {
      throw new Error("Missing required SAML 2.0 IdP configuration fields");
    }

    const config: SamlConfig = {
      id: "saml_" + Math.random().toString(36).substring(2, 10),
      orgId,
      idpEntityId,
      idpSsoUrl,
      certificate,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    samlConfigsStore.set(orgId, config);
    return config;
  }

  /**
   * Validates an incoming SAML 2.0 response assertion against the organization's IdP entity configuration.
   */
  public static validateSamlAssertion(
    orgId: string,
    assertion: {
      issuer: string;
      subject: string;
      signatureValid: boolean;
      expiresAt: string;
    }
  ): { isValid: boolean; email?: string; error?: string } {
    const config = samlConfigsStore.get(orgId);
    if (!config || !config.enabled) {
      return { isValid: false, error: "SAML SSO is not configured or disabled for this organization" };
    }

    if (assertion.issuer !== config.idpEntityId) {
      return { isValid: false, error: `Invalid SAML issuer: expected ${config.idpEntityId}, received ${assertion.issuer}` };
    }

    if (!assertion.signatureValid) {
      return { isValid: false, error: "Cryptographic SAML signature verification failed" };
    }

    if (new Date(assertion.expiresAt).getTime() < Date.now()) {
      return { isValid: false, error: "SAML assertion has expired" };
    }

    return { isValid: true, email: assertion.subject };
  }

  /**
   * Processes a SCIM 2.0 provisioning / deprovisioning payload from identity providers (Okta, Azure AD, Ping).
   */
  public static processScimUserEvent(
    orgId: string,
    scimUser: ScimUser,
    eventType: "create" | "update" | "delete"
  ): { success: boolean; action: string; memberId?: string } {
    const primaryEmail = scimUser.emails.find((e) => e.primary)?.value || scimUser.emails[0]?.value;
    if (!primaryEmail) {
      throw new Error("SCIM user payload must contain at least one valid email");
    }

    const members = TeamWalletService.getMembers(orgId);
    const existing = members.find((m) => m.email.toLowerCase() === primaryEmail.toLowerCase());

    if (eventType === "create") {
      if (existing) {
        return { success: true, action: "member_already_exists", memberId: existing.id };
      }
      const role = scimUser.roles?.[0] || "member";
      const member = TeamWalletService.addMember(orgId, primaryEmail, role, 5000);
      return { success: true, action: "member_provisioned", memberId: member.id };
    }

    if (eventType === "delete" || (!scimUser.active && eventType === "update")) {
      if (existing) {
        existing.status = "suspended";
        return { success: true, action: "member_suspended", memberId: existing.id };
      }
      return { success: true, action: "member_not_found" };
    }

    if (eventType === "update" && existing) {
      if (scimUser.roles?.[0]) {
        existing.role = scimUser.roles[0];
      }
      return { success: true, action: "member_updated", memberId: existing.id };
    }

    return { success: true, action: "no_op" };
  }

  public static getSamlConfig(orgId: string): SamlConfig | null {
    return samlConfigsStore.get(orgId) || null;
  }

  public static resetStore(): void {
    samlConfigsStore.clear();
  }
}
