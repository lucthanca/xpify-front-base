import fetch from "node-fetch";
import https from 'https';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const getSchemaTypesGql = `
query {
  __schema {
      types {
          kind
          name
          possibleTypes {
              name
          }
      }
  }
}
`;

/**
 * Generate, from schema, the possible types.
 *
 * https://www.apollographql.com/docs/react/data/fragments/#generating-possibletypes-automatically
 * @returns {Object}  This object maps the name of an interface or union type (the supertype) to the types that implement or belong to it (the subtypes).
 */
const getPossibleTypes = async () => {
    const data = await getSchemaTypes();

    const possibleTypes = {};

    data.__schema.types.forEach(supertype => {
        if (supertype.possibleTypes) {
            possibleTypes[supertype.name] = supertype.possibleTypes.map(subtype => subtype.name);
        }
    });

    return possibleTypes;
};

/**
 * Get the schema's types.
 */
const getSchemaTypes = () => {
    return fetchQuery(getSchemaTypesGql);
};

const fetchQuery = query => {
    const backendUrl = process.env.XPIFY_BACKEND_URL || process.env.VITE_XPIFY_BACKEND_URL;
    if (!backendUrl) {
        return Promise.reject(new Error('API endpoint missing!'));
    }
    const targetURL = new URL('graphql', backendUrl);
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
        Accept: 'application/json',
        'User-Agent': 'xpify-buildpack',
        Host: targetURL.host,
    };

    // debug('Fetching query: %s', query);

    return fetch(targetURL.toString(), {
        agent: targetURL.protocol === 'https:' ? httpsAgent : null,
        body: JSON.stringify({ query }),
        headers: headers,
        method: 'POST',
    })
        .then(result => {
            // debug('Result received');
            // debug('Status: %s', result.status);
            return result.json();
        })
        .catch(err => {
            // debug('Error received: %s', err);
            console.error(err);
            throw err;
        })
        .then(json => {
            if (json && json.errors && json.errors.length > 0) {
                console.warn('\x1b[36m%s\x1b[0m', json.errors[0].debugMessage);
                // console.warn(
                //   '\x1b[36m%s\x1b[0m',
                //   'As of version 12.1.0, PWA Studio requires the appropriate PWA metapackage to be installed on the backend.\n' +
                //   'For more information, refer to the 12.1.0 release notes here: https://github.com/magento/pwa-studio/releases/tag/v12.1.0',
                // );

                return Promise.reject(new Error(json.errors[0].message + ` (... ${json.errors.length} errors total)`));
            }

            return json.data;
        });
};

export default {
    getPossibleTypes,
};
