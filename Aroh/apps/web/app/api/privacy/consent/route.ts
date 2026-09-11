import { NextResponse } from "next/server";
import { ConsentRecordSchema, ConsentStateSchema } from "@aroh/asdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = ConsentRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid consent record payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // In a production environment, this would write to Firestore collection `consent_audit_records`
    // In local/mock mode, we validate and return the verified record
    return NextResponse.json({
      status: "RECORDED",
      consent_id: parsed.data.consent_id,
      consent_state: parsed.data.consent_state,
      timestamp: parsed.data.timestamp
    });
  } catch {
    return NextResponse.json({ error: "Internal error processing consent" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ACTIVE",
    supported_states: ConsentStateSchema.options,
    policy_version: "1.0.0",
    notice_version: "1.0.0"
  });
}
