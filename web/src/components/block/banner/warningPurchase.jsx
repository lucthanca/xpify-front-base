import { memo } from "react";
import {
  Banner,
  BlockStack,
  List,
  Text
} from "@shopify/polaris";

function BannerWarningNotPurchase({section, config}) {
  return (
    <Banner {...config}>
      <BlockStack gap='200'>
        <Text variant="headingSm">How to use this section?</Text>
        <List>
          {
            section.actions?.purchase &&
            <List.Item>
              <Text variant="bodySm">Own forever: Purchase once.</Text>
            </List.Item>
          }
          {
            section.actions?.plan &&
            <List.Item>
              <Text variant="bodySm">Periodic payments: Own all sections included in the plan ({section.pricing_plan.name})</Text>
            </List.Item>
          }
        </List>
      </BlockStack>
    </Banner>
  );
}

export default memo(BannerWarningNotPurchase);