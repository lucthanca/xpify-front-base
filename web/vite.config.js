import { defineConfig, splitVendorChunkPlugin, loadEnv } from "vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";
import buildpack from './src/utils/buildpack';
import { renderAutocompletePrompt, renderConfirmationPrompt, renderTextPrompt } from '@shopify/cli-kit/node/ui';
import { joinPath } from '@shopify/cli-kit/node/path';
import { slugify } from '@shopify/cli-kit/common/string';

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

// async function promptName() {
//   // const separator = defaultName.includes(' ') ? ' ' : '-';
//   return renderTextPrompt({
//     message: `Điền khoá bảo mật để fetch config của app ${'aaa'}:`,
//     defaultValue: '',
//   });
// }

// const prompTest = async () => {
//   const id = await renderTextPrompt({
//     message: 'Place build secret?',
//     choices: orgList,
//   });
// }

export default defineConfig(async ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const possibleTypes = await buildpack.getPossibleTypes();
  if (!process.env.SHOPIFY_API_KEY) {
    process.env.SHOPIFY_API_KEY = process.env.VITE_SHOPIFY_API_KEY
  }
  // console.log({ sdsd: process.env });
  // const test = await promptName();
  console.log({ env: process.env });
  return {
    root: dirname(fileURLToPath(import.meta.url)),
    plugins: [react(), splitVendorChunkPlugin()],
    define: {
      "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
      XPIFY_POSSIBLE_TYPES: JSON.stringify(possibleTypes),
    },
    resolve: {
      preserveSymlinks: true,
      alias: {
        '~': resolve(__dirname, './src'),
      },
    },
    server: {
      host: "localhost",
      port: process.env.FRONTEND_PORT,
      hmr: hmrConfig,
    },
  }
});
