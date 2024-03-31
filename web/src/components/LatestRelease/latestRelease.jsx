import { memo, useMemo } from 'react';
import { useLatestRelease } from '~/talons/latestrelease/useLatestRelease';
import { SectionListProvider } from '~/context';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import ProductCard from '~/components/product/card';
import QuickViewSlider from '~/components/QuickViewSectionModal/slider';

const LatestRelease = ({ configSplide }) => {
  const {
    items,
  } = useLatestRelease();
  const keys = useMemo(() => {
    return items.map(item => item.url_key);
  }, [items]);
  return (
    <SectionListProvider>
      <Splide {...configSplide}>
        {items.map((item) => {
          return (
            <SplideSlide key={item.id}>
              <div className='bestSellerCardRoot'>
                <ProductCard key={item.id} item={item} lazyLoadImg={false} />
              </div>
            </SplideSlide>
          )
        })}
      </Splide>
      <QuickViewSlider keys={keys} />
    </SectionListProvider>
  );
}

export default memo(LatestRelease);
