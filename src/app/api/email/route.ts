// src/app/api/email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleEmailSend } from "../../../server/tools/email-sender";
import { z } from "zod";

const emailRequestSchema = z.object({
	recipient: z.string().email("Invalid email format"),
	subject: z.string().min(1, "Subject is required"),
	body: z.string().min(1, "Body is required"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			recipient,
			subject,
			body: emailBody,
		} = emailRequestSchema.parse(body);

		// Send email via email service
		const result = await handleEmailSend(recipient, subject, emailBody);

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: result.message || "Email sent successfully",
				id: result.id,
			});
		} else {
			return NextResponse.json(
				{
					success: false,
					error: result.error || "Failed to send email",
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.error("Email API error:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					success: false,
					error: error.errors.map((e) => e.message).join(", "),
				},
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
