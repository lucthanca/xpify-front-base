import { renderTextPrompt } from '@shopify/cli-kit/node/ui';
import { outputInfo } from '@shopify/cli-kit/node/output';
import { updateEnvFile } from "@xpify/buildpack/src/env.js";
import { renderError } from '@shopify/cli-kit/node/ui';
import { AbortSilentError } from '@shopify/cli-kit/node/error';
import { verifyToken, healthCheck } from './verifier.js';
import { ensureXpifyApp } from './app.js';

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
				"Ví dụ:",
				"cp .env.example .env",
			],
		});
		throw new AbortSilentError();
	}
	await ensureBackendUrl(config);
	await ensureSecretKey(config);

	await ensureXpifyApp(config);
};

class SecretKey {
	constructor(config) {
		this.config = config;
	}

	async input(forceSecretPrompt = false) {
		const { remoteApp, localApp } = this.config;
		const { title } = remoteApp;
		let i = process.env.XPIFY_SECRET_KEY || localApp.dotenv.variables.XPIFY_SECRET_KEY;
		if (forceSecretPrompt || !i) {
			i = await renderTextPrompt({
				message: `Điền khoá bảo mật để fetch config của app ${title}:`,
				defaultValue: '',
			});
		}
		try {
			await verifyToken(i, title);
		} catch (e) {
			if (e.message === 'x-graphql-authorization') {
				renderError({
					headline: "Khoá bảo mật không hợp lệ hoặc đã hết hạn.",
					body: [
						"Vui lòng kiểm tra lại khoá bảo mật.",
					],
				});
				return await this.input(true);
			}
		}
		return i;
	}
}

class BackendUrl {
	constructor(config) {
		this.config = config;
	}
	async input(forceBackendUrlPrompt = false) {
		const { localApp } = this.config;
		const { dotenv } = localApp;
		let i = process.env.XPIFY_BACKEND_URL || dotenv.variables.XPIFY_BACKEND_URL;
		if (forceBackendUrlPrompt || !i) {
			i = await renderTextPrompt({
				message: `Điền XPIFY_BACKEND_URL:`,
				defaultValue: '',
			});
		}
		try {
			await healthCheck(i);
		} catch (e) {
			if (e.message === 'x-graphql-timeout') {
				renderError({
					headline: "Không truy cập được URL.",
					body: [
						"Kiểm tra xem site có đang chạy không.",
					],
				});
			}
			return await this.input(true);
		}
		return i;
	}
}

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
	const secretKey = new SecretKey(config);
	process.env.XPIFY_SECRET_KEY = await secretKey.input();

	if (!dotenv.variables.XPIFY_SECRET_KEY || process.env.XPIFY_SECRET_KEY !== dotenv.variables.XPIFY_SECRET_KEY) {
		const output = await updateEnvFile(dotenv.path, { XPIFY_SECRET_KEY: process.env.XPIFY_SECRET_KEY });
		outputInfo(output);
	}
}

export const ensureXpifyRedirectUrlWhitelist = (urls) => {
	return urls.map(url => {
		// replace url host with process.env.XPIFY_BACKEND_URL
		const urlObject = new URL(url);
		if (urlObject.pathname === '/api/auth/callback') {
			urlObject.pathname = `/api/auth/callback/_rid/${process.env.XPIFY_APP_REMOTE_ID}`
		}
		urlObject.host = new URL(process.env.XPIFY_BACKEND_URL).host;
		return urlObject.toString();
	});
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
	const backendUrl = new BackendUrl(config);
	process.env.XPIFY_BACKEND_URL = await backendUrl.input();
	if (!dotenv.variables.XPIFY_BACKEND_URL || process.env.XPIFY_BACKEND_URL !== dotenv.variables.XPIFY_BACKEND_URL) {
		const output = await updateEnvFile(dotenv.path, { XPIFY_BACKEND_URL: process.env.XPIFY_BACKEND_URL });
		outputInfo(output);
	}
};
