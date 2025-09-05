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
		<div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 h-[600px] flex flex-col overflow-hidden">
			<div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
						<svg
							className="w-4 h-4 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-semibold text-gray-900">
						Ask About My CV
					</h2>
				</div>
				<div className="flex gap-2">
					{messages.length > 0 && (
						<button
							onClick={() => setShowQuickQuestions(!showQuickQuestions)}
							className="px-3 py-1.5 text-sm font-medium bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all duration-200 hover:scale-105"
						>
							{showQuickQuestions ? "Hide" : "Show"} Quick Questions
						</button>
					)}
					{messages.length > 0 && (
						<button
							onClick={clearChat}
							className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
						>
							Clear Chat
						</button>
					)}
				</div>
			</div>

			{/* Predefined Question Buttons */}
			{(messages.length === 0 || showQuickQuestions) && (
				<div className="p-6 pt-4 border-b border-gray-100">
					<p className="text-sm font-medium text-gray-700 mb-4">
						Quick questions to ask:
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{predefinedQuestions.map((item, index) => (
							<button
								key={index}
								onClick={() => handlePredefinedQuestion(item.question)}
								disabled={isLoading}
								className="text-left px-4 py-3 text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 hover:scale-105 hover:shadow-md"
							>
								<span className="text-base mr-2">
									{item.label.split(" ")[0]}
								</span>
								<span className="text-gray-700">{item.label.substring(2)}</span>
							</button>
						))}
					</div>
					{messages.length === 0 && (
						<div className="mt-4 text-center">
							<div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
								<span>OR</span>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Chat messages */}
			<div className="flex-1 overflow-y-auto p-6 space-y-4">
				{messages.length === 0 && (
					<div className="text-gray-500 text-center py-12">
						<div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
							<svg
								className="w-8 h-8 text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
						<p className="text-lg font-medium mb-2">
							Ready to chat about my CV!
						</p>
						<p className="text-sm">
							Click on any quick question above or type your own question below.
						</p>
					</div>
				)}
				{messages.map((message, index) => (
					<div
						key={index}
						className={`flex ${
							message.role === "user" ? "justify-end" : "justify-start"
						} animate-fadeInUp`}
					>
						<div
							className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
								message.role === "user"
									? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
									: "bg-gray-50 border border-gray-200"
							}`}
						>
							<div
								className={`font-semibold text-xs mb-2 ${
									message.role === "user" ? "text-blue-100" : "text-gray-500"
								}`}
							>
								{message.role === "user" ? "You" : "Assistant"}
							</div>
							<div
								className={`text-sm leading-relaxed whitespace-pre-wrap ${
									message.role === "user" ? "text-white" : "text-gray-900"
								}`}
							>
								{message.content}
							</div>
						</div>
					</div>
				))}
				{isLoading && (
					<div className="flex justify-start">
						<div className="max-w-[80%] p-4 rounded-2xl shadow-sm bg-gray-50 border border-gray-200">
							<div className="font-semibold text-xs mb-2 text-gray-500">
								Assistant
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="flex gap-1">
									<div
										className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style={{ animationDelay: "0ms" }}
									></div>
									<div
										className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style={{ animationDelay: "150ms" }}
									></div>
									<div
										className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
										style={{ animationDelay: "300ms" }}
									></div>
								</div>
								<span className="text-gray-600">Thinking...</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Input form */}
			<div className="p-6 border-t border-gray-100 bg-gray-50/50">
				<form onSubmit={handleSubmit} className="flex gap-3">
					<div className="flex-1 relative">
						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							placeholder="Ask a question about my CV..."
							className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
							disabled={isLoading}
						/>
					</div>
					<button
						type="submit"
						disabled={!question.trim() || isLoading}
						className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:shadow-none hover:scale-105 disabled:scale-100"
					>
						{isLoading ? (
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Asking...</span>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
									/>
								</svg>
								<span>Ask</span>
							</div>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
