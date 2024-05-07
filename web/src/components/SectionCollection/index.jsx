import { memo, useState } from 'react';
import { BlockStack, Box, Card, Layout, Page, SkeletonDisplayText, Text } from '@shopify/polaris';
import Search from '~/components/block/input/search';
// import SkeletonProduct from '~/components/block/product/skeleton';
// import ProductList from '~/components/block/product/list';
import Paginate from '~/components/block/paginate/default';
import { useSectionCollection } from '~/talons/section/useSectionCollection';
import BestSeller from '~/components/BestSellers';
import CategoryCollection from '~/components/SectionCollection/categoryCollection';
import { ComplexSectionCollectionProvider, ListingProvider } from '~/context';
import SectionListing from '~/components/SectionCollection/listingV2';

const SectionCollection = props => {
  const {
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
  } = useSectionCollection();

  const splideConfig = {
    perPage: 5,
    gap: '1rem',
    pagination: false,
    breakpoints:{
      425: { perPage: 1 },
      768: { perPage: 2, gap: '0.5rem' },
      2560: { perPage: 4 }
    },
  }

  return (
    <>
      <Layout.Section>
        <Card padding='0'>
          <Search
            searchFilter={searchFilter} setSearchFilter={setSearchFilter}
            planFilter={planFilter} setPlanFilter={setPlanFilter}
            categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
            tagFilter={tagFilter} setTagFilter={setTagFilter}
            priceFilter={priceFilter} setPriceFilter={setPriceFilter}
            sortSelected={sortSelected} setSortSelected={setSortSelected}
            // pricingPlans={pricingPlanOptions}
            // categories={categoriesOptions}
            // tags={tagOptions}
            // sortOptions={sortOptions}
            debounceLoading={debounceLoading}
            setDebounceLoading={setDebounceLoading}
            shouldPinTagFilter={shouldPinTagFilter}
          />

          <Box padding='600'>
            <BlockStack gap='400'>
              <BestSeller slideConfig={splideConfig} />
              <BlockStack gap='200'>
                {/*{*/}
                {/*  !debounceLoading && sections !== undefined ? (*/}
                {/*    <ProductList items={sections ?? []} columns={{sm: 1, md: 2, lg: 4}} />*/}
                {/*  ) : (<SkeletonProduct total={4} columns={{ sm: 1, md: 2, lg: 4 }} />)*/}
                {/*}*/}
                <CategoryCollection />
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </Layout.Section>

      <Layout.Section>
        <Paginate
          pageInfo={sectionCollectionPageInfo ?? []}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Layout.Section>
    </>
  );
};

const SectionCollectionV2 = props => {

  return (
    <ComplexSectionCollectionProvider>
      <Layout.Section>
        <Card padding='0'>
          <SectionListing />
        </Card>
      </Layout.Section>
    </ComplexSectionCollectionProvider>
  );
};

const SectionCollectionV3 = () => {
  return (
    <ListingProvider>
      <Layout.Section>
        <Card padding='0'>
          <SectionListing />
        </Card>
      </Layout.Section>
    </ListingProvider>
  );
};

export default memo(SectionCollectionV3);
