

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: "/",
  server: {
    watch: {
      ignored: ["/db.json", "/*.db.json"],
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      
    },
  },
});
