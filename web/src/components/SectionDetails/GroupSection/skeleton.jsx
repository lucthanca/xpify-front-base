import React from 'react';
import {
  BlockStack,
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  Text
} from '@shopify/polaris';
import SkeletonProduct from '~/components/product/skeleton';

const Skeleton = () => {
  return (
    <SkeletonPage primaryAction backAction>
      <Layout>
        <Layout.Section>
          <BlockStack gap={400}>
            <Card sectioned>
              <SkeletonBodyText lines={7} />
            </Card>
            <BlockStack gap={400}>
              <BlockStack gap={200}>
                <SkeletonDisplayText size='small' />
                <SkeletonBodyText lines={1} />
              </BlockStack>
              <SkeletonProduct total={5} columns={{ sm: 1, md: 2, lg: 3 }} />
            </BlockStack>
            <Card sectioned>
              <Text as='div'>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={5} />
                </BlockStack>
              </Text>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default React.memo(Skeleton);
