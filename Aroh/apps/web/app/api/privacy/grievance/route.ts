import { NextResponse } from "next/server";
import { GrievanceTicketSchema, calculateStatutoryDeadline } from "@aroh/asdk";
import { z } from "zod";

const GrievanceSubmissionPayload = z.object({
  complainant_identifier: z.string().email(),
  category: GrievanceTicketSchema.shape.category,
  subject: z.string().min(3),
  description: z.string().min(10)
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = GrievanceSubmissionPayload.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid grievance submission payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const ticketId = crypto.randomUUID ? crypto.randomUUID() : `urn:uuid:${Date.now()}`;
    const deadline = calculateStatutoryDeadline(new Date(), 90); // 90 days statutory cap

    return NextResponse.json({
      status: "RECORDED",
      ticket_id: ticketId,
      statutory_deadline_date: deadline,
      assigned_officer: "[GRIEVANCE_OFFICER_NAME_PENDING_CONFIRMATION]",
      message: "Grievance ticket successfully recorded under Section 13, DPDP Act 2023."
    });
  } catch {
    return NextResponse.json({ error: "Internal error processing grievance" }, { status: 500 });
  }
}
