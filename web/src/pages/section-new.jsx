import { memo, useMemo } from 'react';
import {
  Badge,
  BlockStack,
  Box,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Layout,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonTabs,
  Text,
  Tooltip
} from "@shopify/polaris";
import { CheckIcon } from '@shopify/polaris-icons';
import { useQuery } from "@apollo/client";
import TitleBlock from '~/components/block/title';
import PricingPlanCard from '~/components/block/card/plan';
import { PRICING_PLAN_QUERY_KEY, PRICING_PLANS_QUERY } from '~/queries/section-builder/other.gql';
import GallerySlider from '~/components/splide/gallery';

function Plans() {
  const { data, loading } = useQuery(PRICING_PLANS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const pricingPlans = useMemo(() => data?.[PRICING_PLAN_QUERY_KEY], [data]);
  const loadingWithoutData = useMemo(() => loading && !pricingPlans, [loading, pricingPlans]);

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <InlineGrid columns={{sm: 1, md: ['twoThirds', 'oneThird']}} gap={400}>
            <BlockStack>
              <Card title="Gallery" padding={0}>
                <div>
                  <GallerySlider gallery={[{'src': 'https://kiz-xpify.vadu.io.vn/media/section_builder/product/de4.jpg'}]} />
                </div>
              </Card>
            </BlockStack>
            <BlockStack gap={400}>
              <BlockStack gap="200">
                <Text variant="headingLg" as="h2">About #01</Text>
                <InlineStack gap="200" blockAlign="start">
                  <Tooltip content="Tag">
                    <Badge tone="info">#tag-01</Badge>
                  </Tooltip>
                  <Tooltip content="Tag">
                    <Badge tone="info">#tag-02</Badge>
                  </Tooltip>
                </InlineStack>
                <Text variant="bodyLg" fontWeight='bold'>$8.99</Text>
              </BlockStack>
            </BlockStack>
          </InlineGrid>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default memo(Plans);
