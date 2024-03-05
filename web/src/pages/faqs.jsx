import { Page, Layout, Text, Box, BlockStack, Card, InlineStack, SkeletonBodyText } from "@shopify/polaris";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import {gql, useQuery} from "@apollo/client";

import CollapsibleDefault from "~/components/collapsible/faq";
import { FAQS_QUERY } from "~/queries/section-builder/faq.gql";

const skeleton = [];
for (let i = 1; i <= 5; i++) {
  skeleton.push(
    <Card key={i}>
      <InlineStack>
        <SkeletonBodyText lines={1}></SkeletonBodyText>
      </InlineStack>
    </Card>
  );
}

function Faq() {
  const { t } = useTranslation();
  const { data:faqs, loading:faqsL, error:faqsE } = useQuery(FAQS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

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
            {
              faqs?.getFaqs !== undefined
              ? faqs.getFaqs.map((item, key) => {
                return <CollapsibleDefault key={key} {...item} />;
              })
              : skeleton
            }
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default memo(Faq);