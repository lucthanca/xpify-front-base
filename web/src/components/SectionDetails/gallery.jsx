import { memo } from 'react';
import {
  Card
} from '@shopify/polaris';
import PropTypes from 'prop-types';
import GallerySlider from '~/components/splide/gallery.jsx';

const SectionGallery = (props) => {
  const { images } = props;
  return (
    <Card title="Gallery" padding='0'>
      <GallerySlider gallery={images} height={'30rem'} />
    </Card>
  );
};

SectionGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
  })),
};

export default memo(SectionGallery);
