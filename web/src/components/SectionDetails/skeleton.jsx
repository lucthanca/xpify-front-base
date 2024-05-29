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
  Spinner,
  InlineGrid,
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
              <BlockStack gap={400}>
                <SkeletonDisplayText size='small' />
                <SkeletonBodyText lines={3} />
              </BlockStack>
            </Card>
            <Card sectioned>
              <BlockStack gap={400}>
                <SkeletonDisplayText size='small' />
              </BlockStack>
            </Card>
            <Card>
              <div className='aspect-[16/9]'></div>
            </Card>
            <Card sectioned>
              <InlineGrid columns={{ sm: 1, md: ['oneThird', 'twoThirds'] }}>
                <div className='aspect-[16/9]'></div>
                <BlockStack gap={400}>
                  <SkeletonDisplayText size='small' />
                  <SkeletonBodyText lines={2} />
                </BlockStack>
              </InlineGrid>
            </Card>
            <Card sectioned>
              <BlockStack gap={400}>
                <SkeletonDisplayText size='small' />
                <BlockStack gap={400}>
                  <SkeletonBodyText lines={2} />
                  <SkeletonBodyText lines={2} />
                  <SkeletonBodyText lines={3} />
                </BlockStack>
              </BlockStack>
            </Card>
            <RelatedProductSkeleton />
            <Card sectioned>
              <BlockStack gap={400}>
                <SkeletonDisplayText size='small' />
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
};

export default memo(Skeleton);
