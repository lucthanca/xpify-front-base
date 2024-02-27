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

function CollapsibleDefault() {
    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);

    return (
        <Card>
            <InlineStack>
                <div className='title-collapsible pointer' onClick={handleToggle}>
                    <Text as="p" variant="bodyLg">
                        Can I use Section Store with any Shopify theme?
                    </Text>
                    
                    <BlockStack as='div'>
                        {
                            open
                            ? <Icon source={CircleChevronUpIcon} tone="base" />
                            : <Icon source={CircleChevronDownIcon} tone="base" />
                        }
                    </BlockStack>
                </div>

                <Box paddingBlockStart={200}>
                    <Collapsible
                        open={open}
                        id="basic-collapsible"
                        transition={{duration: '200ms', timingFunction: 'ease-in-out'}}
                        expandOnPrint
                    >
                        <BlockStack gap={200}>
                            <Text as="p" variant="bodyMd" tone='subdued'>
                                Your mailing list lets you contact customers or visitors who
                                have shown an interest in your store. Reach out to them with
                                exclusive offers or updates about your products.

                                Your mailing list lets you contact customers or visitors who
                                have shown an interest in your store. Reach out to them with
                                exclusive offers or updates about your products.
                            </Text>
                            <Link url="#">Test link</Link>
                        </BlockStack>
                    </Collapsible>
                </Box>
            </InlineStack>
        </Card>
    );
}

export default memo(CollapsibleDefault);