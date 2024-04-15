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
import { usePlan } from '~/talons/plan/usePlan';

const titleIntervalType = {
  'EVERY_30_DAYS': 'Montly',
  'ANNUAL': 'Annual',
  'ONE_TIME': 'One time',
};

function PricingPlanCard({item}) {
  const { subscribe, loading: purchasePlanLoading, handleTabChange, selected } = usePlan({ plan: item });

  console.log({ item });
  return (
    <Card>
      <BlockStack gap="200">
        <InlineStack align="space-between">
          <Text as="h3" variant="headingSm">
            {item.name}
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
              item?.prices &&
              item.prices.map(price => {
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
            <Box padding='400'>
              <BlockStack gap='400'>
              {
                item?.description &&
                item.description.split('\n').map((content, key) => {
                  return (
                    <InlineStack key={key} gap='200' blockAlign="start">
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
            onClick={subscribe}
            accessibilityLabel="Purchase"
            loading={purchasePlanLoading}
            // disabled={item.information.currentPeriodEnd}
          >
            {item.information.currentPeriodEnd ? "Purchased" : "Purchase"}
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}

export default memo(PricingPlanCard);
