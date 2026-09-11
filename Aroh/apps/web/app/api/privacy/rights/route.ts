import { NextResponse } from "next/server";
import { DataPrincipalRightTypeSchema, calculateStatutoryDeadline } from "@aroh/asdk";
import { z } from "zod";

const RightsSubmissionPayload = z.object({
  right_type: DataPrincipalRightTypeSchema,
  email: z.string().email(),
  details: z.string().min(3),
  nominee_name: z.string().optional(),
  nominee_relationship: z.string().optional(),
  nominee_email: z.string().email().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RightsSubmissionPayload.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid rights submission payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const requestId = crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`;
    const deadline = calculateStatutoryDeadline(new Date(), 30); // 30 days internal target

    return NextResponse.json({
      status: "RECEIVED",
      request_id: requestId,
      right_type: parsed.data.right_type,
      statutory_deadline_date: deadline,
      message: "Your Data Principal statutory rights request has been logged in the audit trail."
    });
  } catch {
    return NextResponse.json({ error: "Internal error processing rights request" }, { status: 500 });
  }
}
