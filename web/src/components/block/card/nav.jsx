import { memo } from "react";
import { BlockStack, Button, Card, Text } from "@shopify/polaris";

function NavCard({title, content, actions}) {
  return (
    <Card>
      <BlockStack inlineAlign={"start"} gap="200">
        <Text as="h3" variant="headingSm">
          {title}
        </Text>
        <Text variant="bodySm">
          {content}
        </Text>
        {actions}
      </BlockStack>
    </Card>
  );
}

export default memo(NavCard);