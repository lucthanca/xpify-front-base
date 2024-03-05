import {
  Card,
  Text,
  Collapsible,
  Link,
  BlockStack,
  InlineStack,
  Icon,
  Box,
  Button,
  Grid,
  InlineGrid,
  Image,
} from '@shopify/polaris';
import {
  XCircleIcon
} from '@shopify/polaris-icons';
import {useState, useCallback, memo} from 'react';

function CollapsibleButton() {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Card>
      <InlineStack>
        <div className='title-collapsible pointer' onClick={handleToggle}>
            <InlineStack gap={200}>
                <Text as="p" variant="bodyLg">
                    Step 1
                </Text>
                <Button size='large' variant="plain" icon={<Icon source={XCircleIcon} tone="base" />}></Button>
            </InlineStack>
        </div>

        <Box paddingBlockStart={200}>
          <Collapsible
            open={open}
              id="basic-collapsible"
              transition={{duration: '200ms', timingFunction: 'ease-in-out'}}
              expandOnPrint
          >
            <BlockStack gap={200}>
              <InlineGrid columns={['twoThirds', 'oneHalf']}>
                <BlockStack gap={200} inlineAlign="start">
                  <Text as="p" variant="bodyMd" tone='subdued'>
                      Your mailing list lets you contact customers or visitors who
                      have shown an interest in your store. Reach out to them with
                      exclusive offers or updates about your products.

                      Your mailing list lets you contact customers or visitors who
                      have shown an interest in your store. Reach out to them with
                      exclusive offers or updates about your products.
                  </Text>
                  <Button>Done</Button>
                </BlockStack>
                <Image
                    source="https://sections.puco.io/images/general/enable-app.gif"
                    alt="app"
                    loading="lazy"
                />
              </InlineGrid>
            </BlockStack>
          </Collapsible>
        </Box>
      </InlineStack>
    </Card>
  );
}

export default memo(CollapsibleButton);