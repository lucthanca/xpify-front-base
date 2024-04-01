import { useCallback, useMemo, useState } from 'react';
import { QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';
import type { ExtractItemsCallback } from '~/talons/carousel/useCarousel';
import type { OperationVariables } from '@apollo/client/core/types';
import type { Options } from '@splidejs/react-splide';

type RelatedProductsTalonProps = {
  pageSize?: number;
  currentPage?: number;
};

export type RelatedProductsTalon = {
  variables: OperationVariables;
  extractItemList: ExtractItemsCallback;
  slideOptions: Options;
  slidePerPage: number;
};

export const useRelatedProducts = (props: RelatedProductsTalonProps = {}): RelatedProductsTalon => {
  const [variables] = useState(() => ({
    sort: {
      'column': 'qty_sold',
      'order': 'desc'
    },
    pageSize: 12,
    currentPage: 1,
  }));
  const wInner = window.innerWidth;
  const slidePerPage = useMemo(() => {
    if (wInner < 425) return 1;
    if (wInner < 768) return 2;
    if (wInner < 2560) return 3;
    return 3;
  }, [wInner])
  const [slideOptions] = useState(() => ({
    perPage: 3,
    gap: '1rem',
    pagination: false,
    breakpoints:{
      425: { perPage: 1 },
      768: { perPage: 2, gap: '0.5rem' },
      2560: { perPage: 3 }
    },
    autoplay: true,
    interval: 3000,
    rewind: true
  }));
  const extractItemList = useCallback((data: any) => {
    return data?.[QUERY_SECTION_COLLECTION_KEY]?.items || [];
  }, []);

  return {
    variables,
    extractItemList,
    slideOptions,
    slidePerPage,
  };
};
