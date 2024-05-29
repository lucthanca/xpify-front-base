import { memo } from 'react';
import { BlockStack, Card, InlineGrid, SkeletonBodyText, SkeletonDisplayText, SkeletonTabs } from '@shopify/polaris';
import { PricingPlanSkeleton } from '~/components/QuickViewSectionModal';

export default memo(({ title }) => {
  return (
    <div className='p-4'>
      <InlineGrid columns={{ sm: 1, md: ['twoThirds', 'oneThird'] }} gap='400'>
        <div className='h-full'>
          <div className='sticky'>
            <BlockStack gap={400}>
              <Card title='Gallery' padding='0'>
                <div className='quickViewModal__gallery__root aspect-[16/9] bg-[#eee] sticky'>
                  <div className='w-full h-full' />
                </div>
              </Card>
            </BlockStack>
          </div>
        </div>
        <div>
          <BlockStack gap='400'>
            <Card title='Infomation'>
              <BlockStack gap='400'>
                <SkeletonDisplayText maxWidth="40%" size='small'></SkeletonDisplayText>
                <SkeletonBodyText lines={3} />
                <SkeletonBodyText lines={1} />
                <InlineGrid columns={2} gap={200}>
                  <SkeletonDisplayText maxWidth="100%" size='small' />
                  <SkeletonDisplayText maxWidth="100%" size='small' />
                </InlineGrid>
                <SkeletonDisplayText maxWidth="100%" size='small'></SkeletonDisplayText>
              </BlockStack>
            </Card>
            <Card title='USP'>
              <BlockStack gap='400'>
                <SkeletonDisplayText size='small'></SkeletonDisplayText>
                <SkeletonBodyText lines={4} />
              </BlockStack>
            </Card>
            {/* <PricingPlanSkeleton /> */}
            {/* <Card title="Video guide">
              <div style={{height: '220px'}} />
            </Card> */}
          </BlockStack>
        </div>
      </InlineGrid>
    </div>
  );
});
