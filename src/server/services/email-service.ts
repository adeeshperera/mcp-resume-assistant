// src/server/services/email-service.ts
import { Resend } from "resend";

export class EmailService {
	private resend: Resend;

	constructor() {
		const apiKey = process.env.RESEND_API_KEY;
		if (!apiKey) {
			throw new Error("RESEND_API_KEY environment variable is required");
		}
		this.resend = new Resend(apiKey);
	}

	async sendEmail(recipient: string, subject: string, body: string) {
		try {
			const result = await this.resend.emails.send({
				from: "onboarding@resend.dev", // Use default Resend domain for testing
				to: recipient,
				subject,
				html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${body.replace(
					/\n/g,
					"<br>"
				)}</div>`,
			});

			return {
				success: true,
				id: result.data?.id,
				message: "Email sent successfully",
			};
		} catch (error) {
			console.error("Email sending error:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
}
