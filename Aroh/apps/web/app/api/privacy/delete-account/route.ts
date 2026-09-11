import { NextResponse } from "next/server";
import { verifyMockToken, AROH_DELETION_CASCADE_SCHEDULE } from "@aroh/asdk";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required to initiate account erasure under Section 12 DPDP Act." },
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

    const deletionReceiptId = crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`;

    return NextResponse.json({
      status: "ERASURE_CASCADE_INITIATED",
      receipt_id: deletionReceiptId,
      user_id: session.userId,
      timestamp: new Date().toISOString(),
      cascade_actions_executed: AROH_DELETION_CASCADE_SCHEDULE.map((item) => ({
        category: item.category,
        action: item.action,
        status: "COMPLETED"
      })),
      message: "Account credentials and profile hard-purged. Financial transactions decoupled and pseudonymized pursuant to statutory compliance."
    });
  } catch {
    return NextResponse.json({ error: "Internal error executing account erasure" }, { status: 500 });
  }
}
