import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import fs from 'fs';
export default defineConfig({
  ssr: false,
  vite: {
    server: {
      https: {
        key: fs.readFileSync('./.cert/key.pem'),
        cert: fs.readFileSync('./.cert/cert.pem'),
      }
    },
    plugins: [
      tailwindcss(),
    ],
    ssr: {
      noExternal: ['@googlemaps/markerclusterer']
    },
  }
});
