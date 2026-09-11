import { NextResponse } from "next/server";
import { verifyMockToken, DataExportBundleSchema } from "@aroh/asdk";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required to export personal data under Section 11 DPDP Act." },
        { status: 401 }
      );
    }

    const session = verifyMockToken(token);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid or expired session token." },
        { status: 401 }
      );
    }

    const bundle = {
      export_id: crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`,
      user_id: session.userId,
      generated_at: new Date().toISOString(),
      format_version: "1.0.0" as const,
      fiduciary_notice: "Generated pursuant to Section 11, Digital Personal Data Protection Act, 2023 by AROH Platform.",
      personal_profile: {
        id: session.userId,
        email: "authenticated_user@example.com",
        displayName: "AROH Developer",
        membershipLevel: "basic",
        createdAt: new Date().toISOString()
      },
      consent_history: [
        {
          consent_id: "urn:uuid:export_ref_001",
          timestamp: new Date().toISOString(),
          state: "accepted",
          categories: { essential: true, functional: true, analytics: false, marketing: false },
          affirmative_action: "export_snapshot"
        }
      ],
      aros_economic_activity: {
        current_balance: 500,
        transaction_count: 1,
        transactions: [
          {
            id: "tx_welcome",
            amount: 500,
            type: "reward",
            description: "Initial Onboarding Grant",
            timestamp: new Date().toISOString()
          }
        ]
      },
      rights_and_grievances: {
        submitted_rights_requests_count: 0,
        submitted_grievances_count: 0
      }
    };

    const validated = DataExportBundleSchema.safeParse(bundle);
    if (!validated.success) {
      return NextResponse.json({ error: "Failed to generate valid export bundle" }, { status: 500 });
    }

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json({ error: "Internal error generating data export" }, { status: 500 });
  }
}
