import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 4001
	},
	output: "server",
	adapter: node({
		mode: "standalone"
	}),
	experimental: {
		assets: true
	},
	integrations: [react()],
	vite: {
		plugins: [vanillaExtractPlugin()]
	}
});
