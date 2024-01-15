import { from, split } from '@apollo/client';
import { retryLink } from '~/Apollo/links/retryLink';
import { gqlCacheLink } from '~/Apollo/links/gqlCacheLink';
import { mutationQueueLink } from '~/Apollo/links/mutationQueueLink';
import { httpLink, httpLinkWithoutAuthFetch } from '~/Apollo/links/httpLink';
import { xAppLink } from '~/Apollo/links/xAppLink';
import { useAppBridge } from "@shopify/app-bridge-react";
import { checkForReauthorizationLink } from '~/Apollo/links/checkForReauthorizationLink';

export const useLinks = (uri) => {
  const app = useAppBridge();
  return {
    getLinks: () => from([
      checkForReauthorizationLink(app),
      mutationQueueLink(),
      retryLink(),
      xAppLink(),
      gqlCacheLink(),
      split(
        (operation) => operation.getContext().noAuth === undefined || operation.getContext().noAuth === false,
        httpLink(uri, app),
        httpLinkWithoutAuthFetch(uri)
      ),
    ])
  };
};
