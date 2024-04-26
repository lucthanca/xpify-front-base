import { memo, useMemo } from 'react';
import {
  BlockStack,
  Box,
  Card,
  SkeletonDisplayText
} from '@shopify/polaris';
import SkeletonProduct from '~/components/block/product/skeleton';

const Skeleton = () => {
  const skeleton = useMemo(() => {
    const slidePerPage = window.innerWidth < 425 ? 1 : 2;
    return (
      <BlockStack gap={200}>
        <SkeletonDisplayText size='small' />
        <Box paddingBlockStart='200'>
          <SkeletonProduct total={slidePerPage} columns={{ sm: 1, md: 2 }} />
        </Box>
      </BlockStack>
    );
  }, []);

  return skeleton;
};

export default memo(Skeleton);
