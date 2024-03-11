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
      <Card key={i} padding={0}>
          <div style={{height: '200px'}}>
          </div>
          <Box background="bg-surface-secondary" padding="400">
            <BlockStack gap={200}>
              <SkeletonDisplayText size='small'></SkeletonDisplayText>
              <SkeletonBodyText lines={2}></SkeletonBodyText>
              <SkeletonDisplayText maxWidth="true"></SkeletonDisplayText>
            </BlockStack>
          </Box>
        </Card>
    );
  }

  return (
    <InlineGrid columns={columns} gap={600}>
      {listSkeleton}
    </InlineGrid>
  );
}

export default memo(Skeleton);