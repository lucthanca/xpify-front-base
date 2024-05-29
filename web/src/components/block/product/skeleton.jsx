import { memo } from 'react';
import {
  BlockStack,
  Box,
  Card,
  InlineGrid,
  SkeletonBodyText,
  SkeletonDisplayText,
} from '@shopify/polaris';

function Skeleton({total, columns}) {
  const listSkeleton = [];
  for (let i = 1; i <= total; i++) {
    listSkeleton.push(
      <Card key={i} padding='0' background="bg-surface-secondary">
        <div className='aspect-[16/9] bg-white'>
        </div>
        <Box padding="400">
          <BlockStack gap='400'>
            <SkeletonDisplayText size='small' />
            <SkeletonBodyText lines={1} />
            <SkeletonBodyText lines={2} />
            <SkeletonDisplayText maxWidth="true" size='small' />
          </BlockStack>
        </Box>
      </Card>
    );
  }

  return (
    <InlineGrid columns={columns} gap='600'>
      {listSkeleton}
    </InlineGrid>
  );
}

export default memo(Skeleton);
