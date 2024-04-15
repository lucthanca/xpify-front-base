import { memo } from 'react';
import { BlockStack, Card, InlineGrid, SkeletonBodyText, SkeletonDisplayText, SkeletonTabs } from '@shopify/polaris';
import { PricingPlanSkeleton } from '~/components/QuickViewSectionModal';

export default memo(({ title }) => {
  return (
    <InlineGrid columns={{ sm: 1, md: ['twoThirds', 'oneThird'] }} gap='400'>
      <div className='h-full py-4'>
        <div className='sticky top-4'>
          <Card title='Gallery' padding='0'>
            <div className='quickViewModal__gallery__root aspect-[16/9] bg-[#eee] sticky'>
              <div className='w-full h-full' />
            </div>
          </Card>
          <span>{title}</span>
        </div>
      </div>
      <div className='py-4'>
        <BlockStack gap='400'>
          <Card title='Infomation'>
            <BlockStack gap='200'>
              <SkeletonTabs count={2} fitted />
              <SkeletonBodyText lines={3} />
              <SkeletonDisplayText maxWidth='true' size='small'></SkeletonDisplayText>
              <SkeletonDisplayText maxWidth='true' size='small'></SkeletonDisplayText>
            </BlockStack>
          </Card>
          <Card title='Description'>
            <BlockStack gap='400'>
              <SkeletonDisplayText size='small'></SkeletonDisplayText>
              <SkeletonBodyText lines={5} />
            </BlockStack>
          </Card>
          <PricingPlanSkeleton />
        </BlockStack>
      </div>
    </InlineGrid>
  );
});
