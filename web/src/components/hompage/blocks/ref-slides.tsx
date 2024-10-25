import { BlockStack, Card, InlineGrid, Text } from '@shopify/polaris';
import { CloseBtn } from '~/components/hompage/blocks/close-btn';
import { useRefSlides } from '~/talons/useRefSlides';

export const OmniRefSlides = () => {
  const { dismiss } = useRefSlides();
  return (
    <Card roundedAbove="sm">
      <div className="xpify_dismissible_content">
        <BlockStack gap="400">
          <InlineGrid columns="1fr auto">
            <Text as="h2" variant="headingSm">Other solutions from Omni Themes</Text>
          </InlineGrid>
        </BlockStack>
        <CloseBtn dismiss={dismiss} />
      </div>
    </Card>
);
};
