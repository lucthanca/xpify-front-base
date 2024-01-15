import { updateEnvFile } from '@xpify/buildpack/src/env.js';
import { BackendUrl, XPIFY_BACKEND_URL } from './backendUrlInput.js';
import { outputInfo } from '@shopify/cli-kit/node/output';

/**
 * Ensures the backend URL for the Xpify application.
 * If the backend URL is not set in the environment variables, it prompts the user to enter it.
 * If the backend URL is not set in the dotenv variables, it updates the dotenv file with the backend URL.
 *
 * @async
 * @param {ShopifyAppConfig} config - The configuration object.
 * @returns {Promise<void>}
 */
export const ensureBackendUrl = async (config) => {
  const { localApp } = config;
  const { dotenv } = localApp;
  const backendUrl = new BackendUrl(config);
  process.env[XPIFY_BACKEND_URL] = await backendUrl.input();
  if (!dotenv.variables[XPIFY_BACKEND_URL] || process.env[XPIFY_BACKEND_URL] !== dotenv.variables[XPIFY_BACKEND_URL]) {
    const output = await updateEnvFile(dotenv.path, { [XPIFY_BACKEND_URL]: process.env[XPIFY_BACKEND_URL] });
    outputInfo(output);
  }
};