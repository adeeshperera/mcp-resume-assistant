// src/server/tools/email-sender.ts
import { EmailService } from "../services/email-service";
import { EmailResponse } from "../types";
import { z } from "zod";

const emailSchema = z.object({
	recipient: z.string().email("Invalid email format"),
	subject: z.string().min(1, "Subject is required"),
	body: z.string().min(1, "Body is required"),
});

export const emailSenderTool = {
	name: "send_email",
	description: "Send email notifications",
	inputSchema: {
		type: "object",
		properties: {
			recipient: {
				type: "string",
				format: "email",
				description: "Email address of the recipient",
			},
			subject: {
				type: "string",
				description: "Email subject line",
			},
			body: {
				type: "string",
				description: "Email body content",
			},
		},
		required: ["recipient", "subject", "body"],
	},
};

export async function handleEmailSend(
	recipient: string,
	subject: string,
	body: string
): Promise<EmailResponse> {
	try {
		// Validate input
		const validatedData = emailSchema.parse({ recipient, subject, body });

		// Create email service instance
		const emailService = new EmailService();

		// Send email
		const result = await emailService.sendEmail(
			validatedData.recipient,
			validatedData.subject,
			validatedData.body
		);

		return result;
	} catch (error) {
		console.error("Email sending error:", error);

		if (error instanceof z.ZodError) {
			return {
				success: false,
				error: error.errors.map((e) => e.message).join(", "),
			};
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
}
