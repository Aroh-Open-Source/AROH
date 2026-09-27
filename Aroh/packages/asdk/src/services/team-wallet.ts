import {
  Organization,
  OrganizationMember,
  OrganizationRole,
  TeamWallet,
  TeamWalletTransaction
} from "../schemas/enterprise";
import { User } from "../schemas/index";
import { NO_MINOR_PAYMENT_FOR_AROS } from "./purchase-safety";

// In-memory persistent enterprise stores for organizations, members, and team wallets
const organizationsStore = new Map<string, Organization>();
const membersStore = new Map<string, OrganizationMember[]>(); // orgId -> members
const teamWalletsStore = new Map<string, TeamWallet>(); // orgId -> wallet
const teamTransactionsStore = new Map<string, TeamWalletTransaction[]>(); // orgId -> txs

/**
 * Enterprise Multi-Tenant Team Wallet Service
 * Domain: Financial Economy & Multi-Tenant Billing (Domain 2)
 */
export class TeamWalletService {
  /**
   * Initializes a new enterprise organization and dedicated team wallet.
   */
  public static createOrganization(
    name: string,
    ownerUser: User,
    planTier: "starter" | "growth" | "enterprise" = "starter"
  ): { organization: Organization; member: OrganizationMember; wallet: TeamWallet } {
    if (!name || name.trim().length === 0) {
      throw new Error("Organization name cannot be empty");
    }

    const orgId = "org_" + Math.random().toString(36).substring(2, 10);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const now = new Date().toISOString();

    const organization: Organization = {
      id: orgId,
      name,
      slug,
      planTier,
      ownerId: ownerUser.id,
      createdAt: now,
      updatedAt: now
    };

    const ownerMember: OrganizationMember = {
      id: "mem_" + Math.random().toString(36).substring(2, 10),
      orgId,
      userId: ownerUser.id,
      email: ownerUser.email,
      role: "owner",
      spendingLimitAros: 1000000, // unlimited for owner
      spentThisMonthAros: 0,
      status: "active",
      joinedAt: now
    };

    const wallet: TeamWallet = {
      id: "twal_" + Math.random().toString(36).substring(2, 10),
      orgId,
      balance: 10000, // initial welcome balance for team
      currency: "AROS",
      dailyCapAros: planTier === "enterprise" ? 100000 : 25000,
      monthlyCapAros: planTier === "enterprise" ? 1000000 : 250000,
      spentTodayAros: 0,
      spentThisMonthAros: 0,
      updatedAt: now
    };

    organizationsStore.set(orgId, organization);
    membersStore.set(orgId, [ownerMember]);
    teamWalletsStore.set(orgId, wallet);
    teamTransactionsStore.set(orgId, [
      {
        id: "tx_team_init_" + Math.random().toString(36).substring(2, 8),
        teamWalletId: wallet.id,
        orgId,
        memberUserId: ownerUser.id,
        memberEmail: ownerUser.email,
        amount: 10000,
        action: "credit",
        description: "Initial Enterprise Organization Aros Allocation",
        receiptHash: "rcpt_genesis_" + Math.random().toString(36).substring(2, 12),
        timestamp: now
      }
    ]);

    return { organization, member: ownerMember, wallet };
  }

  /**
   * Adds an authenticated member to the organization with a spending limit.
   */
  public static addMember(
    orgId: string,
    email: string,
    role: OrganizationRole = "member",
    spendingLimitAros: number = 2500
  ): OrganizationMember {
    const org = organizationsStore.get(orgId);
    if (!org) {
      throw new Error(`Organization [${orgId}] does not exist`);
    }

    const currentMembers = membersStore.get(orgId) || [];
    if (currentMembers.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`Member with email [${email}] is already in organization`);
    }

    const newMember: OrganizationMember = {
      id: "mem_" + Math.random().toString(36).substring(2, 10),
      orgId,
      userId: "usr_" + Math.random().toString(36).substring(2, 10),
      email: email.toLowerCase(),
      role,
      spendingLimitAros,
      spentThisMonthAros: 0,
      status: "active",
      joinedAt: new Date().toISOString()
    };

    currentMembers.push(newMember);
    membersStore.set(orgId, currentMembers);
    return newMember;
  }

  /**
   * Credits the team wallet with newly purchased or distributed Aros.
   * Enforces NO_MINOR_PAYMENT_FOR_AROS if a funder is a minor.
   */
  public static creditTeamWallet(
    orgId: string,
    amount: number,
    description: string,
    funderAge?: number
  ): { wallet: TeamWallet; transaction: TeamWalletTransaction } {
    if (funderAge !== undefined && funderAge < 18 && NO_MINOR_PAYMENT_FOR_AROS) {
      throw new Error("Minors are legally prohibited from funding enterprise team wallets");
    }

    if (amount <= 0) {
      throw new Error("Credit amount must be greater than zero");
    }

    const wallet = teamWalletsStore.get(orgId);
    if (!wallet) {
      throw new Error(`Team wallet for organization [${orgId}] not found`);
    }

    wallet.balance += amount;
    wallet.updatedAt = new Date().toISOString();

    const tx: TeamWalletTransaction = {
      id: "tx_team_" + Math.random().toString(36).substring(2, 10),
      teamWalletId: wallet.id,
      orgId,
      memberUserId: "system:fiat-onramp",
      memberEmail: "finance@aroh.io",
      amount,
      action: "credit",
      description,
      receiptHash: "rcpt_credit_" + Math.random().toString(36).substring(2, 12),
      timestamp: wallet.updatedAt
    };

    const txList = teamTransactionsStore.get(orgId) || [];
    txList.unshift(tx);
    teamTransactionsStore.set(orgId, txList);

    return { wallet, transaction: tx };
  }

  /**
   * Debits a team member's spend from the organization team wallet.
   * Enforces:
   * 1. Member existence and active status
   * 2. Member monthly spending limit quota
   * 3. Organization wallet balance
   * 4. Organization daily spend cap
   */
  public static debitTeamWallet(
    orgId: string,
    memberUserId: string,
    amount: number,
    description: string
  ): { wallet: TeamWallet; transaction: TeamWalletTransaction; remainingMemberLimit: number } {
    if (amount <= 0) {
      throw new Error("Debit amount must be greater than zero");
    }

    const wallet = teamWalletsStore.get(orgId);
    if (!wallet) {
      throw new Error(`Team wallet for organization [${orgId}] not found`);
    }

    const members = membersStore.get(orgId) || [];
    const member = members.find((m) => m.userId === memberUserId || m.id === memberUserId);
    if (!member) {
      throw new Error(`Member [${memberUserId}] not found in organization [${orgId}]`);
    }

    if (member.status !== "active") {
      throw new Error(`Member account status is [${member.status}]; cannot authorize debits`);
    }

    // 1. Check member spending limit
    if (member.spentThisMonthAros + amount > member.spendingLimitAros) {
      throw new Error(
        `Debit of ${amount} Aros exceeds member monthly spending limit (${member.spentThisMonthAros}/${member.spendingLimitAros} Aros spent)`
      );
    }

    // 2. Check team balance
    if (wallet.balance < amount) {
      throw new Error(`Insufficient team wallet balance: ${wallet.balance} Aros available, ${amount} required`);
    }

    // 3. Check organization daily cap
    if (wallet.spentTodayAros + amount > wallet.dailyCapAros) {
      throw new Error(`Transaction exceeds organization daily cap of ${wallet.dailyCapAros} Aros`);
    }

    // Apply double-entry debit
    wallet.balance -= amount;
    wallet.spentTodayAros += amount;
    wallet.spentThisMonthAros += amount;
    wallet.updatedAt = new Date().toISOString();

    member.spentThisMonthAros += amount;

    const tx: TeamWalletTransaction = {
      id: "tx_team_" + Math.random().toString(36).substring(2, 10),
      teamWalletId: wallet.id,
      orgId,
      memberUserId: member.userId,
      memberEmail: member.email,
      amount: -amount,
      action: "debit",
      description,
      receiptHash: "rcpt_debit_" + Math.random().toString(36).substring(2, 12),
      timestamp: wallet.updatedAt
    };

    const txList = teamTransactionsStore.get(orgId) || [];
    txList.unshift(tx);
    teamTransactionsStore.set(orgId, txList);

    return {
      wallet,
      transaction: tx,
      remainingMemberLimit: member.spendingLimitAros - member.spentThisMonthAros
    };
  }

  public static getOrganization(orgId: string): Organization | null {
    return organizationsStore.get(orgId) || null;
  }

  public static getTeamWallet(orgId: string): TeamWallet | null {
    return teamWalletsStore.get(orgId) || null;
  }

  public static getMembers(orgId: string): OrganizationMember[] {
    return membersStore.get(orgId) || [];
  }

  public static getTransactions(orgId: string): TeamWalletTransaction[] {
    return teamTransactionsStore.get(orgId) || [];
  }

  public static resetStore(): void {
    organizationsStore.clear();
    membersStore.clear();
    teamWalletsStore.clear();
    teamTransactionsStore.clear();
  }
}
