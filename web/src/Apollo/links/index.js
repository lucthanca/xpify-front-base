import { from, split } from '@apollo/client';
import { retryLink } from '~/Apollo/links/retryLink';
import { gqlCacheLink } from '~/Apollo/links/gqlCacheLink';
import { mutationQueueLink } from '~/Apollo/links/mutationQueueLink';
import { httpLink, httpLinkWithoutAuthFetch } from '~/Apollo/links/httpLink';
import { useAppBridge } from "@shopify/app-bridge-react";
import { checkForReauthorizationLink } from '~/Apollo/links/checkForReauthorizationLink';
import { authNotRequiredLink } from '~/Apollo/links/noAuthLink';
import DataCacheLink from '~/Apollo/links/dataCacheLink';
// import { xAppLink } from '~/Apollo/links/xAppLink';

export const useLinks = (uri) => {
  const app = useAppBridge();
  return {
    getLinks: () => from([
      checkForReauthorizationLink(app),
      mutationQueueLink(),
      retryLink(),
      // xAppLink(), // không cần gắn app id vào header request nữa, thay vào đó khi dev thì dùng vite server proxy, build thì dùng nginx reverse proxy
      gqlCacheLink(),
      authNotRequiredLink(),
      DataCacheLink(),
      split(
        (operation) => operation.getContext().noAuth === undefined || operation.getContext().noAuth === false,
        httpLink(uri, app),
        httpLinkWithoutAuthFetch(uri)
      ),
    ])
  };
};
