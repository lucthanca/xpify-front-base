import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import ProductCard from '~/components/product/card';

export default function ProductCarousel({items, handleShowModal, setCurrentProduct, configSplide}) {
  return (
    <Splide {...configSplide}>
      {items.map((item) => {
        return (
          <SplideSlide key={item.entity_id}>
            <ProductCard key={item.entity_id} item={item} handleShowModal={handleShowModal} setCurrentProduct={setCurrentProduct} lazyLoadImg={false} />
          </SplideSlide>
        )
      })}
    </Splide>
  );
};