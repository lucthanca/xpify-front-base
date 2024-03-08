import {
  Card,
  Layout,
  Text,
  BlockStack,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
} from '@shopify/polaris';
import RelatedProductSkeleton from '~/components/SectionDetails/RelatedProducts/skeleton';
import { memo } from 'react';

const Skeleton = () => {
  return (
    <SkeletonPage primaryAction backAction>
      <Layout>
        <Layout.Section>
          <BlockStack gap={400}>
            <Card sectioned>
              <SkeletonBodyText lines={7} />
            </Card>
            <Card sectioned>
              <Text as='div'>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={5} />
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
            <RelatedProductSkeleton />
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default memo(Skeleton);
