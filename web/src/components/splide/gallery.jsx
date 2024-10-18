import {
  Splide,
  SplideSlide
} from '@splidejs/react-splide';
import LazyLoadImage from '~/components/block/image';

export default function GallerySlider({gallery, imgSizes = '(min-width: 950px) 950px, 100vw'}) {
  return (
    <Splide options={{
      perPage: 1,
      arrows: false,
      type: gallery.length > 1 ? "loop" : "slide",
      pagination: true
    }}>
      {
        gallery.map((slide, index) => (
          <SplideSlide className='splide-gallery-li' key={index}>
            <div className='w-full'>
              <LazyLoadImage src={ slide.src } srcSet={slide.srcset} imgSizes={imgSizes} />
            </div>
          </SplideSlide>
        ))
      }
    </Splide>
  );
};
