import { memo, useCallback } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import ProductCard from '~/components/product/card.jsx';
import ModalProduct from '~/components/QuickViewSectionModal';
import { useBestSeller } from '~/talons/bestSeller/useBestSeller';
import './style.scss';

const BestSeller = props => {
  const { configSplide } = props;
  const talonProps = useBestSeller();
  const {
    items,
    quickViewProduct,
    handleQuickView,
  } = talonProps;

  const onCloseQuickViewModal = useCallback(() => {
    handleQuickView(null);
  }, [handleQuickView])
  return (
    <>
      <Splide {...configSplide}>
        {items.map((item) => {
          return (
            <SplideSlide key={item.id}>
              <div className='bestSellerCardRoot'>
                <ProductCard key={item.id} item={item} onQuickViewClick={handleQuickView} lazyLoadImg={false} />
              </div>
            </SplideSlide>
          )
        })}
      </Splide>
      <ModalProduct url_key={quickViewProduct?.url_key} onClose={onCloseQuickViewModal} show={!!quickViewProduct} />
    </>
  );
};

export default memo(BestSeller);
