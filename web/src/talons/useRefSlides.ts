import { useEffect, useMemo, useState } from 'react';
import { useDismiss } from '~/talons/useDismiss';
import { BLOCK_REF_SLIDES_QUERY, BLOCK_REF_SLIDES_QUERY_KEY } from '~/queries/section-builder/other.gql';
import { useQuery } from '@apollo/client';
import type { GraphQlCollectionQueryResponse, RefBlockSlide } from '~/@types';
import { useInView } from 'react-intersection-observer';

export const useRefSlides = () => {
  const [blockId] = useState('home_ref_slides');
  const { ref, inView } = useInView({ rootMargin: '100px 0px 100px 0px' });
  const dismissTalon = useDismiss(blockId);
  // cái này để đánh dấu rằng component đã trong viewport, thì sau khi đã vào viewport thì dữ liệu sẽ luôn được giữ đúng trạng thái,
  // tránh tinh trạng khi ra ngoài viewport rồi vào lại thì dữ liệu bị fetch lại
  const [intersected, setIntersected] = useState<boolean>(undefined as any);
  const { data, loading } = useQuery<GraphQlCollectionQueryResponse<RefBlockSlide>>(BLOCK_REF_SLIDES_QUERY, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    skip: dismissTalon.isDismissed || dismissTalon.loading || !intersected,
  });
  const loadingWithoutData = loading && !data;
  const slides = useMemo(() => {
    return data?.[BLOCK_REF_SLIDES_QUERY_KEY]?.items || [];
  }, [data]);
  useEffect(() => {
    if (intersected) return;
    if (inView) setIntersected(true);
  }, [inView, intersected]);
  return {
    ...dismissTalon,
    loadingWithoutData,
    slides,
    ref,
    inView,
    intersected,
  };
};
