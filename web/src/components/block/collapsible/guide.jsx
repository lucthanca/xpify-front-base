import {useState, useCallback, memo, useEffect} from 'react';
import {
  Text,
  Collapsible,
  BlockStack,
  InlineStack,
  Box,
  Button,
  InlineGrid,
  Tooltip,
  Card
} from '@shopify/polaris';
import { DottedCircleIcon } from '~/assets/dottedCircle';
import { DoneCircleIcon } from '~/assets/doneCircle';

function CollapsibleButton({options, setProgress, openChild, setOpenChild}) {
  const [isDone, setIsDone] = useState(undefined);

  useEffect(() => {
    const itemStorage = JSON.parse(localStorage.getItem('bss-setup-guide')) ?? [];
    const isIdExists = itemStorage.some(item => item === options.id);
    if (isIdExists) {
      setIsDone(true);
      setProgress(prev => ++prev);
    }
  }, []);

  const handleClick = useCallback((id) => {
    setIsDone(prev => !prev);
    const itemStorage = JSON.parse(localStorage.getItem('bss-setup-guide')) ?? [];
    const isIdExists = itemStorage.some(item => item === id);
  
    if (isIdExists) {
      const updatedItemStorage = itemStorage.filter(item => item !== id);
      localStorage.setItem('bss-setup-guide', JSON.stringify(updatedItemStorage));
    } else {
      localStorage.setItem('bss-setup-guide', JSON.stringify([...itemStorage, id]));
    }

    const count = JSON.parse(localStorage.getItem('bss-setup-guide'))?.length ?? 0;
    setProgress(count);
  }, []);

  return (
    <div className='bss-setup-guide cursor-pointer' onClick={() => setOpenChild(options.id)}>
      <Box background={openChild === options.id ? 'bg-surface-active' : ''} padding={200} borderRadius='200'>
        <div className='grid-guide'>
          <Tooltip content={isDone ? 'Mark as not done' : 'Mark as done'}>
            <Button
              onClick={() => {handleClick(options.id)}}
              size='large'
              variant="plain"
              icon={
                isDone
                ? <DoneCircleIcon width='20' height='20' className='done-icon' /> 
                : <DottedCircleIcon width='20' height='20' className='dotted-icon' />
              }
            />
          </Tooltip>
          <InlineStack>
            <div className='title-collapsible'>
              <InlineStack gap={200}>
                <Text as="p" variant="bodyMd" fontWeight={openChild === options.id ? 'bold' : ''}>
                  {options.title}
                </Text>
              </InlineStack>
            </div>

            <Box paddingBlockStart={200} minWidth='100%'>
              <Collapsible
                open={openChild === options.id}
                id="basic-collapsible"
                transition={{duration: '200ms'}}
                expandOnPrint
              >
                <BlockStack gap={200}>
                  <InlineGrid gap={200} columns={options.demo ? {sm: 1, md: 2} : 1}>
                    <BlockStack gap={200} inlineAlign="start">
                      <Text as="div" variant="bodyMd" tone='subdued'>
                        {options.content}
                      </Text>
                    </BlockStack>
                    {options.demo &&
                      <Card padding={0} roundedAbove='xs'>
                        <div className='aspect-[3/2]'>
                          {options.demo}
                        </div>
                      </Card>
                    }
                  </InlineGrid>
                </BlockStack>
              </Collapsible>
            </Box>
          </InlineStack>
        </div>
      </Box>
    </div>
  );
}

export default memo(CollapsibleButton);