import { memo, useMemo } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import ProductCard from '~/components/product/card.jsx';
import { useBestSeller } from '~/talons/bestSeller/useBestSeller';
import './style.scss';
import BestSellerSlider from '~/components/QuickViewSectionModal/slider';
import { SectionListProvider } from '~/context';

const BestSeller = props => {
  const { configSplide } = props;
  const talonProps = useBestSeller();
  const {
    items,
  } = talonProps;

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
      <BestSellerSlider keys={keys} />
    </SectionListProvider>
  );
};

export default memo(BestSeller);
