import { memo, useState } from 'react';
import { BlockStack, Box, Card, Layout, Page, SkeletonDisplayText, Text } from '@shopify/polaris';
import Search from '~/components/input/search';
import ProductCarousel from '~/components/splide/product';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import SkeletonProduct from '~/components/product/skeleton';
import ProductList from '~/components/product/list';
import Paginate from '~/components/block/paginate/default';
import { useSectionCollection } from '~/talons/section/useSectionCollection';
import TopSellProducts from './topSellProducts';

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
    setDebounceLoading
  } = useSectionCollection();

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card padding='0'>
            <Search
              searchFilter={searchFilter} setSearchFilter={setSearchFilter}
              planFilter={planFilter} setPlanFilter={setPlanFilter}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              tagFilter={tagFilter} setTagFilter={setTagFilter}
              priceFilter={priceFilter} setPriceFilter={setPriceFilter}
              sortSelected={sortSelected} setSortSelected={setSortSelected}
              pricingPlans={pricingPlanOptions}
              categories={categoriesOptions}
              tags={tagOptions}
              sortOptions={sortOptions}
              debounceLoading={debounceLoading}
              setDebounceLoading={setDebounceLoading}
            />

            <TopSellProducts />

            <Box padding='600'>
              <BlockStack gap='200'>
                {
                  !debounceLoading && sections !== undefined ? (
                    <ProductList items={sections ?? []} columns={{sm: 1, md: 2, lg: 4}} />
                  ) : (<SkeletonProduct total={4} columns={{ sm: 1, md: 2, lg: 4 }} />)
                }
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {
            sectionCollectionPageInfo !== undefined ? (
              <Paginate
                pageInfo={sectionCollectionPageInfo ?? []}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            ) : (<SkeletonDisplayText maxWidth="true"></SkeletonDisplayText>)
          }
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default memo(SectionCollection);
