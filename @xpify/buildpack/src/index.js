import { renderError } from '@shopify/cli-kit/node/ui';
import { AbortSilentError } from '@shopify/cli-kit/node/error';
import { ensureXpifyApp } from './app.js';
import { ensureSecretKey } from './backendAuth/index.js';
import { ensureBackendUrl } from './backendEndpoint/index.js';
import { XPIFY_BACKEND_URL } from './backendEndpoint/backendUrlInput.js';


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
 * @property {ShopifyLocalAppDotEnv|undefined} dotenv
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
	// console.log(config.localApp.configuration);
	if (!config.localApp.dotenv) {
		renderError({
			headline: "Không tìm thấy file .env. Tạo file .env trong thư mục gốc của app trước.",
			body: [
				"Chú ý:",
				"Nếu đang sử dụng file config dạng shopify.app.toml, thì file env sẽ là .env",
				"nhưng nếu mà file config lại là dạng shopify.app.[app_name].toml thì file env sẽ là .env.[app_name]",
				"Ví dụ: file config là: shopify.app.section-builder.toml thì file env sẽ là .env.section-builder",
			],
		});
		throw new AbortSilentError();
	}
	await ensureBackendUrl(config);
	await ensureSecretKey(config);
	await ensureXpifyApp(config);
};

/**
 * This function is used to ensure the whitelist of redirect URLs for the Xpify application.
 * It takes an array of URLs, maps through each URL, and modifies the host and pathname of the URL if certain conditions are met.
 *
 * @param {Array<string>} urls - An array of URLs that need to be checked and possibly modified.
 * @returns {Array<string>} An array of modified URLs, with the host replaced with the value of `process.env.XPIFY_BACKEND_URL` and the pathname appended with `/_rid/${process.env.XPIFY_APP_REMOTE_ID}` if the original pathname was `/api/auth/callback`. URLs that did not meet the condition are removed from the array.
 */
export const ensureXpifyRedirectUrlWhitelist = (urls) => {
	return urls.map(url => {
		// replace url host with process.env.XPIFY_BACKEND_URL
		const urlObject = new URL(url);
		if (urlObject.pathname === '/api/auth/callback') {
			urlObject.pathname = `/api/auth/callback/_rid/${process.env.XPIFY_APP_REMOTE_ID}`;
			urlObject.host = new URL(process.env[XPIFY_BACKEND_URL]).host;
			return urlObject.toString();
		}
		return null;
	}).filter(url => url !== null);
}
