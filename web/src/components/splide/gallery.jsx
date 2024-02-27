import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';

export default function GallerySlider({gallery, height}) {
  return (
    <Splide
      options={{
        perPage: 1,
        height: height,
        rewind: true,
        autoplay: true,
        interval: 3000
      }}
    >
      {
        gallery.map(slide => (
          <SplideSlide key={ slide.src } style={{'backgroundColor': '#eeeeee'}}>
            <img src={ slide.src } alt={ slide.alt } style={{'height': '100%', 'margin': 'auto'}}/>
          </SplideSlide>
        ))
      }
    </Splide>
  );
};