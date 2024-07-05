import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { SECTIONS_QUERY, QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';
import { PRICING_PLANS_QUERY, SORT_OPTIONS_QUERY } from '~/queries/section-builder/other.gql';
import { CATEGORIES_QUERY } from '~/queries/section-builder/category.gql';
import { TAGS_QUERY } from '~/queries/section-builder/tag.gql';
import { PricingPlan, SectionData } from '~/talons/section/useSection';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  CATEGORY_FILTER_KEY,
  PLAN_FILTER_KEY,
  PRICE_FILTER_KEY,
  TAG_FILTER_KEY,
  QUERY_SEARCH_KEY,
  SORT_OPTION_NONE,
} from '~/components/block/input/search';
import { isEmpty } from '~/utils/isEmpty';

const productType = {
  'simple': 1,
  'group': 2
};

type SelectOption = {
  value: string;
  label: string;
}
type Category = {
  entity_id: string;
  name: string;
}
type Tag = {
  entity_id: string;
  name: string;
}
type PageInfo = {
  total_pages: number;
  current_page: number;
  page_size: number;
}

export const useSectionCollection = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchFilter, setSearchFilter] = useState('');
  const [sortSelected, setSortSelected] = useState([SORT_OPTION_NONE]);
  const [planFilter, setPlanFilter] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [tagFilter, setStateTagFilter] = useState([] as string[]);
  const [priceFilter, setPriceFilter] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [debounceLoading, setDebounceLoading] = useState(false);

  /**
   * To determine if has search tags in URL -> pin the tag filter
   */
  const [shouldPinTagFilter, setShouldPinTagFilter] = useState(() => {
    return searchParams.has('tags');
  });
  const searchTags = useMemo(() => {
    return searchParams.get('tags')?.toLowerCase()?.split(',');
  }, [searchParams]);

  const setTagFilter = useCallback((value: any) => {
    // use window.location.search because searchParams is not updated yet
    const currentUrlParams = new URLSearchParams(window.location.search);
    if (!value?.length && Boolean(currentUrlParams.has('tags'))) {
      currentUrlParams.delete('tags');
      setSearchParams(currentUrlParams);
      setShouldPinTagFilter(false);
    }

    setStateTagFilter((_) => {
      if (value === undefined || value === null) return [];
      return value;
    });
  }, [searchParams])

  const information = useMemo(() => {
    const currentPath = location.pathname;
    if (currentPath === '/my-library') {
      if (location.search === '?type=group') {
        return {
          sectionType: productType.group,
          isOwned: true
        };
      } else {
        return {
          sectionType: productType.simple,
          isOwned: true
        };
      }
    } else {
      if (currentPath === '/groups') {
        return {
          sectionType: productType.group,
          isOwned: false
        };
      } else {
        return {
          sectionType: productType.simple,
          isOwned: false
        };
      }
    }
  }, [location.pathname]);

  const { data: sectionsData } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      search: searchFilter,
      filter: {
        type_id: information?.sectionType ?? 1,
        category_id: categoryFilter ?? [],
        tag_id: tagFilter,
        plan_id: planFilter ?? [],
        price: priceFilter ? {
          min: priceFilter[0],
          max: priceFilter[1]
        } : {},
        owned: information?.isOwned ?? false
      },
      sort: sortSelected ? (([column, order]) => ({ column, order }))(sortSelected[0].split(' ')) : {},
      pageSize: 120,
      currentPage: currentPage
    }
  });
  const { data: pricingPlans, loading: loadingPricingPlans, error: errorPricingPlans } = useQuery(PRICING_PLANS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: categories, loading: loadingCategories, error: errorCategories } = useQuery(CATEGORIES_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: tags, loading: loadingTags, error: errorTags } = useQuery(TAGS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: sortOptionsdt, loading: loadingSortOptions, error: errorSortOptions } = useQuery(SORT_OPTIONS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  const pricingPlanOptions: SelectOption[] = useMemo(() => {
    return pricingPlans?.pricingPlans ? pricingPlans.pricingPlans.map((item: PricingPlan) => ({
      value: item.id,
      label: item.name
    })) : [];
  }, [pricingPlans]);
  const categoriesOptions: SelectOption[] = useMemo(() => {
    return categories?.getCategories ? categories.getCategories.map((item: Category) => ({
      value: item.entity_id,
      label: item.name
    })) : [];
  }, [categories]);
  const tagOptions: SelectOption[] = useMemo(() => {
    return tags?.getTags ? tags.getTags.map((item: Tag) => ({
      value: item.entity_id,
      label: item.name
    })) : [];
  }, [tags]);
  const sortOptions: SelectOption[] = useMemo(() => {
    return sortOptionsdt?.getSortOptions ?? [];
  }, [sortOptionsdt]);
  const sections: SectionData[] | null | undefined = useMemo(() => {
    return sectionsData?.getSections?.items;
  }, [sectionsData]);
  const sectionCollectionPageInfo = useMemo(() => {
    return sectionsData?.getSections?.page_info;
  }, [sectionsData]);

  useEffect(() => {
    if (!tagOptions?.length || !searchTags?.length) return;
    const tagIdsMapping = tagOptions.map((item) => {
      if (searchTags.includes(item.label?.toLowerCase())) return item.value;
      return undefined;
    }).filter((item) => item !== undefined) as string[];
    setTagFilter(tagIdsMapping);
    setShouldPinTagFilter(true);
  }, [searchTags, tagOptions]);
  return {
    searchFilter,
    setSearchFilter,
    planFilter,
    setPlanFilter,
    categoryFilter,
    setCategoryFilter,
    tagFilter,
    setTagFilter,
    priceFilter,
    setPriceFilter,
    sortSelected,
    setSortSelected,
    pricingPlanOptions,
    categoriesOptions,
    tagOptions,
    sortOptions,
    sections,
    currentPage,
    setCurrentPage,
    sectionCollectionPageInfo,
    debounceLoading,
    setDebounceLoading,
    shouldPinTagFilter,
  };
};

const FILTER_FIELDS_MAPPING: { [key: string]: string } = {
  [TAG_FILTER_KEY]: 'tag_id',
  [PLAN_FILTER_KEY]: 'plan_id',
  [CATEGORY_FILTER_KEY]: 'category_id',
  [PRICE_FILTER_KEY]: 'price',
};

const pageInfoDefault = {
  total_pages: 1,
  current_page: 1,
  page_size: 120,
};

export const useSectionListing = (onQueryCompleted: any) => {
  const [filterParts, setFilterParts] = useState({});
  const [searchFilter, setSearchFilter] = useState('');
  const [stateSections, setSections] = useState<SectionData[]>([]);
  const [statePageInfo, setStatePageInfo] = useState<PageInfo>(pageInfoDefault);
  const [sort, setSort] = useState([SORT_OPTION_NONE]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const information = useMemo(() => {
    const currentPath = location.pathname;
    if (currentPath === '/my-library') {
      const urlSearch = searchParams.get('type') || '';
      if (urlSearch === 'group') {
        return {
          sectionType: productType.group,
          isOwned: true
        };
      } else {
        return {
          sectionType: productType.simple,
          isOwned: true
        };
      }
    } else {
      if (currentPath === '/groups') {
        return {
          sectionType: productType.group,
          isOwned: false
        };
      } else {
        return {
          sectionType: productType.simple,
          isOwned: false
        };
      }
    }
  }, [searchParams]);
  const isSortNone = useMemo(() => !sort || sort[0] === SORT_OPTION_NONE, [sort]);

  const hasFilter = useMemo(() => {
    return !isEmpty(filterParts) || !!searchFilter || !isSortNone;
  }, [filterParts, searchFilter, isSortNone]);

  const { data: sectionsData, loading, refetch: refetchSections } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      search: searchFilter,
      filter: {
        ...filterParts,
        type_id: information.sectionType,
        owned: information.isOwned
      },
      sort: (([column, order]) => ({ column, order }))(sort[0].split(' ')),
      pageSize: 120,
      currentPage: currentPage
    },
    onCompleted: (data) => {
      setSections(data?.[QUERY_SECTION_COLLECTION_KEY]?.items || []);
      setStatePageInfo(data?.[QUERY_SECTION_COLLECTION_KEY]?.page_info || pageInfoDefault);
      if (onQueryCompleted) {
        onQueryCompleted(data?.[QUERY_SECTION_COLLECTION_KEY]);
      }
    },
    // skip: !hasFilter,
  });

  useEffect(() => {
    const page = Number(searchParams.get('p'));
    if (Number.isInteger(page) && page > 0) {
      setCurrentPage(page);
    } else {
      setCurrentPage(1);
    }
  }, [searchParams]);

  const handlePageChange = useCallback((page: number) => {
    const currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('p', String(page));
    setSearchParams(currentUrlParams);
    setCurrentPage(page);
  }, []);

  const handleFilterChange = useCallback((type: string, value: any) => {
    if (type === QUERY_SEARCH_KEY) {
      setSearchFilter(value);
      return;
    }
    if (!type || FILTER_FIELDS_MAPPING[type] === undefined) return;
    setFilterParts(prevState => {
      let tValue = value;
      if (type === PRICE_FILTER_KEY) {
        if (Array.isArray(value) && value.length === 2) {
          tValue = { min: value[0], max: value[1] };
        } else {
          return prevState;
        }
      }
      const newState: {[key: string]: string} = {
        ...prevState,
        [FILTER_FIELDS_MAPPING[type]]: tValue,
      };

      // remove the key if the value is empty
      if (isEmpty(tValue)) {
        delete newState[FILTER_FIELDS_MAPPING[type]];
      }

      return newState;
    });
  }, []);
  const handleSortChange = useCallback((value: any) => {
    setSort(value);
  }, []);
  const sections: SectionData[] | null | undefined = useMemo(() => {
    return sectionsData?.[QUERY_SECTION_COLLECTION_KEY]?.items || stateSections || [];
  }, [sectionsData, stateSections]);
  const pageInfo = useMemo<PageInfo>(() => {
    return sectionsData?.[QUERY_SECTION_COLLECTION_KEY]?.page_info || statePageInfo || {};
  }, [sectionsData, hasFilter]);
  const loadingWithoutData = loading && stateSections.length === 0 && sectionsData?.[QUERY_SECTION_COLLECTION_KEY]?.items === null || sectionsData?.[QUERY_SECTION_COLLECTION_KEY]?.items === undefined;

  return {
    handleFilterChange,
    sections,
    refetchSections,
    hasFilter,
    handleSortChange,
    pageInfo,
    handlePageChange,
    loading,
    loadingWithoutData,
  };
};
