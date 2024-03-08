import { ApolloError, useQuery } from '@apollo/client';
import { SECTIONS_QUERY } from '~/queries/section-builder/product.gql';
import { useMemo } from 'react';
import { SectionData } from '../section/useSection';

type RelatedProductsTalonProps = {
  pageSize?: number;
  currentPage?: number;
};

export type RelatedProductsTalon = {
  products: SectionData[];
  loading: boolean;
  loadingWithoutData: boolean;
  error: ApolloError | undefined;
};

export const useRelatedProducts = (props: RelatedProductsTalonProps = {}): RelatedProductsTalon => {
  const { pageSize = 12, currentPage = 1 } = props;
  const { data: productRelated, loading, error } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      sort: {
        'column': 'qty_sold',
        'order': 'desc'
      },
      pageSize,
      currentPage,
    }
  });

  const products: SectionData[] = useMemo(() => {
    return productRelated?.getSections?.items || [];
  }, [productRelated]);

  return {
    products,
    loading,
    error,
    loadingWithoutData: loading && !productRelated,
  };
};
