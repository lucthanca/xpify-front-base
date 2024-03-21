import {
  IndexFilters,
  useSetIndexFiltersMode,
  IndexFiltersMode,
  ChoiceList,
  RangeSlider,
} from '@shopify/polaris';
import { debounce } from 'lodash';
import { useState, useCallback, useMemo } from 'react';

const TAG_FILTER_KEY = 'filter_tag'

export default function Search({
  searchFilter, setSearchFilter,
  planFilter, setPlanFilter,
  categoryFilter, setCategoryFilter,
  tagFilter, setTagFilter,
  priceFilter, setPriceFilter,
  debounceLoading, setDebounceLoading,
  sortSelected, setSortSelected,
  pricingPlans,
  categories,
  tags,
  sortOptions,
  shouldPinTagFilter,
}) {
  // console.log('re-render-searchComponent');

  const [search, setSearch] = useState(searchFilter);
  const [price, setPrice] = useState(priceFilter);
  const [selected, setSelected] = useState(0);
  const {mode, setMode} = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const debounceSearch = useCallback(debounce((nextValue) => {
    setSearchFilter(nextValue);
    setDebounceLoading(false);
  }, 300), []);
  const handleSearchFilterChange = useCallback((value) => {
    setSearch(value);
    debounceSearch(value);
    setDebounceLoading(true);
  }, []);
  const debouncePrice = useCallback(debounce((nextValue) => {
    setPriceFilter(nextValue);
    setDebounceLoading(false);
  }, 200), []);
  const handlePriceFilterChange = useCallback((value) => {
    setPrice(value);
    debouncePrice(value);
    setDebounceLoading(true);
  }, []);
  const handlePlanFilterChange = useCallback(
    (value) => setPlanFilter(value),
    [],
  );
  const handleCategoryFilterChange = useCallback(
    (value) => setCategoryFilter(value),
    [],
  );
  const handleTagFilterChange = useCallback((value) => setTagFilter(value), []);

  const handleSearchFilterRemove = useCallback(
    () => setSearchFilter(undefined),
    [],
  );
  const handlePlanFilterRemove = useCallback(
    () => setPlanFilter(undefined),
    [],
  );
  const handleCategoryFilterRemove = useCallback(
    () => setCategoryFilter(undefined),
    [],
  );
  const handleTagFilterRemove = useCallback(() => setTagFilter([]), [],);
  const handlePriceFilterRemove = useCallback(
    () => setPriceFilter(undefined),
    [],
  );

  const handleFiltersClearAll = useCallback(() => {
    if (pricingPlans) {
      handlePlanFilterRemove();
    }
    handleCategoryFilterRemove();
    handleTagFilterRemove();
    handlePriceFilterRemove();
  }, [
    handlePlanFilterRemove,
    handleCategoryFilterRemove,
    handleTagFilterRemove,
    handlePriceFilterRemove
  ]);

  const filters = useMemo(() => {
    var result = [];
    if (pricingPlans) {
      result.push({
        key: 'planFilter',
        label: 'Plan',
        filter: (
          <ChoiceList
            title="Plan"
            titleHidden
            choices={pricingPlans}
            selected={planFilter || []}
            onChange={handlePlanFilterChange}
          />
        ),
        shortcut: false,
      });
    }
    if (categories) {
      result.push(
        {
          key: 'categoryFilter',
          label: 'Category',
          filter: (
            <ChoiceList
              title="Category"
              titleHidden
              choices={categories}
              selected={categoryFilter || []}
              onChange={handleCategoryFilterChange}
            />
          ),
          shortcut: true,
        }
      );
    }
    if (tags) {
      result.push(
        {
          key: TAG_FILTER_KEY,
          label: 'Tag',
          filter: (
            <ChoiceList
              title="Tag"
              titleHidden
              choices={tags}
              selected={tagFilter}
              onChange={handleTagFilterChange}
              allowMultiple
            />
          ),
          shortcut: true,
        }
      );
      // put a dummy filter to pin the tag filter to tell the FiltersBar render the tag filter
      // @see node_modules/@shopify/polaris/build/esm/components/Filters/components/FiltersBar
      // 62: useOnValueChange(filters.length, ...)
      shouldPinTagFilter && result.push({key: 'dummy'});
    }
    result.push(
      {
        key: 'priceFilter',
        label: 'Price',
        filter: (
          <RangeSlider
            label="Price is between"
            labelHidden
            value={price || [0, 19]}
            prefix="$"
            output
            min={0}
            max={100}
            step={1}
            onChange={handlePriceFilterChange}
          />
        ),
        shortcut: false
      }
    );

    return result;
  }, [tagFilter, tags, shouldPinTagFilter]);

  const appliedFilters = [];
  if (planFilter && planFilter.length > 0) {
    appliedFilters.push({
      key: 'planFilter',
      label: planFilter.map((val) => `Plan is: ${pricingPlans.find(item => item.value === val)?.label}`),
      onRemove: handlePlanFilterRemove,
    });
  }
  if (categoryFilter && categoryFilter.length > 0) {
    appliedFilters.push({
      key: 'categoryFilter',
      label: categoryFilter.map((val) => `Category is: ${categories.find(item => item.value === val)?.label}`),
      onRemove: handleCategoryFilterRemove,
    });
  }
  if (tagFilter?.length > 0) {
    appliedFilters.push({
      key: TAG_FILTER_KEY,
      label: `Tag in: ` + tagFilter.map((val) => `${tags.find(item => item.value === val)?.label}`).join(','),
      onRemove: handleTagFilterRemove,
    });
  }
  if (price) {
    appliedFilters.push({
      key: 'priceFilter',
      label: `Price is between $${price[0]} and $${price[1]}`,
      onRemove: handlePriceFilterRemove,
    });
  }

  return (
    <IndexFilters
      sortOptions={sortOptions}
      sortSelected={sortSelected}
      queryValue={search}
      queryPlaceholder="Searching in all sections"
      onQueryChange={handleSearchFilterChange}
      onQueryClear={handleSearchFilterRemove}
      onSort={setSortSelected}
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

  function disambiguateLabel(key, value) {
    switch (key) {
      case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'accountStatus':
        return (value).map((val) => `Customer ${val}`).join(', ');
      default:
        return value;
    }
  }

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}
