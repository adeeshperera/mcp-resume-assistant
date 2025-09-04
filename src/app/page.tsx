// src/app/page.tsx
import ChatInterface from "./components/ChatInterface";
import EmailForm from "./components/EmailForm";

export default function PlaygroundPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto p-6 max-w-6xl">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold mb-4 text-gray-800">
						MCP Server Playground
					</h1>
					<p className="text-lg text-gray-600 mb-6">
						A Model Context Protocol server that can chat about my CV and send
						email notifications
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					<div className="space-y-6">
						<ChatInterface />
					</div>

					<div className="space-y-6">
						<EmailForm />
					</div>
				</div>

				<footer className="mt-12 text-center text-gray-500 text-sm">
					<p>Built with Next.js, TypeScript, and Model Context Protocol</p>
					<p className="mt-2">
						Created by Adeesh Perera •
						<a
							href="mailto:adeesh.perera@outlook.com"
							className="ml-1 text-blue-600 hover:underline"
						>
							adeesh.perera@outlook.com
						</a>
					</p>
				</footer>
			</div>
		</div>
	);
}
