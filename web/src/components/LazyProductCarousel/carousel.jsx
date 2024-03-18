import { memo } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useLazyCarousel } from '~/talons/lazyCarousel/useLazyCarousel';
import PropTypes from 'prop-types';


const LazyCarousel = props => {
  const { fetchQuery, queryRootKey, renderItem, skeletonLoader } = props;
  const talonProps = useLazyCarousel({
    query: fetchQuery,
    queryRootKey,
    variables: {
      sort: { column: 'qty_sold', order: 'desc' }
    }
  });
  const {
    items,
    loadingWithoutData,
    canLoadMore,
    handleSplideMoved,
    splideRef,
    splideConfig,
  } = talonProps;

  if (!renderItem || loadingWithoutData) return null;
  return (
    <Splide {...splideConfig} onMoved={handleSplideMoved} ref={splideRef}>
      {items.map((item, index) => {
        return (
          <SplideSlide key={index}>
            {renderItem(item)}
          </SplideSlide>
        )
      })}
      {(canLoadMore && skeletonLoader) && (
        <SplideSlide>
          {skeletonLoader}
        </SplideSlide>
      )}

    </Splide>
  );
};
LazyCarousel.propTypes = {
  renderItem: PropTypes.func.isRequired,
  skeletonLoader: PropTypes.node,
  fetchQuery: PropTypes.object.isRequired,
  queryRootKey: PropTypes.string.isRequired,
};

export default memo(LazyCarousel);
