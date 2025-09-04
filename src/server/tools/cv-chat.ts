// src/server/tools/cv-chat.ts
import { CVParser } from "../services/cv-parser";
import * as path from "path";

let cvParser: CVParser | null = null;

async function initializeCVParser(): Promise<CVParser> {
	if (!cvParser) {
		cvParser = new CVParser();
		const pdfPath = path.join(
			process.cwd(),
			"public",
			"adeesh_perera_resume.pdf"
		);
		await cvParser.loadCV(pdfPath);
	}
	return cvParser;
}

export const cvChatTool = {
	name: "ask_about_cv",
	description: "Answer questions about Adeesh Perera's CV/resume",
	inputSchema: {
		type: "object",
		properties: {
			question: {
				type: "string",
				description: "Question about the CV",
			},
		},
		required: ["question"],
	},
};

export async function handleCVQuestion(question: string) {
	try {
		const parser = await initializeCVParser();
		const answer = parser.searchCV(question);

		return {
			content: [
				{
					type: "text" as const,
					text: answer,
				},
			],
		};
	} catch (error) {
		console.error("CV question error:", error);
		return {
			content: [
				{
					type: "text" as const,
					text: "Sorry, I encountered an error while processing your question about the CV.",
				},
			],
		};
	}
}
