import { createHttpLink } from '@apollo/client';
import { stripIgnoredCharacters } from 'graphql/utilities/stripIgnoredCharacters';
import { authenticatedFetch } from "@shopify/app-bridge/utilities";
import { Redirect } from '@shopify/app-bridge/actions';

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

  const authenticatedFetchToShrinkQuery = async (uri, options) => {
    console.log({ options });
    const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;
    const response = await fetchFunction(resource, options);
    checkHeadersForReauthorization(response.headers, app);
    return response;
  };

  return createHttpLink({
    fetch: authenticatedFetchToShrinkQuery,
    useGETForQueries: true,
    uri,
  });
};

function checkHeadersForReauthorization(headers, app) {
  if (headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
    const authUrlHeader = headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url");

    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.REMOTE,
      authUrlHeader.startsWith("/")
        ? `https://${window.location.host}${authUrlHeader}`
        : authUrlHeader
    );
  }
}

export const httpLinkWithoutAuthFetch = (uri) => {
  return createHttpLink({
    fetch: customFetchToShrinkQuery,
    useGETForQueries: true,
    uri,
  });
}
