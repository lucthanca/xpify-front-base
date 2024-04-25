import React, { memo, useMemo } from 'react';
import { useCarousel } from '~/talons/carousel/useCarousel';
import { Splide, SplideSlide, Options } from '@splidejs/react-splide';
import { SectionListProvider } from '~/context';
import ProductCard from '~/components/block/product/card';
import QuickViewSlider from '~/components/QuickViewSectionModal/slider';
import type { ExtractItemsCallback } from '~/talons/carousel/useCarousel';
import type { DocumentNode } from '@apollo/client';
import type { OperationVariables } from '@apollo/client/core/types';
import './style.scss';
import PropTypes from 'prop-types';
import InstallModal from '~/components/block/product/installModal';
import { BlockStack, Box } from '@shopify/polaris';
import TitleBlock from '~/components/block/title';


type CarouselProps = {
  title: string;
  subTitle: string;
  query: DocumentNode;
  queryKey: string;
  slideOptions: Options;
  queryVariables?: OperationVariables;
  extractItems?: ExtractItemsCallback;
  skeleton?: React.ReactNode;
  options?: Options;
};

const Carousel: React.FC<CarouselProps> = (props) => {
  const { title, subTitle, skeleton, query, queryKey, slideOptions, extractItems, queryVariables } = props;
  const { items, loadingWithoutData, loading, keys } = useCarousel(query, queryKey, queryVariables, extractItems);
  const options = useMemo(() => {
    if (items && items.length <= 2) {
      slideOptions.arrows = false;
    } else {
      slideOptions.arrows = true;
    }

    return slideOptions;
  }, [items]);

  if (loadingWithoutData && skeleton) {
    return <>{skeleton}</>;
  }

  return (
    items && items.length
    ?
    <Box>
      <BlockStack gap='200'>
        <TitleBlock title={title} subTitle={subTitle} />

        <SectionListProvider>
          <Splide options={options}>
            {items.map((item) => {
              return (
                <SplideSlide key={item.id}>
                  <div className='sliderItemCardRoot'>
                    <ProductCard
                      key={item.id}
                      item={item}
                    />
                  </div>
                </SplideSlide>
              )
            })}
          </Splide>
          <QuickViewSlider keys={keys} />
          <InstallModal />
        </SectionListProvider>
      </BlockStack>
    </Box>
    : <></>
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
