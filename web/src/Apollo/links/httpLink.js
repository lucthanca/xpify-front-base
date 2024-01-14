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
  // const authenticatedFetch = useAuthenticatedFetch();
  // const fetch = async () => {
  //   const resource = options.method === 'GET' ? shrinkQuery(uri) : uri
  //   const response = await authenticatedFetch(resource, options);
  //   return response.json();
  // };
  //
  // return fetch();
  // TODO: add `ismorphic-fetch` or equivalent to avoid this error
  if (typeof globalThis.fetch !== 'function') {
    console.error('This environment does not define `fetch`.');
    return () => {};
  }

  const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;

  return globalThis.fetch(resource, options);
};

const customFetchToShrinkQueryNoAuth = (uri, options) => {
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

  const fetchWithShopifySessionAuth = async (uri, options) => {
    const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;
    return await fetchFunction(resource, options);
    // checkHeadersForReauthorization(response.headers, app);
    // return response;
  };

  return createHttpLink({
    fetch: fetchWithShopifySessionAuth,
    useGETForQueries: true,
    uri,
  });
};

export const httpLinkWithoutAuthFetch = (uri) => {
  return createHttpLink({
    fetch: customFetchToShrinkQueryNoAuth,
    useGETForQueries: true,
    uri,
  });
}
