import { Page, Badge, Card, Layout, Button, Icon, Text, ProgressBar, BlockStack, Box, Banner, InlineGrid, SkeletonPage, SkeletonBodyText, SkeletonDisplayText } from '@shopify/polaris';
import { ViewIcon } from '@shopify/polaris-icons';
import { useCallback, useState } from 'react';
import { memo } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import SkeletonProduct from '~/components/product/skeleton';

import {gql, useQuery, useMutation} from "@apollo/client";
import CollapsibleButton from "~/components/collapsible/button";
import GallerySlider from '~/components/splide/gallery';
import ModalInstallSection from '~/components/modal/installSection';
import ProductCarousel from '~/components/splide/product';
import ModalProduct from '~/components/modal/product';

const graphQlGetSection = gql`
  query GET($key: String!) {
    getSection(key: $key) {
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
      demo_link
      pricing_plan {
        name
        code
      }
      categories
      tags
    }
  }
`;
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
    }
  }
`;
const graphQlGetSectionMore = gql`
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
const graphQlGetThemes = gql`
  query Get {
    getThemes {
      id
      name
      role
      errors
    }
  }
`;
const skeleton = (
  <SkeletonPage primaryAction backAction>
    <Layout>
      <Layout.Section>
        <BlockStack gap={400}>
          <Card sectioned>
            <SkeletonBodyText lines={7} />
          </Card>
          <Card sectioned>
            <Text>
              <BlockStack gap={400}>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={5} />
              </BlockStack>
            </Text>
          </Card>
          <Card sectioned>
            <Text>
              <BlockStack gap={400}>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={3} />
              </BlockStack>
            </Text>
          </Card>
        </BlockStack>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);

function SectionDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isShowPopupManage, setIsShowPopupManage] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(undefined); 

  const [isShowPopup, setIsShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({});

  const { data:section, loading:sectionL, error:sectionE } = useQuery(graphQlGetSection, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: 'about-01'
    }
  });
  const { data:themes, loading:themesL, error:themesE } = useQuery(graphQlGetThemes, {
    fetchPolicy: "cache-and-network",
  });
  const { data:productRelated, loading:productRelatedL, error:productRelatedE } = useQuery(graphQlGetSections, {
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
  const { data:productMore, loading:loadingProduct, error:errorProduct } = useQuery(graphQlGetSectionMore, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: currentProduct?.url_key ? currentProduct?.url_key : ''
    }
  });

  const handleShowModal = useCallback(() => {
    setIsShowPopup(!isShowPopup);
  }, []);

  console.log("re-render-pageSection");
  return (
    (!sectionL || section)
    ? <Page
      backAction={{content: 'Products', onAction: () => navigate(-1)}}
      title={section.getSection.name}
      titleMetadata={<Badge tone="success">v{section.getSection.version}</Badge>}
      subtitle="$9 or update to Pro"
      compactTitle
      primaryAction={{content: 'Manage Section', onAction: () => {setIsShowPopupManage(!isShowPopupManage)}}}
      secondaryActions={[
        {
          content: 'View in demo site',
          icon: ViewIcon,
          url: section.getSection.demo_link,
          onAction: () => {}
        }
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={400}>
            {
              bannerAlert &&
              <Banner
                {...bannerAlert}
                onDismiss={() => {setBannerAlert(undefined)}}
              >
                <BlockStack gap={200}>
                  <Text variant="bodySm">{bannerAlert.content}</Text>
                </BlockStack>
              </Banner>
            }

            <Card title="Gallery" padding={0}>
              <GallerySlider gallery={section.getSection.images} height={'30rem'} />
            </Card>
            {
              section.getSection.description && 
              <Card title="Description">
                <Text variant="headingMd">Description</Text>
                <Box padding="400">
                  <div dangerouslySetInnerHTML={{__html: section.getSection.description}}></div>
                </Box>
              </Card>
            }
            {
              section.getSection.release_note && 
              <Card title="Release Note">
                <Text variant="headingMd">Release Note</Text>
                <Box padding="400">
                  <div dangerouslySetInnerHTML={{__html: section.getSection.release_note}}></div>
                </Box>
              </Card>
            }
            <Card title="Related">
              <BlockStack gap={200}>
                <Text variant="headingMd" as="h2">Related sections</Text>
                {
                  productRelated?.getSections
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
                            perPage: 2,
                            gap: '0.5rem'
                          },
                          2560: {
                            perPage: 3
                          }
                        },
                        autoplay: true,
                        interval: 3000
                      }
                    }}
                    items={productRelated.getSections?.items ?? []}
                    handleShowModal={handleShowModal}
                    setCurrentProduct={setCurrentProduct}
                  />
                  : <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
                }
              </BlockStack>
            </Card>
            <Card title="Guide">
              <BlockStack gap={200}>
                <Text variant="headingMd">Setup guide</Text>
                <Text variant="bodySm">Only 3 simple steps to add any sections & blocks to your theme</Text>
                <ProgressBar progress={33} size="small" />
              </BlockStack>
              <Box paddingBlockStart={400}>
                <BlockStack gap={200}>
                  <CollapsibleButton />
                  <CollapsibleButton />
                  <CollapsibleButton />
                </BlockStack>
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>

        {
          section &&
          <ModalInstallSection currentProduct={section?.getSection} themes={themes?.getThemes} isShowPopup={isShowPopupManage} setIsShowPopup={setIsShowPopupManage} setBannerAlert={setBannerAlert} />
        }
        <ModalProduct currentProduct={currentProduct} productMore={productMore} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
      </Layout>
    </Page>
    : skeleton
  );
}

export default memo(SectionDetail);
