import { memo, useCallback, useMemo } from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import { BEST_SELLER_QUERY, BEST_SELLER_QUERY_KEY } from '~/queries/section-builder/product.gql';
import ProductCarousel from '~/components/ProductCarousel';
import { BlockStack, Box, SkeletonDisplayText } from '@shopify/polaris';
import SkeletonProduct from '~/components/block/product/skeleton';

const BestSeller = props => {
  const { slideConfig } = props;
  const removeGroupSections = useCallback((items) => {
    return items.filter(i => i.__typename !== 'GroupSection').map(i => i.url_key);
  }, []);
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

  return (
    <ProductCarousel
      title="Best Sellers"
      //subTitle="Our best selling products"
      query={BEST_SELLER_QUERY}
      queryKey={BEST_SELLER_QUERY_KEY}
      extractKeys={removeGroupSections}
      slideOptions={slideConfig}
      skeleton={skeleton}
    />
  );
};

BestSeller.propTypes = {
  slideConfig: PropTypes.object.isRequired,
}

export default memo(BestSeller);
