import { useQuery } from '@apollo/client';
import { APP_RECOMMENDATIONS_QUERY, APP_RECOMMENDATIONS_QUERY_KEY } from '~/queries/section-builder/other.gql';
import { useEffect, useMemo, useState } from 'react';
import type { AppRecommend, GraphQlCollectionQueryResponse } from '~/@types';
import { useDismiss } from '~/talons/useDismiss';
import { useInView } from 'react-intersection-observer';

export const useAppRecommend = () => {
  const [blockId] = useState('home_app_recommendations');
  const { ref, inView } = useInView({ rootMargin: '100px 0px 100px 0px' });
  const [intersected, setIntersected] = useState<boolean>(undefined as any);
  const dismissTalon = useDismiss(blockId);
  const { data, loading } = useQuery<GraphQlCollectionQueryResponse<AppRecommend>>(APP_RECOMMENDATIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: dismissTalon.isDismissed || dismissTalon.loading || !intersected,
  });

  const loadingWithoutData = loading && !data;
  const appRecommendations = useMemo(() => {
    return data?.[APP_RECOMMENDATIONS_QUERY_KEY]?.items || [];
  }, [data]);
  useEffect(() => {
    if (intersected) return;
    if (inView) setIntersected(true);
  }, [inView, intersected]);
  return {
    ...dismissTalon,
    apps: appRecommendations,
    loadingWithoutData,
    ref,
    inView,
    intersected,
  };
};
