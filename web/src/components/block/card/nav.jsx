import { memo } from "react";
import { BlockStack, Button, Card, Text } from "@shopify/polaris";

function NavCard({title, content, actions}) {
  return (
    <Card>
      <BlockStack inlineAlign={"start"} gap="200">
        <Text as="h2" variant="headingMd">
          {title}
        </Text>
        <Text variant="bodyMd">
          {content}
        </Text>
        {actions}
      </BlockStack>
    </Card>
  );
}

export default memo(NavCard);