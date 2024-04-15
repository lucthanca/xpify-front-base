import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { DocumentNode, useApolloClient, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import type { SectionData } from '~/talons/section/useSection';
import type { OperationVariables } from '@apollo/client/core/types';

export type QueryData = {
  [key: string]: SectionData[];
}

export type ExtractItemsCallback = (data?: QueryData) => SectionData[];

export const useCarousel = (query: DocumentNode, dataKey: string, queryVariables?: OperationVariables | undefined, extractItems?: ExtractItemsCallback) => {
  const client = useApolloClient();
  const cache = client.cache;
  // mark that the component has been initialized
  const [initialized, setInitialized] = useState(false);
  const { data, loading, error } = useQuery<QueryData>(query, {
    fetchPolicy: 'cache-and-network',
    variables: queryVariables || {},
  });

  const items = useMemo(() => {
    if (extractItems) {
      return extractItems(data);
    }
    return data?.[dataKey] || [];
  }, [data, extractItems]);
  const keys = useMemo(() => {
    return items.map(item => item.url_key);
  }, [items]);
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
      if (!item?.categoriesV2?.length) {
        moreInfo.categoriesV2 = null;
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
    keys,
  };
};
