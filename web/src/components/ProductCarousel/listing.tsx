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
import type { SectionData } from '~/talons/section/useSection';


type CarouselProps = {
  title: string;
  subTitle: string;
  query: DocumentNode;
  queryKey: string;
  slideOptions: Options;
  queryVariables?: OperationVariables;
  extractItems?: ExtractItemsCallback;
  skeleton?: React.ReactNode;
  extractKeys?: (items: SectionData[]) => string[];
};

const Carousel: React.FC<CarouselProps> = (props) => {
  const { extractKeys, title, subTitle, skeleton, query, queryKey, slideOptions, extractItems, queryVariables } = props;
  const { items, loadingWithoutData, loading, keys } = useCarousel(query, queryKey, queryVariables, extractItems, extractKeys);
  const options = useMemo(() => {
    const column = window.innerWidth < 425 ? 1 : 2;
    slideOptions.arrows = items && items.length > column;
    if (items && items.length <= column) {
      slideOptions.type = "slide";
    }

    return slideOptions;
  }, [items]);

  if (loadingWithoutData && skeleton) {
    return <>{skeleton}</>;
  }
  if (!items?.length) return null;

  return (
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
                      imgSizes="(min-width: 1024px) calc((var(--pg-layout-width-primary-max) + var(--pg-layout-width-secondary-max) + var(--pg-layout-width-inner-spacing-base)) / 2), (min-width: 450px) 50vw, 100vw"
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
