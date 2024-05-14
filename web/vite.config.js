import { defineConfig, splitVendorChunkPlugin, loadEnv } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import buildpack from './src/utils/buildpack';

if (
  process.env.npm_lifecycle_event === "build" &&
  !process.env.CI &&
  !process.env.SHOPIFY_API_KEY
) {
  console.warn(
    "\nBuilding the frontend app without an API key. The frontend build will not run without an API key. Set the SHOPIFY_API_KEY environment variable when running the build command.\n"
  );
}

const host = process.env.HOST
  ? process.env.HOST.replace(/https?:\/\//, "")
  : "localhost";

let hmrConfig;
if (host === "localhost") {
  hmrConfig = {
    protocol: "ws",
    host: "localhost",
    port: 64999,
    clientPort: 64999,
  };
} else {
  hmrConfig = {
    protocol: "wss",
    host: host,
    port: process.env.FRONTEND_PORT,
    clientPort: 443,
  };
}

export default defineConfig(async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const possibleTypes = await buildpack.getPossibleTypes();
  if (!process.env.SHOPIFY_API_KEY) process.env.SHOPIFY_API_KEY = process.env.VITE_SHOPIFY_API_KEY;
  if (!process.env.XPIFY_BACKEND_URL) process.env.XPIFY_BACKEND_URL = process.env.VITE_XPIFY_BACKEND_URL
  if (!process.env.XPIFY_APP_ID) process.env.XPIFY_APP_ID = process.env.VITE_XPIFY_APP_ID
  if (!process.env.XPIFY_APP_TOKEN) process.env.XPIFY_APP_TOKEN = process.env.VITE_XPIFY_APP_TOKEN;

  const proxyOptions = {
    target: process.env.XPIFY_BACKEND_URL,
    changeOrigin: true,
    secure: true,
    ws: false,
    headers: {
      'X-Xpify-App-Token': process.env.XPIFY_APP_TOKEN || process.env.VITE_XPIFY_APP_TOKEN,
    },
  };
  return {
    root: dirname(fileURLToPath(import.meta.url)),
    plugins: [react(), splitVendorChunkPlugin()],
    define: {
      "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
      "process.env.XPIFY_BACKEND_URL": JSON.stringify(process.env.XPIFY_BACKEND_URL),
      "process.env.XPIFY_APP_ID": JSON.stringify(process.env.XPIFY_APP_ID),
      "process.env.XPIFY_POSSIBLE_TYPES": JSON.stringify(possibleTypes),
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        '~': resolve(__dirname, './src'),
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          warnings: false,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
      },
    },
    optimizeDeps: {
      force: true,
    },
    server: {
      host: "localhost",
      port: process.env.FRONTEND_PORT,
      hmr: hmrConfig,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate',
        'Content-Security-Policy': "frame-ancestors 'self' https: admin.shopify.com;",
        'X-Frame-Options': 'allow-from https://admin.shopify.com',
      },
      proxy: {
        '^/api(/|(\\?.*)?$)': proxyOptions,
        '^/graphql': proxyOptions,
      },
    },
  }
});
