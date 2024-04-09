import CategoryCollection from '~/components/SectionCollection/categoryCollection';;
import { BlockStack, Box } from '@shopify/polaris';
import BestSeller from '~/components/BestSellers/bestSellerSlider';
import { useSectionCollection, useSectionListing } from '~/talons/section/useSectionCollection';
import Search from '~/components/input/search';
import ProductList from '~/components/product/list.jsx';
const LISTING_TYPE_CATEGORY = 'categories';
const LISTING_TYPE_SECTION = 'sections';

const SectionListing = props => {

  // const {
  //   searchFilter,
  //   setSearchFilter,
  //   planFilter,
  //   setPlanFilter,
  //   categoryFilter,
  //   setCategoryFilter,
  //   tagFilter,
  //   setTagFilter,
  //   priceFilter,
  //   setPriceFilter,
  //   sortSelected,
  //   setSortSelected,
  //   pricingPlanOptions,
  //   categoriesOptions,
  //   tagOptions,
  //   sortOptions,
  //   sections,
  //   currentPage,
  //   setCurrentPage,
  //   sectionCollectionPageInfo,
  //   debounceLoading,
  //   setDebounceLoading,
  //   shouldPinTagFilter,
  // } = useSectionCollection();

  const talonProps = useSectionListing();
  const {
    handleFilterChange,
    sections,
    hasFilter,
    shouldPinTagFilter,
    handleSortChange,
  } = talonProps;
  const bestSellerSliderConfig = {
    perPage: 5,
    gap: '1rem',
    pagination: false,
    breakpoints:{
      425: { perPage: 1 },
      768: { perPage: 3, gap: '0.5rem' },
      1200: { perPage: 4 },
      2560: { perPage: 5 }
    },
  }
  return (
    <>
      <Search shouldPinTagFilter={shouldPinTagFilter} onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
      <BlockStack gap='400'>
        <BestSeller slideConfig={bestSellerSliderConfig} />
        {hasFilter && (<ProductList items={sections ?? []} columns={{sm: 1, md: 2, lg: 4}} /> )}
        {!hasFilter && <CategoryCollection />}
      </BlockStack>
    </>
  );
};

export default SectionListing;
