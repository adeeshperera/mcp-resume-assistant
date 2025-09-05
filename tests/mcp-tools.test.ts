// tests/mcp-tools.test.ts
import { cvChatTool, handleCVQuestion } from "../src/server/tools/cv-chat";
import {
	emailSenderTool,
	handleEmailSend,
} from "../src/server/tools/email-sender";

describe("MCP Tools", () => {
	describe("CV Chat Tool", () => {
		test("should have correct tool definition", () => {
			expect(cvChatTool.name).toBe("ask_about_cv");
			expect(cvChatTool.description).toContain("CV");
			expect(cvChatTool.inputSchema.type).toBe("object");
			expect(cvChatTool.inputSchema.properties.question).toBeDefined();
			expect(cvChatTool.inputSchema.required).toContain("question");
		});

		test("should handle CV questions and return proper format", async () => {
			const response = await handleCVQuestion("What skills do you have?");

			expect(response).toHaveProperty("content");
			expect(Array.isArray(response.content)).toBe(true);
			expect(response.content[0]).toHaveProperty("type", "text");
			expect(response.content[0]).toHaveProperty("text");
			expect(typeof response.content[0].text).toBe("string");
		});

		test("should handle empty questions gracefully", async () => {
			const response = await handleCVQuestion("");

			expect(response).toHaveProperty("content");
			expect(response.content[0]).toHaveProperty("type", "text");
			expect(typeof response.content[0].text).toBe("string");
		});
	});

	describe("Email Sender Tool", () => {
		test("should have correct tool definition", () => {
			expect(emailSenderTool.name).toBe("send_email");
			expect(emailSenderTool.description).toContain("email");
			expect(emailSenderTool.inputSchema.type).toBe("object");
			expect(emailSenderTool.inputSchema.properties.recipient).toBeDefined();
			expect(emailSenderTool.inputSchema.properties.subject).toBeDefined();
			expect(emailSenderTool.inputSchema.properties.body).toBeDefined();
			expect(emailSenderTool.inputSchema.required).toEqual([
				"recipient",
				"subject",
				"body",
			]);
		});

		test("should validate email input properly", async () => {
			// Test with invalid email
			const invalidResponse = await handleEmailSend(
				"invalid-email",
				"Test Subject",
				"Test Body"
			);
			expect(invalidResponse.success).toBe(false);
			expect(invalidResponse.error).toContain("Invalid email format");
		});

		test("should validate required fields", async () => {
			// Test with missing subject
			const response1 = await handleEmailSend(
				"test@example.com",
				"",
				"Test Body"
			);
			expect(response1.success).toBe(false);
			expect(response1.error).toContain("Subject is required");

			// Test with missing body
			const response2 = await handleEmailSend(
				"test@example.com",
				"Test Subject",
				""
			);
			expect(response2.success).toBe(false);
			expect(response2.error).toContain("Body is required");
		});

		test("should handle valid input format (without sending actual email)", async () => {
			// Note: This will fail due to missing RESEND_API_KEY, but validates input structure
			const response = await handleEmailSend(
				"test@example.com",
				"Test Subject",
				"Test Body"
			);

			expect(response).toHaveProperty("success");
			expect(typeof response.success).toBe("boolean");

			if (!response.success) {
				expect(response).toHaveProperty("error");
				expect(typeof response.error).toBe("string");
			}
		});
	});
});
