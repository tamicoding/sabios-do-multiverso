import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  define: {
    __HAS_TRANSLATE_PROXY__: JSON.stringify(Boolean(process.env.LIBRETRANSLATE_URL)),
  },
  server: {
    proxy: {
      "/api/quotes": {
        target: "https://zenquotes.io",
        changeOrigin: true,
        rewrite: () => "/api/quotes",
      },
      ...(process.env.LIBRETRANSLATE_URL
        ? {
            "/api/translate": {
              target: process.env.LIBRETRANSLATE_URL,
              changeOrigin: true,
              rewrite: () => "",
            },
          }
        : {}),
    },
  },
});
