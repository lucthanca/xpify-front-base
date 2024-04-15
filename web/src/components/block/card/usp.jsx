import { memo } from "react";
import { Card, Box, Text, InlineStack, Icon } from "@shopify/polaris";
import { CheckIcon } from '@shopify/polaris-icons';

function CardUSP({short_description}) {
  return (
    <Card title="Short description">
      <Text variant="headingMd">USP</Text>
      <Box padding="200" as='ul'>
        {
          short_description.split('\n').map((content, key) => {
            return (
              <InlineStack key={key} gap='200' blockAlign="start" as='li' wrap={false}>
                <div>
                  <Icon source={CheckIcon} tone="info"/>
                </div>
                <Text>{content}</Text>
              </InlineStack>
            );
          })
        }
      </Box>
    </Card>
  );
}

export default memo(CardUSP);