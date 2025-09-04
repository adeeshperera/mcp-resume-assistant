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
		<div className="border rounded-lg p-4">
			<h2 className="text-xl font-semibold mb-4">Send Email</h2>

			{/* Success/Error Message */}
			{message && (
				<div
					className={`mb-4 p-3 rounded ${
						message.type === "success"
							? "bg-green-100 text-green-700 border border-green-300"
							: "bg-red-100 text-red-700 border border-red-300"
					}`}
				>
					{message.text}
				</div>
			)}

			<form onSubmit={handleSubmit(sendEmail)} className="space-y-4">
				{/* Recipient Field */}
				<div>
					<label htmlFor="recipient" className="block text-sm font-medium mb-1">
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
						className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={isLoading}
					/>
					{errors.recipient && (
						<p className="text-red-500 text-sm mt-1">
							{errors.recipient.message}
						</p>
					)}
				</div>

				{/* Subject Field */}
				<div>
					<label htmlFor="subject" className="block text-sm font-medium mb-1">
						Subject
					</label>
					<input
						id="subject"
						type="text"
						{...register("subject", { required: "Subject is required" })}
						placeholder="Email subject"
						className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={isLoading}
					/>
					{errors.subject && (
						<p className="text-red-500 text-sm mt-1">
							{errors.subject.message}
						</p>
					)}
				</div>

				{/* Body Field */}
				<div>
					<label htmlFor="body" className="block text-sm font-medium mb-1">
						Message
					</label>
					<textarea
						id="body"
						{...register("body", { required: "Message is required" })}
						placeholder="Email message"
						rows={4}
						className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={isLoading}
					/>
					{errors.body && (
						<p className="text-red-500 text-sm mt-1">{errors.body.message}</p>
					)}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isLoading}
					className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
				>
					{isLoading ? "Sending..." : "Send Email"}
				</button>
			</form>
		</div>
	);
}
