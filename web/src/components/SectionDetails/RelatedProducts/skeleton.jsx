import { memo } from 'react';
import {
  Card
} from '@shopify/polaris';
import SkeletonProduct from '~/components/block/product/skeleton';

const Skeleton = () => {
  return (
    <Card sectioned>
      <SkeletonProduct total={2} columns={{ sm: 1, md: 2 }} />
    </Card>
  );
};

export default memo(Skeleton);
