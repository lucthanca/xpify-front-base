import { memo } from 'react';
import { SkeletonTabs, BlockStack } from '@shopify/polaris';
import { Skeleton as ProductCardShimmer } from '~/components/product';
import PropTypes from 'prop-types';

const Skeleton = (props) => {
  const { childNumber = 4, itemRows = 2 } = props;
  return (
    <>
      <BlockStack gap='400'>
        {Array.from({ length: itemRows }).map((_, index) => (
            <BlockStack key={index}>
              <SkeletonTabs count={1} />
              <ProductCardShimmer total={childNumber} columns={childNumber} />
            </BlockStack>
          ))}
      </BlockStack>
    </>
  );
};
Skeleton.propTypes = {
  itemNumber: PropTypes.number,
  childNumber: PropTypes.number,
};

export default memo(Skeleton);
