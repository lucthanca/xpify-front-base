import { memo } from "react";
import { BlockStack, Box, Button, Card, Icon, InlineStack, Text } from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';

function NavCard({title, content, actions}) {
  return (
    <Card>
      <div className='xpify_dismissible_content'>
        <BlockStack inlineAlign={"start"} gap="200">
          <Text as="h2" variant="headingMd">
            {title}
          </Text>
          <Text variant="bodyMd">
            {content}
          </Text>
          {actions}
        </BlockStack>
        <Box position='absolute' insetBlockStart='300' insetInlineEnd='300' zIndex='1'>
          <div className="xpify-close-btn">
            <InlineStack wrap={false} gap='200'>
              <button type='button' className='xpify_dismiss' aria-label="Dismiss">
                <Icon source={XIcon} />
              </button>
            </InlineStack>
          </div>
        </Box>
      </div>
    </Card>
);
}

export default memo(NavCard);
