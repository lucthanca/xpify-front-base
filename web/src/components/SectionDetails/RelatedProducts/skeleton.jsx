import { memo } from 'react';
import {
  Card
} from '@shopify/polaris';
import SkeletonProduct from '~/components/product/skeleton';

const Skeleton = () => {
  return (
    <Card sectioned>
      <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
    </Card>
  );
};

export default memo(Skeleton);
