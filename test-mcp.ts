// Test script for MCP server functionality
import { handleCVQuestion } from "./src/server/tools/cv-chat";
import { handleEmailSend } from "./src/server/tools/email-sender";

async function testMCPServer() {
	console.log("🧪 Testing MCP Server Functionality\n");

	// Test CV Chat
	console.log("1. Testing CV Chat...");
	try {
		const cvResponse = await handleCVQuestion("What skills do I have?");
		console.log("✅ CV Chat Response:", cvResponse.content[0].text);
	} catch (error) {
		console.log(
			"❌ CV Chat Error:",
			error instanceof Error ? error.message : "Unknown error"
		);
	}

	console.log("\n2. Testing CV Chat with different question...");
	try {
		const cvResponse2 = await handleCVQuestion("Where did I study?");
		console.log("✅ CV Chat Response:", cvResponse2.content[0].text);
	} catch (error) {
		console.log(
			"❌ CV Chat Error:",
			error instanceof Error ? error.message : "Unknown error"
		);
	}

	// Test Email (will fail without API key, but structure should be correct)
	console.log("\n3. Testing Email Service Structure...");
	try {
		const emailResponse = await handleEmailSend(
			"test@example.com",
			"Test Subject",
			"Test message body"
		);
		console.log("✅ Email Response Structure:", emailResponse);
	} catch (error) {
		console.log(
			"ℹ️ Email Test (expected to fail without API key):",
			error instanceof Error ? error.message : "Unknown error"
		);
	}

	console.log("\n✨ MCP Server test completed!");
}

testMCPServer().catch(console.error);
