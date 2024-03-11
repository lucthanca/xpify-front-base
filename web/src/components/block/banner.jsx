import { memo } from "react";
import {
  Banner,
  BlockStack,
  List,
  Text
} from "@shopify/polaris";

function BannerDefault({bannerAlert, setBannerAlert}) {
  console.log('re-render banner');
  return (
    bannerAlert &&
    <Banner {...bannerAlert} onDismiss={() => {setBannerAlert(undefined)}}>
      {
        bannerAlert.content &&
        <BlockStack gap={200}>
          <List>
            {
              bannerAlert.content.map((item, key) => {
                return (
                  <List.Item key={key}>
                    <Text variant="bodySm">{item.debugMessage ?? item.message}</Text>
                  </List.Item>
                );
              })
            }
          </List>
        </BlockStack>
      }
    </Banner>
  );
}

export default memo(BannerDefault);