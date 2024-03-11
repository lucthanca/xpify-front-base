import { useState, useCallback, memo } from 'react';
import {
  Card,
  Text,
  Collapsible,
  BlockStack,
  InlineStack,
  Icon,
  Box,
} from '@shopify/polaris';
import {
  CircleChevronUpIcon,
  CircleChevronDownIcon
} from '@shopify/polaris-icons';

function CollapsibleDefault({title, content}) {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <Card>
      <InlineStack>
        <div className='title-collapsible pointer' onClick={handleToggle}>
          <Text as="p" variant="bodyLg">
            {title}
          </Text>

          <BlockStack as='div'>
            <Icon source={open ? CircleChevronUpIcon : CircleChevronDownIcon} tone="base" />
          </BlockStack>
        </div>

        <Box paddingBlockStart={400}>
          <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{duration: '200ms', timingFunction: 'ease-in-out'}}
            expandOnPrint
          >
            <Box paddingInline={200}>
              <Text as="div" variant="bodyMd" tone='subdued'>
                <div dangerouslySetInnerHTML={{__html: content}}></div>
              </Text>
            </Box>
          </Collapsible>
        </Box>
      </InlineStack>
    </Card>
  );
}

export default memo(CollapsibleDefault);