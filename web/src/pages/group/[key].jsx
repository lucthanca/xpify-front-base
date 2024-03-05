import { Page, Badge, Card, Layout, Button, Icon, Text, ProgressBar, BlockStack, Box, Banner, InlineGrid, SkeletonPage, SkeletonBodyText, SkeletonDisplayText, List } from '@shopify/polaris';
import { ViewIcon, PaymentIcon } from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { memo } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {gql, useQuery, useMutation} from "@apollo/client";

import SkeletonProduct from '~/components/product/skeleton';
import GallerySlider from '~/components/splide/gallery';
import ProductList from '~/components/product/list';
import { GROUP_SECTION_QUERY, SECTIONS_QUERY } from "~/queries/section-builder/product.gql";
import { REDIRECT_BILLING_PAGE_MUTATION } from "~/queries/section-builder/other.gql";

const skeleton = (
  <SkeletonPage primaryAction backAction>
    <Layout>
      <Layout.Section>
        <BlockStack gap={400}>
          <Card sectioned>
            <SkeletonBodyText lines={7} />
          </Card>
          <BlockStack gap={400}>
            <BlockStack gap={200}>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={1} />
            </BlockStack>
            <SkeletonProduct total={5} columns={{ sm: 1, md: 2, lg: 3 }} />
          </BlockStack>
          <Card sectioned>
            <Text as='div'>
              <BlockStack gap={400}>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={5} />
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
  const { key } = useParams();

  const { data:groupSection, loading:groupSectionL, error:groupSectionE } = useQuery(GROUP_SECTION_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: {
      key: key
    }
  });
  const { data:groupSections, loading:groupSectionsL, error:groupSectionsE } = useQuery(SECTIONS_QUERY, {
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        product_id: groupSection?.getGroupSection?.child_ids ?? []
      },
      pageSize: 99,
      currentPage: 1
    }
  });

  const [redirectPurchase, { data:purchase, loading:purchaseL, error:purchaseE }] = useMutation(REDIRECT_BILLING_PAGE_MUTATION);

  const handlePurchase = useCallback(async () => {
    await redirectPurchase({ 
      variables: {
        name: groupSection.getGroupSection?.url_key,
        interval: 'ONE_TIME',
        is_plan: false
      }
     });
  }, [groupSection]);

  console.log("re-render-pageSection");
  return (
    groupSection?.getGroupSection !== undefined
    ? <Page
      backAction={{content: 'Products', onAction: () => navigate(-1)}}
      title={groupSection.getGroupSection.name}
      subtitle={groupSection.getGroupSection?.price ? `$${groupSection.getGroupSection?.price}` : 'Free'}
      compactTitle
      primaryAction={{
        content: !groupSection?.getGroupSection?.actions?.purchase ? 'Purchased' : 'Purchase',
        disabled: !groupSection?.getGroupSection?.actions?.purchase,
        helpText: 'Own forever this groupSection.',
        loading: purchaseL,
        onAction: () => handlePurchase()
      }}
      secondaryActions={[
        {
          content: 'View in demo site',
          icon: ViewIcon,
          url: groupSection?.getGroupSection?.demo_link,
          disabled: !groupSection?.getGroupSection?.demo_link,
          helpText: !groupSection?.getGroupSection?.demo_link ? 'This product has no demo yet.' : '',
          onAction: () => {}
        }
      ]}
    >
      <Layout>
        <Layout.Section>
          <Box>
          <BlockStack gap={600}>
            <Box>
              <Card title="Gallery" padding={0}>
                <GallerySlider gallery={groupSection.getGroupSection?.images} height={'30rem'} />
              </Card>
            </Box>

            <Box>
              <BlockStack gap={400}>
                <BlockStack>
                  <Text variant="headingMd" as="h2">Group</Text>
                  <Text variant="bodyXs" as="p" tone="subdued">"{groupSection.getGroupSection.name}" consists of {groupSection.getGroupSection.child_ids.length} sections. Sections included in group:</Text>
                </BlockStack>
                {
                  groupSections?.getSections !== undefined
                  ? <ProductList items={groupSections.getSections?.items ?? []} columns={{sm: 1, md: 2, lg: 3}} />
                  : <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
                }
              </BlockStack>
            </Box>

            {
              groupSection.getGroupSection.description &&
              <Box paddingBlockEnd={600}>
                <Card title="Description">
                  <Text variant="headingMd">Description</Text>
                  <Box padding="400">
                    <div dangerouslySetInnerHTML={{__html: groupSection.getGroupSection.description}}></div>
                  </Box>
                </Card>
              </Box>
            }
          </BlockStack>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
    : skeleton
  );
}

export default memo(SectionDetail);
