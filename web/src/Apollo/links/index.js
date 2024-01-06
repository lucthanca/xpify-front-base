import { from } from '@apollo/client';
import { authLink } from '~/Apollo/links/authLink';
import { retryLink } from '~/Apollo/links/retryLink';
import { gqlCacheLink } from '~/Apollo/links/gqlCacheLink';
import { mutationQueueLink } from '~/Apollo/links/mutationQueueLink';
import { httpLink } from '~/Apollo/links/httpLink';

export const getLinks = (uri) => from([
  mutationQueueLink(),
  retryLink(),
  authLink(),
  gqlCacheLink(),
  httpLink(uri),
]);
