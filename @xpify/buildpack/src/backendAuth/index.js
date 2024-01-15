import { SecretKey, XPIFY_SECRET_KEY } from './secretKeyInput.js';
import { updateEnvFile } from "@xpify/buildpack/src/env.js";
import { outputInfo } from '@shopify/cli-kit/node/output';

/**
 * Ensures the secret key for the Xpify application.
 * If the secret key is not set in the environment variables, it prompts the user to enter it.
 * If the secret key is not set in the dotenv variables, it updates the dotenv file with the secret key.
 *
 * @async
 * @param {ShopifyAppConfig} config - The configuration object.
 * @returns {Promise<void>}
 */
export const ensureSecretKey = async (config) => {
  const { localApp, remoteApp } = config;
  const { dotenv } = localApp;

  const secretKey = new SecretKey(config);
  process.env[XPIFY_SECRET_KEY] = await secretKey.input();

  if (!dotenv.variables[XPIFY_SECRET_KEY] || process.env[XPIFY_SECRET_KEY] !== dotenv.variables[XPIFY_SECRET_KEY]) {
    const output = await updateEnvFile(dotenv.path, { [XPIFY_SECRET_KEY]: process.env[XPIFY_SECRET_KEY] });
    outputInfo(output);
  }
}