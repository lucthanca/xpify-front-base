import {
  Page,
  Layout,
  Card,
  SkeletonDisplayText,
  Box,
  Text,
  BlockStack
} from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {gql, useQuery, useMutation} from "@apollo/client";

import '~/assets/style.css';
import Search from '~/components/input/search';
import ProductCarousel from '~/components/splide/product';
import ProductList from '~/components/product/list';
import SkeletonProduct from '~/components/product/skeleton';
import ModalProduct from '~/components/modal/product';
import Paginate from '~/components/paginate/default';
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";

const graphQlGetSections = gql`
  query GET(
    $search: String,
    $filter: SectionFilterInput,
    $sort: SectionSortInput,
    $pageSize: Int = 20,
    $currentPage: Int = 1
  ) {
    getSections(
      search: $search,
      filter: $filter,
      sort: $sort,
      pageSize: $pageSize,
      currentPage: $currentPage
    ) {
      items {
        entity_id
        is_enable
        plan_id
        name
        images {
          src
        }
        url_key
        price
        src
        version
        description
        release_note
      }
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;
const graphQlGetSection = gql`
  query GET($key: String!) {
    getSection(key: $key) {
      pricing_plan {
        name
        code
      }
      categories
      tags
    }
  }
`;

const graphQlGetPricingPlans = gql`
    query Get {
      getPricingPlans {
        entity_id
        name
      }
    }
`;
const graphQlGetCategories = gql`
    query Get {
      getCategories {
        entity_id
        name
      }
    }
`;
const graphQlGetTags = gql`
    query Get {
      getTags {
        entity_id
        name
      }
    }
`;
const graphQlGetSortOptions = gql`
    query Get {
      getSortOptions {
        label
        value
        directionLabel
      }
    }
`;

function Sections() {
  const { t } = useTranslation();
  const [searchFilter, setSearchFilter] = useState('');
  const [sortSelected, setSortSelected] = useState(['main_table.qty_sold desc']);
  const [planFilter, setPlanFilter] = useState(undefined);
  const [categoryFilter, setCategoryFilter] = useState(undefined);
  const [tagFilter, setTagFilter] = useState(undefined);
  const [priceFilter, setPriceFilter] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  const [isShowPopup, setIsShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});

  const handleShowModal = useCallback(() => {
    setIsShowPopup(!isShowPopup);
  }, []);

  const { data, loading, error } = useQuery(graphQlGetSections, {
    fetchPolicy: "network-only",
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
  const { data:productTopSells, loading:productTopSellsL, error:productTopSellsE } = useQuery(graphQlGetSections, {
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
  const { data:productMore, loading:loadingProduct, error:errorProduct } = useQuery(graphQlGetSection, {
    fetchPolicy: "network-only",
    variables: {
      key: currentProduct?.url_key ? currentProduct?.url_key : ''
    }
  });

  const { data: pricingPlans, loading: loadingPricingPlans, error: errorPricingPlans } = useQuery(graphQlGetPricingPlans, {
    fetchPolicy: "cache-and-network"
  });
  const { data: categories, loading: loadingCategories, error: errorCategories } = useQuery(graphQlGetCategories, {
    fetchPolicy: "cache-and-network"
  });
  const { data: tags, loading: loadingTags, error: errorTags } = useQuery(graphQlGetTags, {
    fetchPolicy: "cache-and-network"
  });
  const { data: sortOptions, loading: loadingSortOptions, error: errorSortOptions } = useQuery(graphQlGetSortOptions, {
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
              pricingPlans={pricingPlans?.getPricingPlans ? pricingPlans.getPricingPlans.map(item => ({
                value: item.entity_id,
                label: item.name
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
                <Text variant="headingLg" as="h2">Top Sells</Text>
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
                    handleShowModal={handleShowModal}
                    setCurrentProduct={setCurrentProduct}
                  />
                  : <SkeletonProduct total={5} columns={{ sm: 1, md: 3, lg: 5 }} />
                }
              </BlockStack>
            </Box>

            <Box padding={600}>
              <BlockStack gap={200}>
                {
                  (!loading || data?.getSections)
                  ? <ProductList items={data.getSections?.items ?? []} handleShowModal={handleShowModal} setCurrentProduct={setCurrentProduct} />
                  : <SkeletonProduct total={4} columns={{ sm: 1, md: 2, lg: 4 }} />
                }
              </BlockStack>
            </Box>
          </Card>
        </Layout.Section>

        <Layout.Section>
          {
            (!loading || data?.getSections)
            ? <Paginate
              pageInfo={data?.getSections.page_info ?? []}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
            : <SkeletonDisplayText maxWidth="true"></SkeletonDisplayText>
          }
        </Layout.Section>

        <ModalProduct currentProduct={currentProduct} productMore={productMore} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
      </Layout>
    </Page>
  );
}

export default Sections;
