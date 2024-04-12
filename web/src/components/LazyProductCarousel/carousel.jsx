import React, { memo } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { useLazyCarousel } from '~/talons/lazyCarousel/useLazyCarousel';
import PropTypes from 'prop-types';
import { SectionListProvider } from '~/context';
import QuickViewSlider from '~/components/QuickViewSectionModal/slider';
import InstallModal from '~/components/product/installModal';
import '~/components/ProductCarousel/style.scss';
import { Skeleton } from '~/components/product';

/**
 * @typedef {Object} SectionsQueryFilter
 * @property {string[]} category_id
 * @property {string[]} tag_id
 * @property {string} type_id
 * @property {string[]} plain_id
 * @property {string[]} product_id
 */
/**
 * @typedef {Object} Variables
 * @property {string} search
 * @property {SectionsQueryFilter} filter
 */
/**
 * @typedef {Object} LazyCarouselProps
 * @property {DocumentNode} fetchQuery
 * @property {string} queryRootKey
 * @property {(item) => void} renderItem
 * @property {React.ReactNode} skeletonLoader
 * @property {Variables} variables
 */

/**
 * @param {LazyCarouselProps} props
 * @returns {JSX.Element|null}
 * @constructor
 */
const LazyCarousel = props => {
  const { fetchQuery, queryRootKey, renderItem, skeletonLoader, variables, pageSize = 10 } = props;
  const talonProps = useLazyCarousel({
    query: fetchQuery,
    queryRootKey,
    variables,
    pageSize,
  });
  const {
    items,
    loadingWithoutData,
    canLoadMore,
    handleSplideMoved,
    splideRef,
    splideConfig,
  } = talonProps;
  const keys = items.map(item => item.url_key);

  if (loadingWithoutData) {
    return (<Skeleton total={pageSize} columns={pageSize} />);
  }
  if (!renderItem) return null;
  return (
    <SectionListProvider>
      <Splide {...splideConfig} onMoved={handleSplideMoved} ref={splideRef}>
        {items.map((item, index) => {
          return (
            <SplideSlide key={index}>
              <div className="sliderItemCardRoot">
                {renderItem(item)}
              </div>
            </SplideSlide>
        )
        })}
        {(canLoadMore && skeletonLoader) && (
          <SplideSlide>
            {skeletonLoader}
          </SplideSlide>
        )}

      </Splide>
      <QuickViewSlider keys={keys} />
      <InstallModal />
    </SectionListProvider>
  );
};
LazyCarousel.propTypes = {
  renderItem: PropTypes.func.isRequired,
  skeletonLoader: PropTypes.node,
  fetchQuery: PropTypes.object.isRequired,
  queryRootKey: PropTypes.string.isRequired,
  queryVariables: PropTypes.shape({
    search: PropTypes.string,
    filter: PropTypes.shape({
      string: PropTypes.string,
      category_id: PropTypes.arrayOf(PropTypes.string),
      tag_id: PropTypes.arrayOf(PropTypes.string),
      product_id: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

export default memo(LazyCarousel);
