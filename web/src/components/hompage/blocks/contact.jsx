import { useState } from 'react';
import { BlockStack, Box, Button, Card, Icon, InlineGrid, InlineStack, Text } from '@shopify/polaris';
import { useFreshChat } from '~/components/providers/freshchat';
import { useDismiss } from '~/talons/useDismiss';
import DismissedCard from '~/components/hompage/blocks/dismissed';
import { XIcon } from '@shopify/polaris-icons';

export default () => {
  const [blockId] = useState('home_contact_us');
  const { open: openChat, initialized: freshchatInitialized } = useFreshChat();
  const { isDismissed, loading, shop, dismissTriggered, undo, dismiss, loadingWithoutCache } = useDismiss(blockId);
  if (loadingWithoutCache) return (
    <Box>
      <BlockStack gap='400'>
        <InlineGrid gap="400" columns="1">
          <Card>
            <BlockStack inlineAlign={"start"} gap="200">
              <Text as="h2" variant="headingMd">Support</Text>
              <Text variant="bodyMd" as='p'>Need a helping hand? Check our FAQs or chat directly with our support agents for quick and friendly support.</Text>

              <div style={{ cursor:'default',background:'var(--p-color-bg-fill-tertiary)',borderRadius:'0.25rem',width:'4.5rem',height:'28px' }}></div>
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Box>
  );
  if (dismissTriggered) return <DismissedCard onUndo={undo} />;
  if (isDismissed) return null;
  return (
    <Box>
      <BlockStack gap='400'>
        <InlineGrid gap="400" columns="1">
          <Card>
            <div className='xpify_dismissible_content'>
              <BlockStack inlineAlign={"start"} gap="200">
                <Text as="h2" variant="headingMd">Support</Text>
                <Text variant="bodyMd" as='p'>Need a helping hand? Check our FAQs or chat directly with our support agents for quick and friendly support.</Text>

                <Button disabled={loading || !freshchatInitialized} onClick={openChat}>Open live chat</Button>
              </BlockStack>
              <Box position='absolute' insetBlockStart='300' insetInlineEnd='300' zIndex='1'>
                <div className="xpify-close-btn">
                  <InlineStack wrap={false} gap='200'>
                    <button type='button' className='xpify_dismiss' aria-label="Dismiss" onClick={dismiss}>
                      <Icon source={XIcon} />
                    </button>
                  </InlineStack>
                </div>
              </Box>
            </div>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Box>
  );
};
