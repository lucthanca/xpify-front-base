import { LATEST_RELEASE_QUERY, LATEST_RELEASE_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { useBestSeller } from '~/talons/bestSeller/useBestSeller';

export const useLatestRelease = () => {
  return useBestSeller(LATEST_RELEASE_QUERY, LATEST_RELEASE_QUERY_KEY);
};
