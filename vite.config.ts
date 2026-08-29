// @lovable.dev/vite-tanstack-config already includes:
// - tanstackStart
// - viteReact
// - tailwindcss
// - tsConfigPaths
// - nitro
// - Lovable preview configuration

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "node-server",
  },

  tanstackStart: {
    // Redirect TanStack Start's bundled server entry
    // to src/server.ts (our SSR error wrapper).
    server: {
      entry: "server",
    },
  },
});
