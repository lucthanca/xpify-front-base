import { memo } from 'react';
import { BlockStack, Card, SkeletonBodyText, SkeletonDisplayText } from '@shopify/polaris';

export default memo(() => {
  return (
    <Card>
      <BlockStack gap="400">
        <SkeletonDisplayText size='small'></SkeletonDisplayText>
        <SkeletonBodyText lines={5}></SkeletonBodyText>
        <SkeletonDisplayText size='small' maxWidth='true'></SkeletonDisplayText>
      </BlockStack>
    </Card>
  );
});
