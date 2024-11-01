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
import { useBackPage } from '~/hooks/section-builder/redirect';

function Plans() {
  const { data, loading } = useQuery(PRICING_PLANS_QUERY, {
    fetchPolicy: "cache-and-network",
  });
  const handleBackPage = useBackPage();
  const pricingPlans = useMemo(() => data?.[PRICING_PLAN_QUERY_KEY], [data]);
  const loadingWithoutData = useMemo(() => loading && !pricingPlans, [loading, pricingPlans]);

  return (
    <Page
      title="Pricing plans"
      backAction={{onAction: handleBackPage}}
      subtitle="7-Day Free Trial, 30-Day Money Back Guarantee. No Questions Asked!"
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap='600'>
            {/* <Box>
              <Card>
                <BlockStack gap="200">
                  <BlockStack inlineAlign="start" gap='200'>
                    <InlineStack gap="400">
                      <Text as="h3" variant="headingSm">
                        Guarantee
                      </Text>
                    </InlineStack>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      We understand that there is no perfect section, only the suitable section. Therefore, within 30 days, we are willing to refund for any reason if you feel the section is not suitable. Sign up for a trial and cancel at any time.
                    </Text>
                  </BlockStack>
                </BlockStack>
              </Card>
            </Box> */}

            <Box paddingBlockEnd='600'>
              <BlockStack gap='400'>
                <TitleBlock title='List Plan' subTitle='We support both Usage-based and Subscription-based.' />

                <InlineGrid gap="400" columns={{sm: 1, md: 2}}>
                  <Card>
                    <BlockStack gap="200">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingSm">
                          Basic
                        </Text>
                        <Badge tone="success">
                        <Tooltip content={"Forever"}>
                          <Text as="p" variant="bodySm" fontWeight="bold">Active</Text>
                        </Tooltip>
                        </Badge>
                      </InlineStack>

                      <Text as="p" variant="bodyMd" tone="subdued">
                        Usage-based. Pay as you go. Pay once and own forever. No monthly fee.
                      </Text>

                      <InlineGrid>
                        <Box padding={400}>
                          <BlockStack gap={400}>
                            <InlineStack gap={200} blockAlign="start">
                              <div>
                                <Icon source={CheckIcon} tone="info"/>
                              </div>
                              <Text>Unlock and install 3+ free sections</Text>
                            </InlineStack>
                            <InlineStack gap={200} blockAlign="start">
                              <div>
                                <Icon source={CheckIcon} tone="info"/>
                              </div>
                              <Text>For lock sections & blocks, buy once own forever</Text>
                            </InlineStack>
                            <InlineStack gap={200} blockAlign="start">
                              <div>
                                <Icon source={CheckIcon} tone="info"/>
                              </div>
                              <Text>Live chat & email support</Text>
                            </InlineStack>
                          </BlockStack>
                        </Box>
                      </InlineGrid>
                    </BlockStack>
                  </Card>
                  {loadingWithoutData && (
                    <Card>
                      <BlockStack gap="400">
                        <SkeletonDisplayText size="small"></SkeletonDisplayText>
                        <SkeletonBodyText lines="1"></SkeletonBodyText>

                        <InlineGrid>
                          <SkeletonTabs count={2} fitted></SkeletonTabs>
                          <SkeletonBodyText lines={5}></SkeletonBodyText>
                        </InlineGrid>

                        <InlineStack align="end">
                          <SkeletonBodyText lines={1}></SkeletonBodyText>
                        </InlineStack>
                      </BlockStack>
                    </Card>
                  )}
                  {
                    (!loadingWithoutData && pricingPlans.length > 0) && pricingPlans.map(item => (<PricingPlanCard key={item.code} item={item} />))
                  }
                </InlineGrid>
              </BlockStack>
            </Box>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default memo(Plans);
