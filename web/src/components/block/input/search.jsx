import {
  IndexFilters,
  useSetIndexFiltersMode,
  IndexFiltersMode,
  ChoiceList,
  RangeSlider,
} from '@shopify/polaris';
import { debounce } from 'lodash';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { PRICING_PLANS_QUERY, SORT_OPTIONS_QUERY, SORT_OPTIONS_QUERY_KEY } from '~/queries/section-builder/other.gql';
import { CATEGORIES_QUERY, CATEGORIES_QUERY_KEY } from '~/queries/section-builder/category.gql';
import { useTags } from '~/hooks/useTags';
import { useSearchParams } from 'react-router-dom';

export const TAG_FILTER_KEY = 'tag';
export const PLAN_FILTER_KEY = 'plan';
export const CATEGORY_FILTER_KEY = 'category';
export const PRICE_FILTER_KEY = 'price';
export const QUERY_SEARCH_KEY = '__query__';

export const SORT_OPTION_NONE = 'none false';

function buildFilterKey (key) {
  return `${key}_filter`;
}

const useSearch = props => {
  const { onFilterChange, onSortChange } = props;
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const searchSection = useCallback(async (value) => {
    if (onFilterChange) onFilterChange(QUERY_SEARCH_KEY, value);
  }, []);
  const ref = useRef(searchSection);
  const lazyCallback = useMemo(() => {
    const func = (value) => {
      ref.current?.(value);
    }
    return debounce(func, 500);
  }, []);
  const handleSearchFilterChange = useCallback((value) => {
    lazyCallback(value);
    setSearch(value);
  }, [lazyCallback]);
  const handleSearchFilterRemove = useCallback(() => {
    if (onFilterChange) onFilterChange(QUERY_SEARCH_KEY, undefined);
    setSearch(undefined);
  }, [onFilterChange]);

  const [priceFilter, setPriceFilter] = useState(undefined);
  const handlePriceFilterChange = useCallback((value) => {
    if (onFilterChange) {
      onFilterChange(PRICE_FILTER_KEY, value);
    }
    setPriceFilter(value);
  }, [onFilterChange]);
  const handlePriceFilterRemove = useCallback(() => {
    if (onFilterChange) onFilterChange(PRICE_FILTER_KEY, undefined);
    setPriceFilter(undefined);
  }, [onFilterChange]);

  const [planFilter, setPlanFilter] = useState([]);
  const handlePlanFilterChange = useCallback((value) => {
    if (onFilterChange) onFilterChange(PLAN_FILTER_KEY, value);
    setPlanFilter(value);
  }, [onFilterChange]);
  const handlePlanFilterRemove = useCallback(() => {
    if (onFilterChange) onFilterChange(PLAN_FILTER_KEY, []);
    setPlanFilter([]);
  }, [onFilterChange]);

  const [shouldPinCategoryFilter, setShouldPinCategoryFilter] = useState(() => {
    return searchParams.has('category');
  });
  const [categoryFilter, setCategoryFilter] = useState(() => {
    return searchParams.has('category') ? [''] : [];
  });
  const handleCategoryFilterParams = useCallback((value) => {
    // use window.location.search because searchParams is not updated yet
    const currentUrlParams = new URLSearchParams(window.location.search);
    if (!value?.length && Boolean(currentUrlParams.has('category'))) {
      currentUrlParams.delete('category');
      setSearchParams(currentUrlParams);
      setShouldPinCategoryFilter(false);
    }
  }, [])
  const handleCategoryFilterChange = useCallback((value) => {
    handleCategoryFilterParams(value);
    if (onFilterChange) onFilterChange(CATEGORY_FILTER_KEY, value);
    setCategoryFilter(value);
  }, [onFilterChange]);
  const handleCategoryFilterRemove = useCallback(() => {
    handleCategoryFilterParams([]);
    if (onFilterChange) onFilterChange(CATEGORY_FILTER_KEY, []);
    setCategoryFilter([]);
  }, [onFilterChange]);

  const [tagFilter, setTagFilter] = useState(() => {
    return searchParams.has('tags')
    ? [''] // Trigger tag filter
    : [];
  });
  /**
   * To determine if has search tags in URL -> pin the tag filter
   */
  const [shouldPinTagFilter, setShouldPinTagFilter] = useState(() => {
      return searchParams.has('tags');
    });
  const handleTagFilterParams = useCallback((value) => {
    // use window.location.search because searchParams is not updated yet
    const currentUrlParams = new URLSearchParams(window.location.search);
    if (!value?.length && Boolean(currentUrlParams.has('tags'))) {
      currentUrlParams.delete('tags');
      setSearchParams(currentUrlParams);
      setShouldPinTagFilter(false);
    }
  }, []);
  const handleTagFilterChange = useCallback((value) => {
    handleTagFilterParams(value);
    if (onFilterChange) onFilterChange(TAG_FILTER_KEY, value);
    setTagFilter(value);
  }, [onFilterChange, handleTagFilterParams]);
  const handleTagFilterRemove = useCallback(() => {
    handleTagFilterParams([]);
    if (onFilterChange) onFilterChange(TAG_FILTER_KEY, []);
    setTagFilter([]);
  }, [onFilterChange, handleTagFilterParams]);

  const [sortSelected, setSortSelected] = useState(() => {
    // Không chia list category nữa
    // let output = [SORT_OPTION_NONE];
    // if (location.pathname === '/my-library') {
    //   output = ['main_table.name asc'];
    // }
    let output = ['main_table.name asc'];
    return output;
  });
  const handleSortChange = useCallback((value) => {
    setSortSelected(value);
  }, [onSortChange]);
  useEffect(() => {
    if (onSortChange) onSortChange(sortSelected);
  }, [sortSelected]);
  const { tagOptions } = useTags();
  const { data: pricingPlans } = useQuery(PRICING_PLANS_QUERY, { fetchPolicy: "cache-and-network" });
  const { data: categories } = useQuery(CATEGORIES_QUERY, { fetchPolicy: "cache-and-network" });
  const { data: sortOptionsdt } = useQuery(SORT_OPTIONS_QUERY, { fetchPolicy: "cache-and-network" });
  const pricingPlanOptions = useMemo(() => {
    return pricingPlans?.pricingPlans ? pricingPlans.pricingPlans.map((item) => ({
      value: item.id,
      label: item.name
    })) : [];
  }, [pricingPlans]);
  const categoriesOptions = useMemo(() => {
    return categories?.[CATEGORIES_QUERY_KEY]?.items ? categories[CATEGORIES_QUERY_KEY].items.map((item) => ({
      value: item.id,
      label: item.name
    })) : [];
  }, [categories]);
  const sortOptions = useMemo(() => {
    // const baseOptions = location.pathname === '/my-library' ? [] : [{
    //   label: 'None',
    //   value: SORT_OPTION_NONE,
    // }];
    const baseOptions = [];
    return [...baseOptions, ...(sortOptionsdt?.[SORT_OPTIONS_QUERY_KEY] ?? [])];
  }, [sortOptionsdt]);
  const handleFiltersClearAll = useCallback(() => {
    handlePriceFilterRemove();
    handlePlanFilterRemove();
    handleCategoryFilterRemove();
    handleTagFilterRemove();
  }, [handlePriceFilterRemove, handlePlanFilterRemove, handleCategoryFilterRemove, handleTagFilterRemove]);
  const appliedFilters = [];
  if (planFilter?.length > 0) {
    appliedFilters.push({
      key: buildFilterKey(PLAN_FILTER_KEY),
      label: planFilter.map((val) => `Plan is: ${pricingPlanOptions.find(item => item.value === val)?.label}`),
      onRemove: handlePlanFilterRemove,
    });
  }
  if (categoryFilter?.length > 0) {
    appliedFilters.push({
      key: buildFilterKey(CATEGORY_FILTER_KEY),
      label: categoryFilter.map((val) => `Category is: ${categoriesOptions.find(item => item.value === val)?.label}`),
      onRemove: handleCategoryFilterRemove,
    });
  }
  if (tagFilter?.length > 0) {
    appliedFilters.push({
      key: buildFilterKey(TAG_FILTER_KEY),
      label: `Tag in: ` + tagFilter.map((val) => `${tagOptions.find(item => item.value === val)?.label}`).join(','),
      onRemove: handleTagFilterRemove,
    });
  }
  if (priceFilter?.length > 0) {
    appliedFilters.push({
      key: buildFilterKey(PRICE_FILTER_KEY),
      label: `Price is between $${priceFilter[0]} and $${priceFilter[1]}`,
      onRemove: handlePriceFilterRemove,
    });
  }
  const searchTags = useMemo(() => {
    return searchParams.get('tags')?.toLowerCase()?.split(',');
  }, [searchParams]);
  const searchCategories = useMemo(() => {
    return searchParams.get('category')?.toLowerCase()?.split(',');
  }, [searchParams]);
  useEffect(() => {
    if (!tagOptions?.length || !searchTags?.length) return;
    const tagIdsMapping = tagOptions.map((item) => {
      if (searchTags.includes(item.label?.toLowerCase())) return item.value;
      return undefined;
    }).filter((item) => item !== undefined);
    handleTagFilterChange(tagIdsMapping);
    setShouldPinTagFilter(true);
  }, [searchTags, tagOptions]);

  useEffect(() => {
    if (!tagOptions?.length || !searchCategories?.length) return;
    const categoryIdsMapping = categoriesOptions.map((item) => {
      if (searchCategories.includes(item.label?.toLowerCase())) return item.value;
      return undefined;
    }).filter((item) => item !== undefined);
    handleCategoryFilterChange(categoryIdsMapping);
    setShouldPinCategoryFilter(true);
  }, [searchCategories, categoriesOptions]);

  return {
    pricingPlanOptions,
    categoriesOptions,
    tagOptions,
    sortOptions,
    priceFilter,
    handlePriceFilterChange,
    planFilter,
    handlePlanFilterChange,
    categoryFilter,
    handleCategoryFilterChange,
    tagFilter,
    handleTagFilterChange,
    appliedFilters,
    handleFiltersClearAll,
    handleSearchFilterChange,
    search,
    handleSearchFilterRemove,
    sortSelected,
    handleSortChange,
    shouldPinTagFilter,
    shouldPinCategoryFilter,
  };
};

export default function Search({
  onFilterChange,
  onSortChange,
}) {
  const {
    pricingPlanOptions: pricingPlans,
    categoriesOptions: categories,
    tagOptions: tags,
    sortOptions,
    priceFilter,
    handlePriceFilterChange,
    planFilter,
    handlePlanFilterChange,
    categoryFilter,
    handleCategoryFilterChange,
    tagFilter,
    handleTagFilterChange,
    appliedFilters,
    handleFiltersClearAll,
    handleSearchFilterChange,
    search,
    handleSearchFilterRemove,
    sortSelected,
    handleSortChange,
    shouldPinTagFilter,
    shouldPinCategoryFilter,
  } = useSearch({ onFilterChange, onSortChange });

  const [selected, setSelected] = useState(0);
  const {mode, setMode} = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const priceFilterJsx = useMemo(() => {
    return (
      <RangeSlider
        label="Price is between"
        labelHidden
        value={priceFilter || [0,50]}
        prefix="$"
        output
        min={0}
        max={100}
        step={1}
        onChange={handlePriceFilterChange}
      />
    );
  }, [priceFilter, handlePriceFilterChange]);
  const planFilterJsx = useMemo(() => {
    return null; //Skip vì chưa có Plan trong bản MVP
    if (!pricingPlans) return null;
    return (
      <ChoiceList
        title="Plan"
        titleHidden
        choices={pricingPlans}
        selected={planFilter}
        onChange={handlePlanFilterChange}
      />
    );
  }, [pricingPlans, planFilter, handlePlanFilterChange]);
  const categoryFilterJsx = useMemo(() => {
    if (!categories) return null;
    return (
      <ChoiceList
        title="Category"
        titleHidden
        choices={categories}
        selected={categoryFilter}
        onChange={handleCategoryFilterChange}
      />
    );
  }, [categories, categoryFilter, handleCategoryFilterChange]);
  const tagFilterJsx = useMemo(() => {
    if (!tags) return null;
    return (
      <ChoiceList
        title="Tag"
        titleHidden
        choices={tags}
        selected={tagFilter}
        onChange={handleTagFilterChange}
        allowMultiple
      />
    );
  }, [tags, tagFilter, handleTagFilterChange]);

  const filters = useMemo(() => {
    // const result = [{ // Skip vì section ko có giá
    //   key: buildFilterKey(PRICE_FILTER_KEY),
    //   label: 'Price',
    //   filter: priceFilterJsx,
    //   shortcut: false
    // }];
    const result = [];
    planFilterJsx && result.push({
      key: buildFilterKey(PLAN_FILTER_KEY),
      label: 'Plan',
      filter: planFilterJsx,
      shortcut: false,
    });
    categoryFilterJsx && result.push({
      key: buildFilterKey(CATEGORY_FILTER_KEY),
      label: 'Category',
      filter: categoryFilterJsx,
      shortcut: true,
    });
    tagFilterJsx && result.push({
      key: buildFilterKey(TAG_FILTER_KEY),
      label: 'Tag',
      filter: tagFilterJsx,
      shortcut: true,
    });

    // put a dummy filter to pin the tag filter to tell the FiltersBar render the tag filter
    // @see node_modules/@shopify/polaris/build/esm/components/Filters/components/FiltersBar
    // 62: useOnValueChange(filters.length, ...)
    shouldPinTagFilter && result.push({ key: 'dummy' });
    shouldPinCategoryFilter && result.push({ key: 'dummy_cate' });

    return result;
  }, [shouldPinCategoryFilter, tagFilterJsx, shouldPinTagFilter, categoryFilterJsx, priceFilterJsx, planFilterJsx]);

  // const appliedFilters = [];
  // if (planFilter && planFilter.length > 0) {
  //   appliedFilters.push({
  //     key: 'planFilter',
  //     label: planFilter.map((val) => `Plan is: ${pricingPlans.find(item => item.value === val)?.label}`),
  //     onRemove: handlePlanFilterRemove,
  //   });
  // }
  // if (categoryFilter && categoryFilter.length > 0) {
  //   appliedFilters.push({
  //     key: 'categoryFilter',
  //     label: categoryFilter.map((val) => `Category is: ${categories.find(item => item.value === val)?.label}`),
  //     onRemove: handleCategoryFilterRemove,
  //   });
  // }
  // if (tagFilter?.length > 0) {
  //   appliedFilters.push({
  //     key: TAG_FILTER_KEY,
  //     label: `Tag in: ` + tagFilter.map((val) => `${tags.find(item => item.value === val)?.label}`).join(','),
  //     onRemove: handleTagFilterRemove,
  //   });
  // }
  // if (price) {
  //   appliedFilters.push({
  //     key: 'priceFilter',
  //     label: `Price is between $${price[0]} and $${price[1]}`,
  //     onRemove: handlePriceFilterRemove,
  //   });
  // }

  return (
    <IndexFilters
      sortOptions={sortOptions}
      sortSelected={sortSelected}
      queryValue={search}
      queryPlaceholder="Searching in all"
      onQueryChange={handleSearchFilterChange}
      onQueryClear={handleSearchFilterRemove}
      onSort={handleSortChange}
      tabs={[]}
      selected={selected}
      onSelect={setSelected}
      canCreateNewView={false}
      filters={filters}
      appliedFilters={appliedFilters}
      onClearAll={handleFiltersClearAll}
      mode={mode}
      setMode={setMode}
      isFlushWhenSticky={true}
    />
  );
}