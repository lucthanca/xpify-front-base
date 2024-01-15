import { createHttpLink } from '@apollo/client';
import { stripIgnoredCharacters } from 'graphql/utilities/stripIgnoredCharacters';
import { authenticatedFetch } from "@shopify/app-bridge/utilities";

const shrinkQuery = (fullURL) => {
  const url = new URL(fullURL);

  // Read from URL implicitly decodes the querystring
  const query = url.searchParams.get('query');
  if (!query) {
    return fullURL;
  }

  const strippedQuery = stripIgnoredCharacters(query);

  // URLSearchParams.set will use application/x-www-form-urlencoded encoding
  url.searchParams.set('query', strippedQuery);

  return url.toString();
}

const customFetchToShrinkQuery = (uri, options) => {
  // TODO: add `ismorphic-fetch` or equivalent to avoid this error
  if (typeof globalThis.fetch !== 'function') {
    console.error('This environment does not define `fetch`.');
    return () => {};
  }

  const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;

  return globalThis.fetch(resource, options);
};

export const httpLink = (uri, app) => {
  const fetchFunction = authenticatedFetch(app);

  /**
   * A function that returns an auth-aware fetch function.
   * @desc The returned fetch function that matches the browser's fetch API
   * See: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
   * It will provide the following functionality:
   *
   * Add a `X-Shopify-Access-Token` header to the request.
   *
   * @returns {Function} fetch function
   */
  const authenticatedFetchToShrinkQuery = async (uri, options) => {
    const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;
    return await fetchFunction(resource, options);
  };

  return createHttpLink({
    fetch: authenticatedFetchToShrinkQuery,
    useGETForQueries: true,
    uri,
  });
};

export const httpLinkWithoutAuthFetch = (uri) => {
  return createHttpLink({
    fetch: customFetchToShrinkQuery,
    useGETForQueries: true,
    uri,
  });
}
