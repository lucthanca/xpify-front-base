import { memo, useCallback } from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import { BEST_SELLER_QUERY, BEST_SELLER_QUERY_KEY } from '~/queries/section-builder/product.gql';
import ProductCarousel from '~/components/ProductCarousel';

const BestSeller = props => {
  const { slideConfig } = props;
  const removeGroupSections = useCallback((items) => {
    return items.filter(i => i.__typename !== 'GroupSection').map(i => i.url_key);
  }, []);
  return (
    <ProductCarousel
      title="Best Sellers"
      //subTitle="Our best selling products"
      query={BEST_SELLER_QUERY}
      queryKey={BEST_SELLER_QUERY_KEY}
      extractKeys={removeGroupSections}
      slideOptions={slideConfig} />
  );
};

BestSeller.propTypes = {
  slideConfig: PropTypes.object.isRequired,
}

export default memo(BestSeller);
