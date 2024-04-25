import {
  Splide,
  SplideSlide
} from '@splidejs/react-splide';

export default function GallerySlider({gallery}) {
  return (
    <Splide
      options={{
        perPage: 1,
        gap: 50,
        arrows: gallery.length > 1 ? true : false,
        rewind: true,
        autoplay: true,
        interval: 3000
      }}
    >
      {
        gallery.map(slide => (
          <SplideSlide className='splide-gallery-li' key={ slide.src }>
            <img loading='lazy' src={ slide.src } alt={ slide.alt ?? '' }/>
          </SplideSlide>
        ))
      }
    </Splide>
  );
};