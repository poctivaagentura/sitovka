import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://sitovka.net",
  output: "static",
  adapter: netlify(),
  integrations: [react()],
  server: {
    port: 4321,
    host: true, // Listens on all addresses (0.0.0.0)
    allowedHosts: [
      "localhost",
      "*.localhost",
      ".netlify.app",
      ".netlify.com",
      "sitovka.net",
    ],
  },
  vite: {
    server: {
      hmr: {
        path: "/vite-hmr",
      },
    },
    plugins: [
      tailwindcss(),
      svgr({
        svgrOptions: {
          exportType: "default",
          ref: true,
          svgo: true,
          titleProp: true,
        },
        include: "**/*.svg?react",
      }),
    ],
  },
});
