import { Page, Layout, Text, Box, BlockStack } from "@shopify/polaris";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import CollapsibleDefault from "~/components/collapsible/default";

function Faq() {
  const { t } = useTranslation();

  console.log('re-render-pageFaq');
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Box>
            <Text variant="headingXl" as="h2">
              Frequently asked questions
            </Text>
          </Box>
        </Layout.Section>

        <Layout.Section>
          <BlockStack gap={200}>
            <CollapsibleDefault />
            <CollapsibleDefault />
            <CollapsibleDefault />
            <CollapsibleDefault />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default memo(Faq);