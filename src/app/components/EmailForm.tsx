"use client";

// src/app/components/EmailForm.tsx
import { useForm } from "react-hook-form";
import { useState } from "react";

interface EmailFormData {
	recipient: string;
	subject: string;
	body: string;
}

export default function EmailForm() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EmailFormData>();
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const sendEmail = async (data: EmailFormData) => {
		setIsLoading(true);
		setMessage(null);

		try {
			const response = await fetch("/api/email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				setMessage({
					type: "success",
					text: result.message || "Email sent successfully!",
				});
				reset(); // Clear the form
			} else {
				setMessage({
					type: "error",
					text: result.error || "Failed to send email",
				});
			}
		} catch (error) {
			console.error("Email sending error:", error);
			setMessage({
				type: "error",
				text: "Failed to send email. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
			<div className="p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
						<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.945a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>
					<h2 className="text-xl font-semibold text-gray-900">Send Email</h2>
				</div>
			</div>

			<div className="p-6">
				{/* Success/Error Message */}
				{message && (
					<div
						className={`mb-6 p-4 rounded-xl border ${
							message.type === "success"
								? "bg-green-50 text-green-800 border-green-200"
								: "bg-red-50 text-red-800 border-red-200"
						} transition-all duration-200`}
					>
						<div className="flex items-center gap-2">
							{message.type === "success" ? (
								<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
							) : (
								<svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							)}
							<span className="font-medium">{message.text}</span>
						</div>
					</div>
				)}

				<form onSubmit={handleSubmit(sendEmail)} className="space-y-6">
					{/* Recipient Field */}
					<div>
						<label htmlFor="recipient" className="block text-sm font-semibold mb-2 text-gray-700">
							Recipient Email
						</label>
						<input
							id="recipient"
							type="email"
							{...register("recipient", {
								required: "Recipient email is required",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Please enter a valid email address",
								},
							})}
							placeholder="recipient@example.com"
							className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
							disabled={isLoading}
						/>
						{errors.recipient && (
							<p className="text-red-600 text-sm mt-2 flex items-center gap-1">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								{errors.recipient.message}
							</p>
						)}
					</div>

					{/* Subject Field */}
					<div>
						<label htmlFor="subject" className="block text-sm font-semibold mb-2 text-gray-700">
							Subject
						</label>
						<input
							id="subject"
							type="text"
							{...register("subject", { required: "Subject is required" })}
							placeholder="Email subject"
							className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
							disabled={isLoading}
						/>
						{errors.subject && (
							<p className="text-red-600 text-sm mt-2 flex items-center gap-1">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								{errors.subject.message}
							</p>
						)}
					</div>

					{/* Body Field */}
					<div>
						<label htmlFor="body" className="block text-sm font-semibold mb-2 text-gray-700">
							Message
						</label>
						<textarea
							id="body"
							{...register("body", { required: "Message is required" })}
							placeholder="Email message"
							rows={5}
							className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none"
							disabled={isLoading}
						/>
						{errors.body && (
							<p className="text-red-600 text-sm mt-2 flex items-center gap-1">
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								{errors.body.message}
							</p>
						)}
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm hover:shadow-md disabled:shadow-none hover:scale-105 disabled:scale-100"
					>
						{isLoading ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Sending...</span>
							</div>
						) : (
							<div className="flex items-center justify-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
								<span>Send Email</span>
							</div>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
