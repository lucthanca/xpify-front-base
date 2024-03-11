import '~/assets/style.css';
import { memo, useState } from "react";
import {
  Page,
  Layout,
  Card,
  SkeletonDisplayText,
  Box,
  Text,
  BlockStack
} from "@shopify/polaris";
import { useQuery } from "@apollo/client";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import Search from '~/components/input/search';
import ProductCarousel from '~/components/splide/product';
import ProductList from '~/components/product/list';
import SkeletonProduct from '~/components/product/skeleton';
import Paginate from '~/components/block/paginate/default';
import { SECTIONS_QUERY } from "~/queries/section-builder/product.gql";
import { CATEGORIES_QUERY } from "~/queries/section-builder/category.gql";
import { TAGS_QUERY } from "~/queries/section-builder/tag.gql";
import { PRICING_PLANS_QUERY, SORT_OPTIONS_QUERY } from "~/queries/section-builder/other.gql";

const defaultSort = ['main_table.name asc'];

function Sections() {
  const [searchFilter, setSearchFilter] = useState('');
  const [sortSelected, setSortSelected] = useState(defaultSort);
  const [planFilter, setPlanFilter] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [tagFilter, setTagFilter] = useState(undefined);
  const [priceFilter, setPriceFilter] = useState(undefined);
  const [debounceLoading, setDebounceLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data:sections } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      search: searchFilter,
      filter: {
        category_id: categoryFilter ?? [],
        tag_id: tagFilter ?? [],
        plan_id: planFilter ?? [],
        price: priceFilter ? {
          min: priceFilter[0],
          max: priceFilter[1]
        } : {}
      },
      sort: sortSelected ? (([column, order]) => ({ column, order }))(sortSelected[0].split(' ')) : {},
      pageSize: 12,
      currentPage: currentPage
    }
  });
  const { data:productTopSells } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-first",
    variables: {
      sort: {
        'column': 'qty_sold',
        'order': 'desc'
      },
      pageSize: 12,
      currentPage: 1
    }
  });

  const { data: pricingPlans } = useQuery(PRICING_PLANS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: categories } = useQuery(CATEGORIES_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: tags } = useQuery(TAGS_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  const { data: sortOptions } = useQuery(SORT_OPTIONS_QUERY, {
    fetchPolicy: "cache-and-network"
  });

  console.log('re-render-homePage');
  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section>
          <Card padding={0}>
            <Search
              searchFilter={searchFilter} setSearchFilter={setSearchFilter}
              planFilter={planFilter} setPlanFilter={setPlanFilter}
              categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
              tagFilter={tagFilter} setTagFilter={setTagFilter}
              priceFilter={priceFilter} setPriceFilter={setPriceFilter}
              sortSelected={sortSelected} setSortSelected={setSortSelected}
              debounceLoading={debounceLoading} setDebounceLoading={setDebounceLoading}
              pricingPlans={pricingPlans?.getPricingPlans ? pricingPlans.getPricingPlans.map(item => ({
                value: item.plan.id,
                label: item.plan.name
              })) : []}
              categories={categories?.getCategories ? categories.getCategories.map(item => ({
                value: item.entity_id,
                label: item.name
              })) : []}
              tags={tags?.getTags ? tags.getTags.map(item => ({
                value: item.entity_id,
                label: item.name
              })) : []}
              sortOptions={sortOptions?.getSortOptions ?? []}
            />

            <Box padding={600}>
              <BlockStack gap={200}>
                <BlockStack>
                  <Text variant="headingMd" as="h2">Top Sells</Text>
                </BlockStack>
                {
                  productTopSells?.getSections
                  ? <ProductCarousel
                    configSplide={{
                      options: {
                        perPage: 5,
                        gap: '1rem',
                        pagination: false,
                        breakpoints:{
                          425: {
                            perPage: 1
                          },
                          768: {
                            perPage: 3,
                            gap: '0.5rem'
                          },
                          2560: {
                            perPage: 5
                          }
                        },
                        autoScroll: {
                          pauseOnHover: true,
                          pauseOnFocus: true,
                          rewind: true,
                          speed: 1.5
                        }
                      },
                      extensions: {AutoScroll}
                    }}
                    breakpoints={{
                      425: {
                        perPage: 1
                      },
                      768: {
                        perPage: 3,
                        gap: '0.5rem'
                      },
                      1024: {
                        perPage: 5
                      },
                      2560: {
                        perPage: 6
                      }
                    }}
                    items={productTopSells.getSections?.items ?? []}
                  />
                  : <SkeletonProduct total={5} columns={{ sm: 1, md: 3, lg: 5 }} />
                }
              </BlockStack>
            </Box>

            <Box padding={600}>
              <BlockStack gap={200}>
                {
                  !debounceLoading && sections?.getSections !== undefined
                  ? <ProductList items={sections.getSections?.items ?? []} columns={{sm: 1, md: 2, lg: 4}} />
                  : <SkeletonProduct total={4} columns={{ sm: 1, md: 2, lg: 4 }} />
                }
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {
            sections?.getSections !== undefined
            ? <Paginate
              pageInfo={sections?.getSections.page_info ?? []}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            : <SkeletonDisplayText maxWidth="true"></SkeletonDisplayText>
          }
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default memo(Sections);
