import {gql, useQuery} from "@apollo/client";
import { BlockStack, Box, Card, InlineGrid, InlineStack, Layout, Page, SkeletonBodyText, Text } from "@shopify/polaris";

import GroupCard from '~/components/product/groupCard';
import { GROUP_SECTIONS_QUERY } from "~/queries/section-builder/product.gql";

const skeleton = [];
for (let i = 1; i <= 5; i++) {
  skeleton.push(
    <Card key={i}>
      <div style={{height: '200px'}}></div>
      <Box background="bg-surface-secondary" padding="400">
        <SkeletonBodyText lines={1}></SkeletonBodyText>
      </Box>
    </Card>
  );
}

function Groups() {
  const { data:groupSections, loading:groupSectionsL, error:groupSectionsE } = useQuery(GROUP_SECTIONS_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <Page
      title="All groups"
      subtitle="Bundles lets you buy multiple sections at a discounted price."
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={600}>
            {
              groupSections?.getGroupSections !== undefined
              ? groupSections.getGroupSections.map(item => {
                return <GroupCard key={item.url_key} item={item} columns={{sm: 1, md: 2, lg: 3}} />
              })
              : <InlineGrid columns={{sm: 1, md: 2, lg: 3}} gap={600}>
                {skeleton}
              </InlineGrid>
            }
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default Groups;
