// src/app/components/Layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-50">
			<main>{children}</main>
		</div>
	);
}
