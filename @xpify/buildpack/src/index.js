import { renderTextPrompt } from '@shopify/cli-kit/node/ui';
import { outputInfo } from '@shopify/cli-kit/node/output';
import { updateEnvFile } from "@xpify/buildpack/src/env";

/**
 * @typedef {Object} ShopifyRemoteApp
 * @property {String} id
 * @property {String} title
 * @property {String} apiKey
 * @property {String} apiSecret
 * @property {String} organizationId
 * @property {String} appType
 * @property {Array<string>} grantedScopes
 * @property {String} applicationUrl
 * @property {Array<string>} redirectUrlWhitelist
 * @property {Boolean} developmentStorePreviewEnabled
 */
/**
 * @typedef {Object} ShopifyLocalAppDotEnv
 * @property {String} path
 * @property {Object} variables
 */
/**
 * @typedef {Object} ShopifyLocalApp
 * @property {String} name
 * @property {String} idEnvironmentVariableName
 * @property {String} directory
 * @property {String} packageManager
 * @property {ShopifyLocalAppDotEnv} dotenv
 */
/**
 * @typedef {Object} ShopifyAppConfig
 * @property {String} storeFqdn
 * @property {String} storeId
 * @property {ShopifyRemoteApp} remoteApp
 * @property {ShopifyLocalApp} localApp
 */

/**
 * Ensures the backend URL and secret key for the Xpify application.
 *
 * @async
 * @param {ShopifyAppConfig} config - The configuration object.
 * @returns {Promise<void>}
 */
export const ensureXpifyDev = async (config) => {
	console.log(config);
	await ensureBackendUrl(config);
	await ensureSecretKey(config);
};

/**
 * Ensures the secret key for the Xpify application.
 * If the secret key is not set in the environment variables, it prompts the user to enter it.
 * If the secret key is not set in the dotenv variables, it updates the dotenv file with the secret key.
 *
 * @async
 * @param {ShopifyAppConfig} config - The configuration object.
 * @returns {Promise<void>}
 */
const ensureSecretKey = async (config) => {
	const { localApp, remoteApp } = config;
	const { dotenv } = localApp;
	if (!process.env.XPIFY_SECRET_KEY) {
		process.env.XPIFY_SECRET_KEY = dotenv.variables.XPIFY_SECRET_KEY || await renderTextPrompt({
			message: `Điền khoá bảo mật để fetch config của app ${remoteApp.title}:`,
			defaultValue: '',
		});

		if (!dotenv.variables.XPIFY_SECRET_KEY) {
			const output = await updateEnvFile(dotenv.path, { XPIFY_SECRET_KEY: process.env.XPIFY_SECRET_KEY });
			outputInfo(output);
		}
	}
}

/**
 * Ensures the backend URL for the Xpify application.
 * If the backend URL is not set in the environment variables, it prompts the user to enter it.
 * If the backend URL is not set in the dotenv variables, it updates the dotenv file with the backend URL.
 *
 * @async
 * @param {ShopifyAppConfig} config - The configuration object.
 * @returns {Promise<void>}
 */
const ensureBackendUrl = async (config) => {
	const { localApp } = config;
	const { dotenv } = localApp;
	if (!process.env.XPIFY_BACKEND_URL) {
		process.env.XPIFY_BACKEND_URL = dotenv.variables.XPIFY_BACKEND_URL || await renderTextPrompt({
			message: `Điền XPIFY_BACKEND_URL:`,
			defaultValue: '',
		});

		if (!dotenv.variables.XPIFY_BACKEND_URL) {
			const output = await updateEnvFile(dotenv.path, { XPIFY_BACKEND_URL: process.env.XPIFY_BACKEND_URL });
			outputInfo(output);
		}
	}
};
