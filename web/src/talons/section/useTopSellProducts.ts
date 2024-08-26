import { useQuery } from '@apollo/client';
import { QUERY_SECTION_COLLECTION_KEY, SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { useMemo } from 'react';
import type { GraphQlQueryResponse, Section } from '~/@types';
import { isEmpty } from '~/utils/isEmpty';

export const useTopSellProducts = () => {
  const { data, loading, error } = useQuery<GraphQlQueryResponse<Section>>(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      sort: { column: 'entity_id', order: 'desc' },
      pageSize: 12,
      currentPage: 1
    }
  });
  const products: Section[] | [] = useMemo(() => {
    if (data === undefined) return [];
    if (isEmpty(data[QUERY_SECTION_COLLECTION_KEY])) return [];
    return data[QUERY_SECTION_COLLECTION_KEY].items ?? []; // use ?? to prevent items null or undefined
  }, [data]);
  const loadingWithoutData = useMemo(() => loading && products === undefined, [loading, products]);
  return {
    products,
    loading,
    error,
    loadingWithoutData,
  };
};
