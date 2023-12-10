import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webExtension from "@samrum/vite-plugin-web-extension";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import { injectReactDevTools } from "./inject-react-devtools";
import { getManifest } from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), "");

  return {
    resolve: {
      alias: {
        "~": resolve(__dirname, "./src/"),
      },
    },
    cacheDir: "../../node_modules/.vite/web-extension",
    plugins: [
      react({
        babel: {
          babelrc: true,
        },
      }),
      nxViteTsPaths(),
      webExtension({
        manifest: getManifest("chrome"),
      }),
      mode !== "production" && injectReactDevTools(),
    ],
  };
});
