import { Page, Badge, Card, Layout, Button, Icon, Text, ProgressBar, BlockStack, Box, Banner, InlineGrid, SkeletonPage, SkeletonBodyText, SkeletonDisplayText, List, Image } from '@shopify/polaris';
import { ViewIcon, PaymentIcon } from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { memo } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {gql, useQuery, useMutation} from "@apollo/client";

import SkeletonProduct from '~/components/product/skeleton';
import CollapsibleButton from "~/components/collapsible/guide";
import GallerySlider from '~/components/splide/gallery';
import ModalInstallSection from '~/components/product/manage';
import ProductCarousel from '~/components/splide/product';
import ModalProduct from '~/components/product/modal';
import BannerDefault from '~/components/banner/default';
import { SECTION_QUERY, RELATED_SECTIONS_QUERY } from "~/queries/section-builder/product.gql";
import { THEMES_QUERY } from "~/queries/section-builder/theme.gql";
import { REDIRECT_BILLING_PAGE_MUTATION } from "~/queries/section-builder/other.gql";

const skeleton = (
  <SkeletonPage primaryAction backAction>
    <Layout>
      <Layout.Section>
        <BlockStack gap={400}>
          <Card sectioned>
            <SkeletonBodyText lines={7} />
          </Card>
          <Card sectioned>
            <Text as='div'>
              <BlockStack gap={400}>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={5} />
              </BlockStack>
            </Text>
          </Card>
          <Card sectioned>
            <Text as='div'>
              <BlockStack gap={400}>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={3} />
              </BlockStack>
            </Text>
          </Card>
          <Card sectioned>
            <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
          </Card>
        </BlockStack>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);

function SectionDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { key } = useParams();

  const [isShowPopupManage, setIsShowPopupManage] = useState(false);
  const [bannerAlert, setBannerAlert] = useState(undefined);
  const [progress, setProgress] = useState(0);

  const { data:section, loading:sectionL, error:sectionE, refetch:sectionR } = useQuery(SECTION_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: key
    }
  });
  const { data:themes, loading:themesL, error:themesE } = useQuery(THEMES_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const { data:productRelated, loading:productRelatedL, error:productRelatedE } = useQuery(RELATED_SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: key
    }
  });
  const [redirectPurchase, { data:purchase, loading:purchaseL, error:purchaseE }] = useMutation(REDIRECT_BILLING_PAGE_MUTATION);

  const handlePurchase = useCallback(async () => {
    await redirectPurchase({ 
        variables: {
            name: section.getSection?.url_key,
            interval: 'ONE_TIME',
            is_plan: false
        }
     });
  }, [section]);
  const handleRedirectPlansPage = useCallback(() => {
    navigate(`/plans`);
    window.scrollTo(0,0);
  }, []);


  useEffect(() => {
    if (purchase?.redirectBillingUrl?.message) {
      setBannerAlert({
        'title': purchase.redirectBillingUrl.message,
        'tone': purchase?.redirectBillingUrl?.tone ?? "critical"
      });
    }
    if (purchaseE?.graphQLErrors?.length) {
      setBannerAlert({
        'title': purchaseE.message,
        'tone': 'critical',
        'content': purchaseE.graphQLErrors
      });
    }
  }, [purchase, purchaseE]);

  console.log("re-render-pageSection");
  return (
    section?.getSection !== undefined
    ? <Page
      backAction={{content: 'Products', onAction: () => navigate(-1)}}
      title={section.getSection.name}
      titleMetadata={<Badge tone="success">v{section.getSection.version}</Badge>}
      subtitle={section.getSection?.price ? `$${section.getSection?.price} or update to ${section.getSection?.pricing_plan?.name}` : 'Free'}
      compactTitle
      primaryAction={{content: 'Manage Section', onAction: () => {setIsShowPopupManage(!isShowPopupManage)}}}
      secondaryActions={[
        {
          content: 'View in demo site',
          icon: ViewIcon,
          url: section?.getSection?.demo_link,
          disabled: !section?.getSection?.demo_link,
          helpText: !section?.getSection?.demo_link ? 'This product has no demo yet.' : '',
          onAction: () => {}
        },
        {
          content: !section?.getSection?.actions?.purchase ? 'Purchased' : 'Purchase',
          disabled: !section?.getSection?.actions?.purchase,
          helpText: 'Own forever this section.',
          loading: purchaseL,
          onAction: () => handlePurchase()
        }
      ]}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={400}>
            {
              (!section.getSection.actions?.install) &&
              <Banner
                title="You cann't use this section now!"
                action={{
                  content: 'Purchase $' + section.getSection.price,
                  icon: PaymentIcon,
                  loading: purchaseL,
                  onAction: () => handlePurchase()
                }}
                secondaryAction={{
                  content: 'View Plan', icon: ViewIcon,
                  onAction: () => handleRedirectPlansPage()
                }}
                tone='warning'
              >
                <BlockStack gap={200}>
                  <Text variant="headingSm">How to use this section?</Text>
                  <List>
                    {
                      section.getSection.actions?.purchase &&
                      <List.Item>
                        <Text variant="bodySm">Own forever: Purchase once.</Text>
                      </List.Item>
                    }
                    {
                      section.getSection.actions?.plan &&
                      <List.Item>
                        <Text variant="bodySm">Periodic payments: Own all sections included in the plan ({section.getSection.pricing_plan.name})</Text>
                      </List.Item>
                    }
                  </List>
                </BlockStack>
              </Banner>
            }

            <BannerDefault bannerAlert={bannerAlert} setBannerAlert={setBannerAlert} />

            <Card title="Gallery" padding={0}>
              <GallerySlider gallery={section.getSection?.images ?? []} height={'30rem'} />
            </Card>
            {
              section.getSection.description && 
              <Card title="Description">
                <Text variant="headingMd">Description</Text>
                <Box padding="200">
                  <div dangerouslySetInnerHTML={{__html: section.getSection.description}}></div>
                </Box>
              </Card>
            }
            {
              section.getSection.release_note && 
              <Card title="Release Note">
                <Text variant="headingMd">Release Note</Text>
                <Box padding="200">
                  <div dangerouslySetInnerHTML={{__html: section.getSection.release_note}}></div>
                </Box>
              </Card>
            }

            {
              productRelated?.getRelatedSections !== undefined
              ? productRelated.getRelatedSections.length > 0 &&
              <Card title="Related">
                <BlockStack gap={200}>
                  <Text variant="headingMd" as="h2">Related sections</Text>
                  <Box paddingBlockStart="200">
                    <ProductCarousel
                      configSplide={{
                        options: {
                          perPage: 3,
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
                          interval: 3000,
                          rewind: true
                        }
                      }}
                      items={productRelated.getRelatedSections ?? []}
                    />
                  </Box>
                </BlockStack>
              </Card>
            : <Card>
                <BlockStack gap={200}>
                <SkeletonDisplayText></SkeletonDisplayText>
                  <Box paddingBlockStart="200">
                    <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
                  </Box>
                </BlockStack>
              </Card>
            }

            <Card title="Guide">
              <BlockStack gap={200}>
                <Text variant="headingMd">Setup guide</Text>
                <Text variant="bodySm">Only 3 simple steps to add any sections & blocks to your theme</Text>
                <ProgressBar progress={progress} size="small" />
              </BlockStack>
              <Box paddingBlockStart={400}>
                <BlockStack gap={200}>
                  <CollapsibleButton options={{
                    'id': 'setup_guide_1',
                    'progress': 100/3,
                    'title': 'Step 1',
                    'content': 'By giving values to a key, this technique is used to store objects in localStorage. This value can be of any datatype, including text, integer, object, array, and so on.'
                  }} setProgress={setProgress} />
                  <CollapsibleButton options={{
                    'id': 'setup_guide_2',
                    'progress': 100/3,
                    'title': 'Step 2',
                    'content': 'By giving values to a key',
                    'image': <Image source="https://sections.puco.io/images/general/enable-app.gif" />
                  }} setProgress={setProgress} />
                  <CollapsibleButton options={{
                    'id': 'setup_guide_3',
                    'progress': 100/3,
                    'title': 'Step 3',
                    'content': 'This value can be of any datatype'
                  }} setProgress={setProgress} />
                </BlockStack>
              </Box>
            </Card>
          </BlockStack>
        </Layout.Section>

        {
          section &&
          <ModalInstallSection
            currentProduct={section?.getSection}
            themes={themes?.getThemes}
            isShowPopup={isShowPopupManage}
            setIsShowPopup={setIsShowPopupManage}
            setBannerAlert={setBannerAlert}
            reloadProduct={() => sectionR()}
          />
        }
      </Layout>
    </Page>
    : skeleton
  );
}

export default memo(SectionDetail);
