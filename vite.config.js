import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { translate } from "@vitalets/google-translate-api";

function translateDevMiddleware() {
  return {
    name: "translate-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/translate", async (request, response, next) => {
        if (request.method !== "POST") {
          next();
          return;
        }

        let body = "";
        request.on("data", (chunk) => {
          body += chunk;
        });

        request.on("end", async () => {
          try {
            const payload = JSON.parse(body || "{}");
            const text = payload.text;

            if (!text || typeof text !== "string") {
              response.setHeader("Content-Type", "application/json");
              response.end(JSON.stringify({ translatedText: "" }));
              return;
            }

            const result = await translate(text, { to: "pt" });
            response.setHeader("Content-Type", "application/json");
            response.end(
              JSON.stringify({
                translatedText: typeof result.text === "string" ? result.text : "",
              }),
            );
          } catch {
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ translatedText: "" }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), translateDevMiddleware()],
  server: {
    proxy: {
      "/api/quotes": {
        target: "https://zenquotes.io",
        changeOrigin: true,
        rewrite: () => "/api/quotes",
      },
    },
  },
});
