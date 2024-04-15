import React, { memo } from 'react';
import { useCarousel } from '~/talons/carousel/useCarousel';
import { Splide, SplideSlide, Options } from '@splidejs/react-splide';
import { SectionListProvider } from '~/context';
import ProductCard from '~/components/product/card';
import QuickViewSlider from '~/components/QuickViewSectionModal/slider';
import type { ExtractItemsCallback } from '~/talons/carousel/useCarousel';
import type { DocumentNode } from '@apollo/client';
import type { OperationVariables } from '@apollo/client/core/types';
import './style.scss';
import PropTypes from 'prop-types';
import InstallModal from '~/components/product/installModal';


type CarouselProps = {
  query: DocumentNode;
  queryKey: string;
  slideOptions: Options;
  queryVariables?: OperationVariables;
  extractItems?: ExtractItemsCallback;
  skeleton?: React.ReactNode;
};

const Carousel: React.FC<CarouselProps> = (props) => {
  const { skeleton, query, queryKey, slideOptions, extractItems, queryVariables } = props;
  const { items, loadingWithoutData, loading, keys } = useCarousel(query, queryKey, queryVariables, extractItems);
  if (loadingWithoutData && skeleton) {
    return <>{skeleton}</>;
  }
  return (
    <SectionListProvider>
      <Splide options={slideOptions}>
        {items.map((item) => {
          return (
            <SplideSlide key={item.id}>
              <div className='sliderItemCardRoot'>
                <ProductCard
                  key={item.id}
                  item={item}
                  lazyLoadImg={false}
                />
              </div>
            </SplideSlide>
          )
        })}
      </Splide>
      <QuickViewSlider keys={keys} />
      <InstallModal />
    </SectionListProvider>
  );
};

Carousel.propTypes = {
  // @ts-ignore
  query: PropTypes.object.isRequired,
  queryKey: PropTypes.string.isRequired,
  slideOptions: PropTypes.object.isRequired,
  queryVariables: PropTypes.object,
  skeleton: PropTypes.node,
};

export default memo(Carousel);
