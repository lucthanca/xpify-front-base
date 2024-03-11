import { memo } from "react";
import {
  BlockStack,
  Text
} from "@shopify/polaris";

function TitleBlock({title, subTitle}) {
  return (
    <BlockStack>
      {
        title &&
        <Text variant="headingMd" as="h2">{title}</Text>
      }
      {
        subTitle &&
        <Text variant="bodyXs" as="p" tone="subdued">{subTitle}</Text>
      }
    </BlockStack>
  );
}

export default memo(TitleBlock);