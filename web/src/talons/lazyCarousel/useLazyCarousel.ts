import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, DocumentNode, ApolloError } from '@apollo/client';
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

export const useLazyCarousel = (props: Props): LazyCarouselTalon => {
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
        768: { perPage: 3, gap: '0.5rem' },
        2560: { perPage: 4 }
      },
    },
  }));
  const splideRef = useRef<Splide>(null);
  const perpageRef = useRef(perpage);
  const [pageSize, setPageSize] = useState(propPageSize);
  const [currentPage, setPage] = useState(1);
  const [stateItems, setItems] = useState<any[]>([]);

  const { data, loading, error } = useQuery(query, {
    fetchPolicy: "cache-and-network",
    variables: {
      ...variables,
      pageSize,
      currentPage,
    },
    onCompleted: (data: QueryData) => {
      const newItems = data?.[queryRootKey]?.items;
      if (newItems) {
        setItems(prevItems => [...prevItems, ...newItems]);
      }
    }
  });
  const canLoadMoreRef = useRef(false);
  const totalPage = useMemo(() => data?.[queryRootKey]?.page_info?.total_pages ?? 1, [data]);
  const canLoadMore = useMemo(() => totalPage > 1, [data, totalPage]);

  const items = useMemo(() => {
    return data?.[queryRootKey]?.items ?? stateItems;
  }, [data, queryRootKey, stateItems]);

  const handleSplideMoved = useCallback((_: any, currentIndex: number) => {
    if (!splideRef.current || !splideRef.current?.splide || !canLoadMoreRef.current) return;
    const slideLength = splideRef.current.splide.length;
    const shouldLoadmore = currentIndex >= slideLength - (perpageRef.current + 1);
    if (shouldLoadmore) {
      setPageSize(prevPage => prevPage + propPageSize);
    }
  }, [propPageSize]);

  useEffect(() => {
    // use ref because the splidejs event handler is not change when the deps change
    canLoadMoreRef.current = canLoadMore;
  }, [canLoadMore]);

  useEffect(() => {
    perpageRef.current = perpage;
  }, [perpage]);

  return {
    items,
    loading,
    loadingWithoutData: !loading && items === undefined,
    error,
    canLoadMore,
    handleSplideMoved,
    splideRef,
    splideConfig,
  };
};
