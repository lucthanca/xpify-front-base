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
        <Text variant="headingMd" as="h2">How to use this section?</Text>
        <List>
          {
            section.actions?.purchase &&
            <List.Item>
              <Text variant="bodyMd">Own forever: Purchase once.</Text>
            </List.Item>
          }
          {
            section.actions?.plan &&
            <List.Item>
              <Text variant="bodyMd">Periodic payments: Own all sections included in the plan ({section?.pricing_plan?.name})</Text>
            </List.Item>
          }
        </List>
      </BlockStack>
    </Banner>
  );
}

export default memo(BannerWarningNotPurchase);
