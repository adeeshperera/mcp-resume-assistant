// src/app/api/mcp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { handleCVQuestion } from "../../../server/tools/cv-chat";
import { z } from "zod";

const questionSchema = z.object({
	question: z.string().min(1, "Question is required"),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { question } = questionSchema.parse(body);

		// Process question using CV tool
		const response = await handleCVQuestion(question);

		return NextResponse.json({
			success: true,
			answer: response.content[0]?.text || "No answer available",
		});
	} catch (error) {
		console.error("MCP API error:", error);

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
