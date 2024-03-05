import {
  TextField,
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  IndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  Badge,
} from '@shopify/polaris';
import {useState, useCallback, useMemo} from 'react';

export default function Search({
  searchFilter, setSearchFilter,
  planFilter, setPlanFilter,
  categoryFilter, setCategoryFilter,
  tagFilter, setTagFilter,
  priceFilter, setPriceFilter,
  sortSelected, setSortSelected,
  pricingPlans,
  categories,
  tags,
  sortOptions
}) {
  console.log('re-render-searchComponent');

  const [selected, setSelected] = useState(0);
  const {mode, setMode} = useSetIndexFiltersMode(IndexFiltersMode.Filtering);

  const handleSearchFilterChange = useCallback(
    (value) => setSearchFilter(value),
    [],
  );
  const handlePlanFilterChange = useCallback(
    (value) => setPlanFilter(value),
    [],
  );
  const handleCategoryFilterChange = useCallback(
    (value) => setCategoryFilter(value),
    [],
  );
  const handleTagFilterChange = useCallback(
    (value) => setTagFilter(value),
    [],
  );
  const handlePriceFilterChange = useCallback(
    (value) => setPriceFilter(value),
    [],
  );

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
  const handleTagFilterRemove = useCallback(
    () => setTagFilter(undefined),
    [],
  );
  const handlePriceFilterRemove = useCallback(
    () => setPriceFilter(undefined),
    [],
  );

  const handleFiltersClearAll = useCallback(() => {
    handlePlanFilterRemove();
    handleCategoryFilterRemove();
    handleTagFilterRemove();
    handlePriceFilterRemove();
  }, [
    handlePlanFilterRemove,
    handleCategoryFilterRemove,
    handleTagFilterRemove,
    handlePriceFilterRemove
  ]);

  const filters = [
    {
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
    },
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
    },
    {
      key: 'tagFilter',
      label: 'Tag',
      filter: (
        <ChoiceList
          title="Tag"
          titleHidden
          choices={tags}
          selected={tagFilter || []}
          onChange={handleTagFilterChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'priceFilter',
      label: 'Price',
      filter: (
        <RangeSlider
          label="Price is between"
          labelHidden
          value={priceFilter || [0, 19]}
          prefix="$"
          output
          min={0}
          max={50}
          step={1}
          onChange={handlePriceFilterChange}
        />
      ),
      shortcut: false
    }
  ];

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
  if (tagFilter && tagFilter.length > 0) {
    appliedFilters.push({
      key: 'tagFilter',
      label: `Tag in: ` + tagFilter.map((val) => `${tags.find(item => item.value === val)?.label}`).join(','),
      onRemove: handleTagFilterRemove,
    });
  }
  if (priceFilter) {
    appliedFilters.push({
      key: 'priceFilter',
      label: `Price is between $${priceFilter[0]} and $${priceFilter[1]}`,
      onRemove: handlePriceFilterRemove,
    });
  }

  return (
    <IndexFilters
      sortOptions={sortOptions}
      sortSelected={sortSelected}
      queryValue={searchFilter}
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