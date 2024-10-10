import { BlockStack, Box, Button, Card, InlineGrid, Text } from '@shopify/polaris';
import { useFreshChat } from '~/components/providers/freshchat';
import { useUserContext } from '~/context/user';

export default () => {
  const { open: openChat, initialized: freshchatInitialized } = useFreshChat();
  const [{ loading }] = useUserContext();
  return (
    <Box>
      <BlockStack gap='400'>
        <InlineGrid gap="400" columns="1">
          <Card>
            <BlockStack inlineAlign={"start"} gap="200">
              <Text as="h2" variant="headingMd">Support</Text>
              <Text variant="bodyMd" as='p'>Need a helping hand? Check our FAQs or chat directly with our support agents for quick and friendly support.</Text>

              <Button disabled={loading || !freshchatInitialized} onClick={openChat}>Open live chat</Button>
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Box>
  );
};
