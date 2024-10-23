import { useQuery } from '@apollo/client';
import { APP_RECOMMENDATIONS_QUERY, APP_RECOMMENDATIONS_QUERY_KEY } from '~/queries/section-builder/other.gql';
import { useMemo, useState } from 'react';
import type { AppRecommend, GraphQlCollectionQueryResponse } from '~/@types';
import { useDismiss } from '~/talons/useDismiss';

export const useAppRecommend = () => {
  const [blockId] = useState('home_app_recommendations');
  const dismissTalon = useDismiss(blockId);
  const { data, loading } = useQuery<GraphQlCollectionQueryResponse<AppRecommend>>(APP_RECOMMENDATIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: dismissTalon.isDismissed || dismissTalon.loading,
  });

  const loadingWithoutData = loading && !data;
  const appRecommendations = useMemo(() => {
    return data?.[APP_RECOMMENDATIONS_QUERY_KEY]?.items || [];
  }, [data]);

  return {
    ...dismissTalon,
    apps: appRecommendations,
    loadingWithoutData,
  };
};
