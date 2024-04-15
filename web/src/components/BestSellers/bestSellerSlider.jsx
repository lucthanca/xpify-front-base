import { memo } from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import { BEST_SELLER_QUERY, BEST_SELLER_QUERY_KEY } from '~/queries/section-builder/product.gql';
import ProductCarousel from '~/components/ProductCarousel';

const BestSeller = props => {
  const { slideConfig } = props;
  return (
    <ProductCarousel
      query={BEST_SELLER_QUERY}
      queryKey={BEST_SELLER_QUERY_KEY}
      slideOptions={slideConfig} />
  );
};

BestSeller.propTypes = {
  slideConfig: PropTypes.object.isRequired,
}

export default memo(BestSeller);
