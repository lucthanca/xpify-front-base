import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, DocumentNode, ApolloError, useApolloClient } from '@apollo/client';
import { Splide } from '@splidejs/react-splide';
import React from 'react';

interface Props<T = any> {
  queryRootKey: string;
  query: DocumentNode;
  pageSize?: number;
  variables?: T;
}

type QueryData<T = any> = {
  [key: string]: {
    items: T[];
    page_info: {
      total_pages: number;
      current_page: number;
      page_size: number;
    };
  } | undefined;
};
type LazyCarouselTalon<T = any> = {
  items: T[] | undefined;
  loading: boolean;
  loadingWithoutData: boolean;
  error: ApolloError | undefined;
  canLoadMore: boolean;
  handleSplideMoved: (splide: Splide, currentIndex: number) => void;
  splideRef: React.MutableRefObject<Splide | null>;
  splideConfig: {
    options: {
      perPage: number;
      gap: string;
      pagination: boolean;
      breakpoints: {
        425: { perPage: number };
        768: { perPage: number; gap: string };
        2560: { perPage: number };
      };
    };
  };
};

type ItemParts<T = any> = {
  [key: string]: T[];
}

export const useLazyCarousel = <T extends any>(props: Props): LazyCarouselTalon<T> => {
  const client = useApolloClient();
  const { queryRootKey, query, pageSize: propPageSize = 7, variables = {} } = props;
  const width = window.innerWidth;
  const perpage = useMemo(() => {
    if (width < 425) return 1;
    if (width < 768) return 3;
    if (width < 2560) return 4;
    return 4;
  }, [width]);
  const [splideConfig] = useState(() => ({
    options: {
      perPage: perpage,
      gap: '1rem',
      pagination: false,
      breakpoints:{
        425: { perPage: 1 },
        768: { perPage: 2, gap: '0.5rem' },
        2560: { perPage: 4 }
      }
    },
  }));
  const splideRef = useRef<Splide>(null);
  const perpageRef = useRef(perpage);
  const loadingRef = useRef(false);
  const [pageSize] = useState(propPageSize);
  const [currentPage, setPage] = useState(1);

  const loadCachedItems = useCallback((nextPage: number | null = null) => {
    const page = nextPage ?? currentPage;
    return client.readQuery<QueryData>({ query, variables: { ...variables, pageSize: propPageSize, currentPage: page } });
  }, [query, variables, propPageSize, currentPage]);

  const [listParts, setListParts] = useState<ItemParts<T>>(() => {
    const cachedData = loadCachedItems();
    const curPage = cachedData?.[queryRootKey]?.page_info?.current_page ?? 1;
    return { ['p_' + curPage]: cachedData?.[queryRootKey]?.items || [] };
  });

  const { data, loading, error } = useQuery(query, {
    fetchPolicy: "cache-and-network",
    variables: {
      ...variables,
      pageSize,
      currentPage,
    },
  });
  const canLoadMoreRef = useRef(false);
  const totalPage = useMemo(() => data?.[queryRootKey]?.page_info?.total_pages ?? 1, [data]);
  const canLoadMore = useMemo(() => totalPage > 1 && currentPage < totalPage, [data, totalPage]);

  const handleSplideMoved = useCallback((_: any, currentIndex: number) => {
    if (!splideRef.current || !splideRef.current?.splide || !canLoadMoreRef.current) return;
    const slideLength = splideRef.current.splide.length;
    const shouldLoadmore = currentIndex >= slideLength - (perpageRef.current + 1) && canLoadMoreRef.current;
    if (shouldLoadmore && !loadingRef.current) {
      setPage(prevPage => prevPage + 1);
    }
  }, []);

  useEffect(() => {
    if (data) {
      const currPage = data?.[queryRootKey]?.page_info?.current_page ?? 1;
      setListParts(prev => {
        return {
          ...prev,
          ['p_' + currPage]: data?.[queryRootKey]?.items || [],
        };
      });
    }
  }, [data]);

  useEffect(() => {
    // use ref because the splidejs event handler is not change when the deps change
    canLoadMoreRef.current = canLoadMore;
  }, [canLoadMore]);

  useEffect(() => {
    perpageRef.current = perpage;
  }, [perpage]);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const extractedItems = useMemo(() => {
    return Object.values(listParts).reduce((acc, curr) => [...acc, ...curr], []);
  }, [listParts]);

  return {
    items: extractedItems,
    loading,
    loadingWithoutData: loading && !extractedItems?.length,
    error,
    canLoadMore,
    handleSplideMoved,
    splideRef,
    splideConfig,
  };
};
