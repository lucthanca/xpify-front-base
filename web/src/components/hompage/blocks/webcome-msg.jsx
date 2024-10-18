import { BlockStack, Box, Card, Icon, InlineStack, Text } from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
import { useState } from 'react';
import { useDismiss } from '~/talons/useDismiss';
import DismissedCard from './dismissed';

export default function () {
  const [blockId] = useState('home_welcome_message');
  const { isDismissed, loading, shop, dismissTriggered, undo, dismiss, loadingWithoutCache } = useDismiss(blockId);
  if (loadingWithoutCache) return (
    <Card>
      <div className='xpify_dismissible_content'>
        <BlockStack gap='200'>
          <Text as="div" variant="bodyMd">
            <p style={{ display: 'flex', gap: '3px' }}>
              Hi <span style={{width: '4rem', display: 'flex', background: 'var(--p-color-bg-fill-tertiary)', borderRadius: 'var(--p-border-radius-100)'}}></span>,
              welcome to our fresh batch of sections to jazz up your Shopify theme!
            </p>
          </Text>
          <Text as="p" variant="bodyMd">
          Once you've got these installed, just hop into the theme editor, and keep an eye out for 'OT' in the search box.
          </Text>
          <Text as="p" variant="bodyMd">
            Happy customizing!
          </Text>
        </BlockStack>
      </div>
    </Card>
  );
  if (dismissTriggered) return <DismissedCard onUndo={undo} />;
  if (isDismissed) return null;

  return (
    <Card>
      <div className='xpify_dismissible_content'>
        <BlockStack gap='200'>
          <Text as="p" variant="bodyMd">
            Hi {shop.shop_owner}, welcome to our fresh batch of sections to jazz up your Shopify theme!
          </Text>
          <Text as="p" variant="bodyMd">
            Once you've got these installed, just hop into the theme editor, and keep an eye out for 'OT' in the search box.
          </Text>
          <Text as="p" variant="bodyMd">
            Happy customizing!
          </Text>
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
  );
}
