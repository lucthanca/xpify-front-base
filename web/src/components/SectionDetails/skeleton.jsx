import { memo } from 'react';
import {
  Card,
  Layout,
  Text,
  BlockStack,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  Box,
} from '@shopify/polaris';
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
            <Card sectioned>
              <Text as='div'>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={5} />
                </BlockStack>
              </Text>
            </Card>
            <Card>
              <div style={{height: '500px'}}></div>
            </Card>
            <RelatedProductSkeleton />
            <Card sectioned>
              <Text as='div'>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={3} />
                </BlockStack>
              </Text>
            </Card>
            <Card sectioned>
              <Text as='div'>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={3} />
                </BlockStack>
              </Text>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default memo(Skeleton);
