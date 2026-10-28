import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		port: 3000,
		host: true,
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		varlockVitePlugin({ ssrInjectMode: "resolved-env" }),
		tailwindcss(),
		tanstackStart(),
		nitro({
			rolldownConfig: {
				onLog(level, log, defaultHandler) {
					if (log.code === "MODULE_LEVEL_DIRECTIVE") return;
					defaultHandler(level, log);
				},
			},
		}),
		viteReact(),
	],
});
