import { gql } from 'graphql-request';
import { graphqlRequest } from '@shopify/cli-kit/node/api/graphql';
import { renderTasks } from '@shopify/cli-kit/node/ui';
import { XPIFY_BACKEND_URL } from './backendEndpoint/backendUrlInput.js';
import { XPIFY_SECRET_KEY } from './backendAuth/secretKeyInput.js';

const APP_QUERY = gql `
    query GetApp($remoteId: String!) {
        app (field: remote_id, value: $remoteId) {
            id name api_key secret_key scopes api_version
        }
    }
`;
const CREATE_APP_MUTATION = gql `
    mutation CreateApp($input: SaveAppInput!) {
        saveApp(input: $input) {
            id
        }
    }
`;

export async function ensureXpifyApp (config) {
	let app;
	try {
		await renderTasks([
			{
				title: 'Lấy thông tin App từ backend...',
				task: async () => {
					app = await getApp(config);
				},
			},
			{
				title: 'Đồng bộ thông tin App...',
				task: async () => {
					if (app) {
						const changes = {
							api_key: app.api_key !== config.remoteApp.apiKey ? config.remoteApp.apiKey : undefined,
							secret_key: app.secret_key !== config.remoteApp.apiSecret ? config.remoteApp.apiSecret : undefined,
							scopes: app.scopes !== config.localApp.configuration?.['access_scopes']?.scopes ? config.localApp.configuration?.['access_scopes']?.scopes : undefined,
							name: app.name !== config.remoteApp.title ? config.remoteApp.title : undefined,
							api_version: app.api_version !== config.localApp.configuration?.['webhooks']?.['api_version'] ? config.localApp.configuration?.['webhooks']?.['api_version'] : undefined,
						};

						const filteredChanges = Object.fromEntries(Object.entries(changes).filter(([_, v]) => v !== undefined));

						if (Object.keys(filteredChanges).length > 0) {
							await saveApp({ id: app.id, ...filteredChanges }, 'XpifyUpdateApp');
						}
					}
				},
			}
		]);
	} catch (e) {
		if (e.message !== 'x-graphql-no-such-entity')
			throw e;
		await renderTasks([{
			title: 'Tạo App mới...',
			task: async () => {
				app = await createApp(config);
			},
		}]);
	}
	if (!app?.id) {
		throw new Error('Không tạo được app vào backend, check lại!')
	}
	process.env.XPIFY_APP_ID = app.id;
	process.env.XPIFY_APP_REMOTE_ID = config.remoteApp.id;
}

const createApp = async (config) => {
	const { remoteApp, localApp } = config;
	const result = await saveApp({
		name: remoteApp.title,
		api_key: remoteApp.apiKey,
		secret_key: remoteApp.apiSecret,
		remote_id: remoteApp.id,
		scopes: localApp.configuration?.['access_scopes']?.scopes || null,
		api_version: config.localApp.configuration?.['webhooks']?.['api_version'] || '2024-01',
	}, 'XpifyCreateApp');
	if (!result.saveApp?.id) {
		throw new Error('Không tạo được app vào backend, check lại!')
	}
	return result.saveApp;
};

const saveApp = async (input, apiName) => {
	return await graphqlRequest({
		query: CREATE_APP_MUTATION,
		api: apiName,
		url: getBackendEndpoint(),
		token: process.env[XPIFY_SECRET_KEY],
		variables: {
			input,
		},
	});
}

const getApp = async (config) => {
	try {
		const result = await graphqlRequest({
			query: APP_QUERY,
			api: 'XpifyApp',
			url: getBackendEndpoint(),
			token: process.env[XPIFY_SECRET_KEY],
			variables: {
				remoteId: config.remoteApp.id,
			},
		});
		if (result?.app?.id) {
			return result.app;
		}
		throw new Error('x-graphql-no-such-entity');
	} catch (error) {
		if (error.constructor.name === 'GraphQLClientError') {
			if (error.errors?.[0]?.extensions?.category === 'graphql-authorization') {
				throw new Error('Token không hợp lệ, thử lại.');
			}
			if (error.errors?.[0]?.extensions?.category === 'graphql-no-such-entity') {
				throw new Error('x-graphql-no-such-entity');
			}
		}
		throw error;
	}
};

function getBackendEndpoint() {
	return new URL('/graphql', process.env[XPIFY_BACKEND_URL]).href;
}