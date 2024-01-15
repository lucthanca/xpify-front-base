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

export const ensureXpifyRedirectUrlWhitelist = (urls) => {
	return urls.map(url => {
		// replace url host with process.env.XPIFY_BACKEND_URL
		const urlObject = new URL(url);
		if (urlObject.pathname === '/api/auth/callback') {
			urlObject.pathname = `/api/auth/callback/_rid/${process.env.XPIFY_APP_REMOTE_ID}`
		}
		urlObject.host = new URL(process.env[XPIFY_BACKEND_URL]).host;
		return urlObject.toString();
	});
}
