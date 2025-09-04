// src/server/types/index.ts

export interface MCPToolCall {
	name: string;
	arguments: Record<string, unknown>;
}

export interface MCPToolResponse {
	content: Array<{
		type: "text";
		text: string;
	}>;
	isError?: boolean;
}

export interface CVQuestion {
	question: string;
}

export interface EmailRequest {
	recipient: string;
	subject: string;
	body: string;
}

export interface EmailResponse {
	success: boolean;
	message?: string;
	error?: string;
	id?: string;
}

export interface ChatMessage {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}
