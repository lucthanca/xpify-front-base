import { memo, useCallback, useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  InlineGrid,
  InlineStack,
  Tabs,
  Text,
  Tooltip
} from "@shopify/polaris";
import { CheckIcon } from '@shopify/polaris-icons';
import { useMutation } from "@apollo/client";
import { REDIRECT_BILLING_PAGE_MUTATION } from "~/queries/section-builder/other.gql";

const titleIntervalType = {
  'EVERY_30_DAYS': 'Montly',
  'ANNUAL': 'Annual',
  'ONE_TIME': 'One time',
};

function PricingPlanCard({item}) {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const [redirectPlan, { data:purchasePlan, loading:purchasePlanLoading }] = useMutation(REDIRECT_BILLING_PAGE_MUTATION);

  const handlePlan = useCallback(async (code, interval) => {
    await redirectPlan({ 
      variables: {
        name: code,
        interval: interval,
        is_plan: true
      }
    });
  }, [purchasePlan]);

  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between">
          <Text as="h3" variant="headingSm">
            {item.plan.name}
          </Text>
          {
            item.information.currentPeriodEnd &&
            <Badge tone="success">
              <Tooltip content={new Date(item.information.currentPeriodEnd).toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}>
                <Text as="p" variant="bodySm" fontWeight="bold">Active</Text>
              </Tooltip>
            </Badge>
          }
        </InlineStack>
        <Text as="p" variant="bodyMd" tone="subdued">
          Subscription-based. Pay once monthly (or once per year), install unlimited.
        </Text>

        <InlineGrid>
          <Tabs
            tabs={
              item.plan?.prices &&
              item.plan.prices.map(price => {
                return {
                  id: price.interval,
                  content: titleIntervalType[price.interval],
                  badge: '$' + price.amount
                };
              })
            }
            selected={selected}
            onSelect={handleTabChange}
            fitted
          >
            <Box padding={400}>
              <BlockStack gap={400}>
              {
                item.plan?.description &&
                item.plan.description.split('\n').map((content, key) => {
                  return (
                    <InlineStack key={key} gap={200} blockAlign="start">
                      <div>
                        <Icon source={CheckIcon} tone="info"/>
                      </div>
                      <Text>{content}</Text>
                    </InlineStack>
                  );
                })
              }
              </BlockStack>
            </Box>
          </Tabs>
        </InlineGrid>

        <InlineStack align="end">
          <Button
            variant="primary"
            onClick={() => handlePlan(item.plan.code, item.plan.prices[selected]?.interval)}
            accessibilityLabel="Purchase"
            loading={purchasePlanLoading}
            disabled={item.information.currentPeriodEnd}
          >
            {item.information.currentPeriodEnd ? "Purchased" : "Purchase"}
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

export default memo(PricingPlanCard);