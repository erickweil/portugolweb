import { cpSync, existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    // Github Pages
	base: process.env.BASE_URL ?? "/portugolweb/",
	build: {
		manifest: true,
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			input: {
				index: path.resolve("index.html")
			}
		}
	}
});