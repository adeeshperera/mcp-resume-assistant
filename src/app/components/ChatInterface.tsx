"use client";

// src/app/components/ChatInterface.tsx
import { useState } from "react";

interface Message {
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

export default function ChatInterface() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [question, setQuestion] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showQuickQuestions, setShowQuickQuestions] = useState(false);

	// Predefined questions that can be answered
	const predefinedQuestions = [
		{ label: "🎓 Education", question: "Tell me about my education" },
		{ label: "💻 Skills", question: "What skills do I have?" },
		{ label: "📧 Contact", question: "What is my contact information?" },
		{ label: "🔧 Technologies", question: "What technologies do I work with?" },
	];

	const askQuestion = async (questionText?: string) => {
		const questionToAsk = questionText || question;
		if (!questionToAsk.trim()) return;

		const userMessage: Message = {
			role: "user",
			content: questionToAsk,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			const response = await fetch("/api/mcp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ question: questionToAsk }),
			});

			const data = await response.json();

			const assistantMessage: Message = {
				role: "assistant",
				content: data.success
					? data.answer
					: data.error || "Sorry, I encountered an error.",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Error asking question:", error);
			const errorMessage: Message = {
				role: "assistant",
				content:
					"Sorry, I encountered an error while processing your question.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
			setQuestion("");
		}
	};

	const handlePredefinedQuestion = (questionText: string) => {
		askQuestion(questionText);
	};

	const clearChat = () => {
		setMessages([]);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		askQuestion();
	};

	return (
		<div className="border rounded-lg p-4 h-[500px] flex flex-col">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-semibold">Ask About My CV</h2>
				<div className="flex gap-2">
					{messages.length > 0 && (
						<button
							onClick={() => setShowQuickQuestions(!showQuickQuestions)}
							className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded transition-colors"
						>
							{showQuickQuestions ? "Hide" : "Show"} Quick Questions
						</button>
					)}
					{messages.length > 0 && (
						<button
							onClick={clearChat}
							className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded transition-colors"
						>
							Clear Chat
						</button>
					)}
				</div>
			</div>

			{/* Predefined Question Buttons */}
			{(messages.length === 0 || showQuickQuestions) && (
				<div className="mb-4">
					<p className="text-sm text-gray-600 mb-3">Quick questions to ask:</p>
					<div className="grid grid-cols-2 gap-2">
						{predefinedQuestions.map((item, index) => (
							<button
								key={index}
								onClick={() => handlePredefinedQuestion(item.question)}
								disabled={isLoading}
								className="text-left px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
							>
								{item.label}
							</button>
						))}
					</div>
					{messages.length === 0 && (
						<div className="mt-3 text-center">
							<span className="text-xs text-gray-500">- OR -</span>
						</div>
					)}
				</div>
			)}

			{/* Chat messages */}
			<div className="flex-1 overflow-y-auto mb-4 space-y-2">
				{messages.length === 0 && (
					<div className="text-gray-500 text-center py-4">
						<p>Click on any button above to ask a question about my CV,</p>
						<p className="text-sm">or type your own question below!</p>
					</div>
				)}
				{messages.map((message, index) => (
					<div
						key={index}
						className={`p-2 rounded ${
							message.role === "user" ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"
						}`}
					>
						<div className="font-semibold text-sm mb-1">
							{message.role === "user" ? "You" : "Assistant"}
						</div>
						<div className="text-sm">{message.content}</div>
					</div>
				))}
				{isLoading && (
					<div className="bg-gray-100 mr-8 p-2 rounded">
						<div className="font-semibold text-sm mb-1">Assistant</div>
						<div className="text-sm">Thinking...</div>
					</div>
				)}
			</div>

			{/* Input form */}
			<form onSubmit={handleSubmit} className="flex gap-2">
				<input
					type="text"
					value={question}
					onChange={(e) => setQuestion(e.target.value)}
					placeholder="Ask a question about my CV..."
					className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
					disabled={isLoading}
				/>
				<button
					type="submit"
					disabled={!question.trim() || isLoading}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{isLoading ? "Asking..." : "Ask"}
				</button>
			</form>
		</div>
	);
}
