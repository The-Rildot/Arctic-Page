import { defineConfig } from "vite";

// Use base: "/your-repo-name/" when hosting on GitHub Pages as a project site (see docs/DEPLOY.md).
export default defineConfig({
  base: "/",
  server: {
    port: 5173
  }
});
