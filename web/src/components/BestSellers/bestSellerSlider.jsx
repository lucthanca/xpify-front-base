import { memo, useCallback, useMemo } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import ProductCard from '~/components/product/card.jsx';
import { useBestSeller } from '~/talons/bestSeller/useBestSeller';
import './style.scss';
import BestSellerSlider from '~/components/QuickViewSectionModal/slider';
import { SectionListProvider } from '~/context';
// import ModalProduct from '~/components/QuickViewSectionModal';

const BestSeller = props => {
  const { configSplide } = props;
  const talonProps = useBestSeller();
  const {
    items,
    // quickViewProduct,
    // handleQuickView,
  } = talonProps;

  // const onCloseQuickViewModal = useCallback(() => {
  //   handleQuickView(null);
  // }, [handleQuickView]);

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
      {/*<BestSellerSlider keys={keys} onClose={onCloseQuickViewModal} show={!!quickViewProduct} selectedSection={quickViewProduct} />*/}
      {/*<ModalProduct url_key={quickViewProduct?.url_key} onClose={onCloseQuickViewModal} show={!!quickViewProduct} />*/}
    </SectionListProvider>
  );
};

export default memo(BestSeller);
