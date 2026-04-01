/* global process */

import path from "node:path";
import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";

export default defineConfig({
    // Github Pages
	base: process.env.BASE_URL ?? "/portugolweb/",
	plugins: [
		legacy({
			targets: ['chrome >= 60', 'edge >= 79', 'safari >= 11.1', 'firefox >= 67'],
			renderLegacyChunks: true,
			modernPolyfills: true,
		}),
	],
	build: {
		manifest: true,
		outDir: "dist",
		emptyOutDir: true,
		// Usar terser para ter suporte a mais navegadores (webview...)
		minify: 'terser',
		terserOptions: {
			ecma: 2017,
			compress: {
				passes: 2,
			},
			format: {
				webkit: true
			}
		},
		rollupOptions: {
			input: {
				index: path.resolve("index.html")
			}
		}
	}
});