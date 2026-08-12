import { defineConfig } from "vitest/config";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { readFile } from "node:fs/promises";
import path from "path";

const configDir = import.meta.dirname;
const mswWorkerPath = path.resolve(configDir, "src/mocks/mockServiceWorker.js");

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    {
      name: "serve-msw-worker",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use(
          "/mockServiceWorker.js",
          async (request, response, next) => {
            if (request.method !== "GET") {
              next();
              return;
            }

            try {
              response.setHeader("Content-Type", "application/javascript");
              response.setHeader("Cache-Control", "no-cache");
              response.end(await readFile(mswWorkerPath));
            } catch (error) {
              next(error);
            }
          },
        );
      },
    },
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(configDir, "src") },
      {
        find: "styled-system",
        replacement: path.resolve(configDir, "./styled-system"),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
