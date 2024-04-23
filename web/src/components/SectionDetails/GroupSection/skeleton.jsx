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
import SkeletonProduct from '~/components/block/product/skeleton';
import RelatedProductSkeleton from '~/components/SectionDetails/RelatedProducts/skeleton';

const Skeleton = () => {
  return (
    <SkeletonPage primaryAction backAction>
      <Layout>
        <Layout.Section>
          <BlockStack gap={400}>
            <BlockStack gap={400}>
              <SkeletonDisplayText size='small' />
              <SkeletonBodyText lines={1} />
            </BlockStack>
            <Card sectioned>
              <Text as='div'>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={3} />
                </BlockStack>
              </Text>
            </Card>
            <BlockStack gap={400}>
              <SkeletonProduct total={2} columns={{ sm: 1, md: 2 }} />
            </BlockStack>
            <Card sectioned>
              <Text as='div'>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={5} />
                </BlockStack>
              </Text>
            </Card>
            <RelatedProductSkeleton />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default React.memo(Skeleton);
