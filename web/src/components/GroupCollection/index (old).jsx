import { useGroupCollection } from '~/talons/groups/useGroupCollection';
import Skeleton from '~/components/GroupCollection/skeleton';
import { BlockStack, InlineGrid, Layout, Page } from '@shopify/polaris';
import GroupCard from '~/components/product/groupCard';
import { memo } from 'react';


const GroupCollection = () => {
  const {
    loadingWithoutData,
    groups
  } = useGroupCollection();

  console.log({ groups });
  return (
    <Page
      title="All groups"
      subtitle="Bundles lets you buy multiple sections at a discounted price."
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap={600}>
            {!loadingWithoutData ? groups.map(item => {
              return <GroupCard key={item.url_key} item={item} columns={{sm: 1, md: 2, lg: 3}} />
            }) : (
              <InlineGrid columns={{sm: 1, md: 2, lg: 3}} gap='600'>
                <Skeleton />
              </InlineGrid>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  )
};

export default memo(GroupCollection);
