// src/server/index.ts
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { cvChatTool } from "./tools/cv-chat";
import { emailSenderTool } from "./tools/email-sender";

const server = new Server(
	{
		name: "cv-mcp-server",
		version: "0.1.0",
	},
	{
		capabilities: {
			tools: {},
		},
	}
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
	return {
		tools: [cvChatTool, emailSenderTool],
	};
});

// Handle tool calls - simplified to just return basic responses
server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	if (!args) {
		throw new Error("Arguments are required");
	}

	switch (name) {
		case "ask_about_cv": {
			const question = args.question as string;
			if (!question) {
				throw new Error("Question is required");
			}

			// Simple response for MCP compatibility
			return {
				content: [
					{
						type: "text" as const,
						text: "CV question answered via MCP server",
					},
				],
			};
		}

		case "send_email": {
			const recipient = args.recipient as string;
			const subject = args.subject as string;
			const body = args.body as string;

			if (!recipient || !subject || !body) {
				throw new Error("Recipient, subject, and body are required");
			}

			// Simple response for MCP compatibility
			return {
				content: [
					{
						type: "text" as const,
						text: "Email would be sent via MCP server",
					},
				],
			};
		}

		default:
			throw new Error(`Unknown tool: ${name}`);
	}
});

// Start the server
async function runServer() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("MCP CV Server running on stdio");
}

if (require.main === module) {
	runServer().catch(console.error);
}

export { server, runServer };
