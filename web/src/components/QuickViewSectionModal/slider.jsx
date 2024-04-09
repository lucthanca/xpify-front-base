import { memo } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import SliderItem from '~/components/QuickViewSectionModal/sliderItem';
import { Modal } from '@shopify/polaris';
import { useQuickViewSlider } from '~/talons/quickview/useQuickViewSlider';
import PropTypes from 'prop-types';
import { useModalContent } from '~/talons/quickview/useModalContent';

const ModalContent = props => {
  const { keys } = props;
  const {
    sliderOpts,
    handleSliderMoved,
    movedIndex,
  } = useModalContent(keys);

  return (
    <Splide options={sliderOpts} onMoved={handleSliderMoved}>
      {keys.map((k, index) => {
        const shouldLoad = index === movedIndex || index === movedIndex + 1 || index === movedIndex - 1;
        return (
          <SplideSlide key={k}>
            <div className='px-10'>
              <SliderItem url_key={k} shouldLoad={shouldLoad} />
            </div>
          </SplideSlide>
        );
      })}
    </Splide>
  );
};

const QuickViewModalSlider = props => {
  const { keys } = props;
  const { activeSection, show, onCloseQuickViewModal } = useQuickViewSlider();

  return (
    <Modal size='large' open={show} onClose={onCloseQuickViewModal} title={activeSection?.name ?? 'Loading...'} noScroll>
      <ModalContent keys={keys} />
    </Modal>
  );
};

QuickViewModalSlider.propTypes = {
  keys: PropTypes.array,
};

export default memo(QuickViewModalSlider);
