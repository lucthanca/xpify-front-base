import { createHttpLink } from '@apollo/client';
import { stripIgnoredCharacters } from 'graphql/utilities/stripIgnoredCharacters';

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

export const httpLink = (uri) => {
  return createHttpLink({
    fetch: customFetchToShrinkQuery,
    useGETForQueries: true,
    uri,
  });
};
