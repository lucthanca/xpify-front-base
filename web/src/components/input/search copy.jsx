import {
  ChoiceList,
  RangeSlider,
  ResourceList,
  LegacyFilters,
  ResourceItem,
  OptionList,
} from '@shopify/polaris';
import {useState, useCallback, useMemo} from 'react';
import { SortIcon, ArrowUpIcon,  } from '@shopify/polaris-icons';

export default function Search({
  searchFilter, setSearchFilter,
  planFilter, setPlanFilter,
  categoryFilter, setCategoryFilter,
  tagFilter, setTagFilter,
  priceFilter, setPriceFilter,
  sortFilter, setSortFilter,
  pricingPlans,
  categories,
  tags,
  sortOptions
}) {
  console.log('re-render-searchComponent');

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
  const handleSortFilterChange = useCallback(
    (value) => setSortFilter(value),
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
  const handleSortFilterRemove = useCallback(
    () => setSortFilter(undefined),
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
    handleSortFilterRemove();
    handlePriceFilterRemove();
  }, [
    handlePlanFilterRemove,
    handleCategoryFilterRemove,
    handleTagFilterRemove,
    handleSortFilterRemove,
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
      shortcut: true,
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
    },
    {
      key: 'sortFilter',
      label: 'Sort',
      filter: (
        <OptionList
          onChange={handleSortFilterChange}
          options={sortOptions}
          selected={sortFilter || []}
        />
      ),
      shortcut: true,
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
  if (sortFilter && sortFilter.length > 0) {
    appliedFilters.push({
      key: 'sortFilter',
      label: sortFilter.map((val) => `Sort by: ${sortOptions.find(item => item.value === val)?.label}`),
      onRemove: handleSortFilterRemove,
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
    <ResourceList
      resourceName={
        {
          singular: 'sections',
          plural: 'sections'
        }
      }
      filterControl={
        <LegacyFilters
          queryValue={searchFilter}
          onQueryChange={handleSearchFilterChange}
          onQueryClear={handleSearchFilterRemove}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
        />
      }
      items={[
        {
          item: []
        }
      ]}
      renderItem={(item) => {
        return (
          <ResourceItem />
        )
      }}
    />
  );
}