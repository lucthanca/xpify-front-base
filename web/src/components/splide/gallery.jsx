import {
  Splide,
  SplideSlide
} from '@splidejs/react-splide';

export default function GallerySlider({gallery}) {
  return (
    <Splide
      options={{
        perPage: 1,
        gap: '0.5rem',
        arrows: false,
        type: gallery.length > 1 ? "loop" : "slide",
        pagination: true
      }}
    >
      {
        gallery.map(slide => (
          <SplideSlide className='splide-gallery-li' key={ slide.src }>
            <img loading='lazy' src={ slide.src } />
          </SplideSlide>
        ))
      }
    </Splide>
  );
};