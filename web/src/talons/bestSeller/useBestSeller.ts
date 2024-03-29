import { BEST_SELLER_QUERY, SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { useApolloClient, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SectionData } from '~/talons/section/useSection';

type BestSellerQueryData = {
  bestSeller: SectionData[];
}

export const useBestSeller = () => {
  const client = useApolloClient();
  const cache = client.cache;

  // mark that the component has been initialized
  const [initialized, setInitialized] = useState(false);
  const { data, loading, error } = useQuery<BestSellerQueryData>(BEST_SELLER_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  const [quickViewProduct, setQuickViewProduct] = useState<SectionData | null>(null);
  const handleQuickView = useCallback((product: SectionData) => {
    setQuickViewProduct(product);
  }, []);

  const items = useMemo(() => {
    return data?.bestSeller || [];
  }, [data]);

  const loadingWithoutData = loading && !data;

  useEffect(() => {
    // only run this effect when items are available and the component has not been initialized
    if (items.length === 0 || initialized) return;

    // lặp vào ghi luôn vào cache query cho từng section luôn. sau useQuery section_v2 thì sẽ có cache luôn
    items.forEach(item => {
      let moreInfo: {
        [K in keyof SectionData]: SectionData[K];
      } = {} as any;
      if (!item?.pricing_plan?.id) {
        moreInfo.pricing_plan = null;
      }
      cache.writeQuery({
        query: SECTION_V2_QUERY,
        data: {
          [SECTION_V2_QUERY_KEY]: { ...item, ...moreInfo },
        },
        variables: { key: item.url_key },
      });
      // mark that the component has been initialized
      setInitialized(true);
    });
  }, [items, initialized]);
  return {
    items,
    loadingWithoutData,
    loading,
    quickViewProduct,
    handleQuickView,
  };
};
