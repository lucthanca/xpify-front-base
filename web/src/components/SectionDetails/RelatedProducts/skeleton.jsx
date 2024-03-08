import SkeletonProduct from '~/components/product/skeleton';
import { Card } from '@shopify/polaris';
import { memo } from 'react';

const Skeleton = () => {
  return (
    <Card sectioned>
      <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
    </Card>
  );
};

export default memo(Skeleton);
