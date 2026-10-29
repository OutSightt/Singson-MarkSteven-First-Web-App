import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The backend only allows requests from http://localhost:5173 (CORS),
// so the dev server must use exactly this port.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
