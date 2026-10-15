import { defineConfig } from "vite";

export default defineConfig({
  base: "/njsnj/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
        },
      },
    },
  },
});
