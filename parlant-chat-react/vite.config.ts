/* eslint-disable no-undef */
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss(),],
	css: {
		postcss: "./postcss.config.cjs",
	},
	resolve: {
		alias: {
			"@": path.resolve(".", "./src"),
		},
	},
});
