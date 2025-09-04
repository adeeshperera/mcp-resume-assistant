// src/app/page.tsx
import ChatInterface from "./components/ChatInterface";
import EmailForm from "./components/EmailForm";

export default function PlaygroundPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			<div className="container mx-auto p-6 max-w-7xl">
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
						<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
					</div>
					<h1 className="text-5xl font-bold mb-4 text-gray-900 tracking-tight">
						MCP Server Playground
					</h1>
					<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
						A Model Context Protocol server that can chat about my CV and send
						email notifications
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-8 mb-16">
					<div className="space-y-6">
						<ChatInterface />
					</div>

					<div className="space-y-6">
						<EmailForm />
					</div>
				</div>

				<footer className="text-center text-gray-500 text-sm bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
					<p className="font-medium">Built with Next.js, TypeScript, and Model Context Protocol</p>
					<p className="mt-2 flex items-center justify-center gap-2">
						<span>Created by Adeesh Perera</span>
						<span>•</span>
						<a
							href="mailto:adeesh.perera@outlook.com"
							className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
						>
							adeesh.perera@outlook.com
						</a>
					</p>
				</footer>
			</div>
		</div>
	);
}
