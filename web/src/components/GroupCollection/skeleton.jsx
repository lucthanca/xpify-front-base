import { memo } from 'react';
import { Box, Card, SkeletonBodyText } from '@shopify/polaris';

const Skeleton = () => Array.from({ length: 4 }, (_, i) => (
  <Card key={i}>
    <div style={{height: '200px'}}></div>
    <Box background="bg-surface-secondary" padding="400">
      <SkeletonBodyText lines={1} />
    </Box>
  </Card>
));

export default memo(Skeleton);
