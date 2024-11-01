import { SECTION_V2_QUERY, SECTION_V2_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { DocumentNode, useApolloClient, useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import type { OperationVariables } from '@apollo/client/core/types';
import type {
  CollectionQueryData,
  Section,
  ComplexCollectionQueryResponse,
  SimpleSection,
} from '~/@types';


export type ExtractKeysCallback = (items: Section[]) => string[];

export const useCarousel = (query: DocumentNode, dataKey: string, queryVariables?: OperationVariables | undefined, extractKeys?: ExtractKeysCallback) => {
  const client = useApolloClient();
  const cache = client.cache;
  // mark that the component has been initialized
  const [initialized, setInitialized] = useState(false);
  const { data, loading, error } = useQuery<ComplexCollectionQueryResponse<Section>>(query, {
    fetchPolicy: 'cache-and-network',
    variables: queryVariables || {},
  });

  const items = useMemo<Section[]>(() => {
    if (data === undefined || data === null || data[dataKey] === undefined || data[dataKey] === null) return [];

    if (Array.isArray(data[dataKey])) {
      return data[dataKey] as Section[];
    }
    const collectionData = data[dataKey] as CollectionQueryData<Section>;
    if (!Array.isArray(collectionData.items)) return [];
    return collectionData.items;
  }, [data]);
  const keys = useMemo(() => {
    if (extractKeys) return extractKeys(items);
    return items.map(item => item.url_key);
  }, [items, extractKeys]);
  const loadingWithoutData = loading && !data;

  useEffect(() => {
    // only run this effect when items are available and the component has not been initialized
    if (items.length === 0 || initialized) return;

    // lặp vào ghi luôn vào cache query cho từng section luôn. sau useQuery section_v2 thì sẽ có cache luôn

    const isSimpleSection = (item: Section): item is SimpleSection => item.__typename === 'Section';
    items.forEach(item => {
      let moreInfo: Partial<Section> & {
        pricing_plan?: null;
        child_ids?: string[];
      } = {};
      if (isSimpleSection(item)) {
        if (!item.pricing_plan || !item.pricing_plan.id) {
          moreInfo.pricing_plan = null;
        }
      }
      if (!item?.categoriesV2?.length) {
        moreInfo.categoriesV2 = null;
      }
      if (item.__typename === 'GroupSection') {
        moreInfo.child_ids = [];
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
    error,
  };
};
