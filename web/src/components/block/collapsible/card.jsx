import { useState, useCallback, memo, useMemo } from 'react';
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
import './style.scss';

function CollapsibleCard({title, content: propContent, childSections, isOpen = false, isJsx = false, id}) {
  const [open, setOpen] = useState(isOpen);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  const content = useMemo(() => {
    if (!isJsx) return (
      <div className='collapsible-richcontent' dangerouslySetInnerHTML={{__html: propContent}}></div>
    );
    return <Text as="div" variant="bodyMd">{propContent}</Text>;
  }, [isJsx, propContent]);

  return (
    <Card>
      <InlineStack>
        <div className='title-collapsible cursor-pointer' onClick={handleToggle}>
          <Text as="h2" variant="headingMd">
            {title}
          </Text>

          <BlockStack as='div'>
            <Icon source={open ? CircleChevronUpIcon : CircleChevronDownIcon} tone="base" />
          </BlockStack>
        </div>

        <Box paddingBlockStart={200}>
          <Collapsible
            open={open}
            id="basic-collapsible"
            transition={{duration: '200ms', timingFunction: 'ease-in-out'}}
            expandOnPrint
          >
            {content &&
              <Box paddingInline={200}>
                {content}
              </Box>
            }
          </Collapsible>
        </Box>
      </InlineStack>
    </Card>
  );
}

export default memo(CollapsibleCard);
