/* global process */

import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    // Github Pages
	base: process.env.BASE_URL ?? "/portugolweb/",
	build: {
		manifest: true,
		outDir: "dist",
		emptyOutDir: true,
		// Usar terser para ter suporte a mais navegadores (webview...)
		minify: 'terser',
		terserOptions: {
			ecma: 5,
			ie8: true,
			safari10: true,
			format: {
				max_line_len: 500,
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