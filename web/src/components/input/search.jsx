import {
  IndexFilters,
  useSetIndexFiltersMode,
  IndexFiltersMode,
  ChoiceList,
  RangeSlider,
} from '@shopify/polaris';
import { debounce } from 'lodash';
import { useState, useCallback, useMemo, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { PRICING_PLANS_QUERY, SORT_OPTIONS_QUERY, SORT_OPTIONS_QUERY_KEY } from '~/queries/section-builder/other.gql';
import { CATEGORIES_QUERY, CATEGORIES_QUERY_KEY } from '~/queries/section-builder/category.gql';
import { useTags } from '~/hooks/useTags';

export const TAG_FILTER_KEY = 'tag';
export const PLAN_FILTER_KEY = 'plan';
export const CATEGORY_FILTER_KEY = 'category';
export const PRICE_FILTER_KEY = 'price';
export const QUERY_SEARCH_KEY = '__query__';

function buildFilterKey (key) {
  return `${key}_filter`;
}

const useSearch = props => {
  const { onFilterChange, onFilterRemove, onSortChange } = props;
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

  const [categoryFilter, setCategoryFilter] = useState([]);
  const handleCategoryFilterChange = useCallback((value) => {
    if (onFilterChange) onFilterChange(CATEGORY_FILTER_KEY, value);
    setCategoryFilter(value);
  }, [onFilterChange]);
  const handleCategoryFilterRemove = useCallback(() => {
    if (onFilterChange) onFilterChange(CATEGORY_FILTER_KEY, []);
    setCategoryFilter([]);
  }, [onFilterChange]);

  const [tagFilter, setTagFilter] = useState([]);
  const handleTagFilterChange = useCallback((value) => {
    if (onFilterChange) onFilterChange(TAG_FILTER_KEY, value);
    setTagFilter(value);
  }, [onFilterChange]);
  const handleTagFilterRemove = useCallback(() => {
    if (onFilterChange) onFilterChange(TAG_FILTER_KEY, []);
    setTagFilter([]);
  }, [onFilterChange]);

  const [sortSelected, setSortSelected] = useState(['name asc']);
  const handleSortChange = useCallback((value) => {
    if (onSortChange) onSortChange(value);
    setSortSelected(value);
  }, [onSortChange]);
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
    return sortOptionsdt?.[SORT_OPTIONS_QUERY_KEY] ?? [];
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
  };
};

export default function Search({
  // searchFilter, setSearchFilter,
  // planFilter, setPlanFilter,
  // categoryFilter, setCategoryFilter,
  // tagFilter, setTagFilter,
  // priceFilter, setPriceFilter,
  // debounceLoading, setDebounceLoading,
  // sortSelected, setSortSelected,
  // pricingPlans,
  // categories,
  // tags,
  // sortOptions,
  shouldPinTagFilter,
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
  } = useSearch({ onFilterChange, onSortChange });

  // const [search, setSearch] = useState(searchFilter);
  // const [price, setPrice] = useState(priceFilter);
  const [selected, setSelected] = useState(0);
  const {mode, setMode} = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  // const debounceSearch = useCallback(debounce((nextValue) => {
  //   setSearchFilter(nextValue);
  //   setDebounceLoading(false);
  // }, 300), []);
  // const handleSearchFilterChange = useCallback((value) => {
  //   setSearch(value);
  //   debounceSearch(value);
  //   setDebounceLoading(true);
  // }, []);
  // const debouncePrice = useCallback(debounce((nextValue) => {
  //   setPriceFilter(nextValue);
  //   setDebounceLoading(false);
  // }, 200), []);
  // const handlePriceFilterChange = useCallback((value) => {
  //   setPrice(value);
  //   debouncePrice(value);
  //   setDebounceLoading(true);
  // }, []);
  // const handlePlanFilterChange = useCallback(
  //   (value) => setPlanFilter(value),
  //   [],
  // );
  // const handleCategoryFilterChange = useCallback(
  //   (value) => setCategoryFilter(value),
  //   [],
  // );
  // const handleTagFilterChange = useCallback((value) => setTagFilter(value), []);

  // const handleSearchFilterRemove = useCallback(
  //   () => setSearchFilter(undefined),
  //   [],
  // );
  // const handlePlanFilterRemove = useCallback(
  //   () => setPlanFilter(undefined),
  //   [],
  // );
  // const handleCategoryFilterRemove = useCallback(
  //   () => setCategoryFilter(undefined),
  //   [],
  // );
  // const handleTagFilterRemove = useCallback(() => setTagFilter([]), [],);
  // const handlePriceFilterRemove = useCallback(
  //   () => setPriceFilter(undefined),
  //   [],
  // );

  // const handleFiltersClearAll = useCallback(() => {
  //   if (pricingPlans) {
  //     handlePlanFilterRemove();
  //   }
  //   handleCategoryFilterRemove();
  //   handleTagFilterRemove();
  //   handlePriceFilterRemove();
  // }, [
  //   handlePlanFilterRemove,
  //   handleCategoryFilterRemove,
  //   handleTagFilterRemove,
  //   handlePriceFilterRemove
  // ]);
  const priceFilterJsx = useMemo(() => {
    return (
      <RangeSlider
        label="Price is between"
        labelHidden
        value={priceFilter}
        prefix="$"
        output
        min={0}
        max={999}
        step={10}
        onChange={handlePriceFilterChange}
      />
    );
  }, [priceFilter, handlePriceFilterChange]);
  const planFilterJsx = useMemo(() => {
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
    const result = [{
      key: buildFilterKey(PRICE_FILTER_KEY),
      label: 'Price',
      filter: priceFilterJsx,
      shortcut: false
    }];
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

    return result;
  }, [tagFilterJsx, shouldPinTagFilter, categoryFilterJsx, priceFilterJsx, planFilterJsx]);

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
      queryPlaceholder="Searching in all sections"
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
