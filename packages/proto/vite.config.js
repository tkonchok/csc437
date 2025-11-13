import { defineConfig } from "vite";

export default defineConfig({
  root: ".",             // serve current folder
  publicDir: "public",   // static assets
  server: {
    port: 5173,
    open: true
  }
});