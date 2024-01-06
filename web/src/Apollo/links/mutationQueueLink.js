import MutationQueueLink from '@adobe/apollo-link-mutation-queue';

export const mutationQueueLink = () => {
  return new MutationQueueLink();
};
