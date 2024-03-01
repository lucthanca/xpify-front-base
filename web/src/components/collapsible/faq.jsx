import {
  Card,
  Text,
  Collapsible,
  Link,
  BlockStack,
  InlineStack,
  Icon,
  Box,
} from '@shopify/polaris';
import {
  CircleChevronUpIcon,
  CircleChevronDownIcon
} from '@shopify/polaris-icons';
import {useState, useCallback, memo} from 'react';

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
            {
              open
              ? <Icon source={CircleChevronUpIcon} tone="base" />
              : <Icon source={CircleChevronDownIcon} tone="base" />
            }
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