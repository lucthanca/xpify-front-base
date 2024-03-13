import { useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import ProductCard from '~/components/product/card';
import ModalProduct from '~/components/product/modal';

export default function ProductCarousel({items, configSplide}) {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(undefined);

  return (
    <>
      <Splide {...configSplide}>
        {items.map((item) => {
          return (
            <SplideSlide key={item.entity_id}>
              <ProductCard key={item.entity_id} item={item} setCurrentProduct={setCurrentProduct} setIsShowPopup={setIsShowPopup} lazyLoadImg={false} />
            </SplideSlide>
          )
        })}
      </Splide>
      <ModalProduct currentProduct={currentProduct} isShowPopup={isShowPopup} setIsShowPopup={setIsShowPopup} />
    </>
  );
};
