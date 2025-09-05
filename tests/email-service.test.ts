// tests/email-service.test.ts
import { EmailService } from "../src/server/services/email-service";

describe("EmailService", () => {
	test("should validate email addresses correctly", () => {
		// Set a test API key before creating EmailService
		process.env.RESEND_API_KEY = "test-api-key";
		const emailService = new EmailService();

		// Valid emails
		expect(emailService.validateEmail("test@example.com")).toBe(true);
		expect(emailService.validateEmail("user.name@domain.co.uk")).toBe(true);
		expect(emailService.validateEmail("adeesh.perera@outlook.com")).toBe(true);

		// Invalid emails
		expect(emailService.validateEmail("invalid-email")).toBe(false);
		expect(emailService.validateEmail("@domain.com")).toBe(false);
		expect(emailService.validateEmail("user@")).toBe(false);
		expect(emailService.validateEmail("")).toBe(false);
	});

	test("should throw error when RESEND_API_KEY is not provided", () => {
		// Save original env
		const originalApiKey = process.env.RESEND_API_KEY;

		// Remove API key
		delete process.env.RESEND_API_KEY;

		expect(() => {
			new EmailService();
		}).toThrow("RESEND_API_KEY environment variable is required");

		// Restore original env
		if (originalApiKey) {
			process.env.RESEND_API_KEY = originalApiKey;
		}
	});

	test("should create EmailService instance with valid API key", () => {
		// Set a test API key
		process.env.RESEND_API_KEY = "test-api-key";

		const emailService = new EmailService();
		expect(emailService).toBeInstanceOf(EmailService);
		expect(emailService.validateEmail).toBeDefined();
	});
});
