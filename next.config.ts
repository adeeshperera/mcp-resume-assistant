import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["pdf-parse"],
	webpack: (config) => {
		// Handle canvas module for pdf-parse
		config.resolve.alias.canvas = false;
		return config;
	},
};

export default nextConfig;
