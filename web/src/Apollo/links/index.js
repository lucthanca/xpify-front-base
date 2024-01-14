import { from, split } from '@apollo/client';
import { authLink } from '~/Apollo/links/authLink';
import { retryLink } from '~/Apollo/links/retryLink';
import { gqlCacheLink } from '~/Apollo/links/gqlCacheLink';
import { mutationQueueLink } from '~/Apollo/links/mutationQueueLink';
import { httpLink, httpLinkWithoutAuthFetch } from '~/Apollo/links/httpLink';
import { xAppLink } from '~/Apollo/links/xAppLink';
import {useAppBridge} from "@shopify/app-bridge-react";

export const useLinks = (uri) => {
  const app = useAppBridge();
  return {
    getLinks: () => from([
      mutationQueueLink(),
      retryLink(),
      // authLink(),
      xAppLink(),
      gqlCacheLink(),
      split(
        (operation) => operation.getContext().withoutAuth === undefined || operation.getContext().withoutAuth === false,
        httpLink(uri, app),
        httpLinkWithoutAuthFetch(uri)
      ),
    ])
  };
};

export const getLinks = (uri) => from([
  mutationQueueLink(),
  retryLink(),
  authLink(),
  xAppLink(),
  gqlCacheLink(),
  split(
    (operation) => operation.getContext().withoutAuth === undefined || operation.getContext().withoutAuth === false,
    httpLink(uri),
    httpLinkWithoutAuthFetch(uri)
  ),
]);
