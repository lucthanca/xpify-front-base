import { memo } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import SliderItem from '~/components/QuickViewSectionModal/sliderItem';
import { Modal } from '@shopify/polaris';
import { useQuickViewSlider } from '~/talons/quickview/useQuickViewSlider';
import PropTypes from 'prop-types';
import { useModalContent } from '~/talons/quickview/useModalContent';

const ModalContent = props => {
  const { keys, onClose, onIndexChange } = props;
  const {
    sliderOpts,
    handleSliderMoved,
    movedIndex,
  } = useModalContent(keys, onIndexChange);

  return (
    <Splide className='splide-modal-section' options={sliderOpts} onMoved={handleSliderMoved}>
      {keys.map((k, index) => {
        const shouldLoad = index === movedIndex || index === movedIndex + 1 || index === movedIndex - 1;
        return (
          <SplideSlide key={k}>
            <div className='px-10'>
              <SliderItem url_key={k} shouldLoad={shouldLoad} onClose={onClose} />
            </div>
          </SplideSlide>
        );
      })}
    </Splide>
  );
};

const QuickViewModalSlider = props => {
  const { keys, onIndexChange, type = 'slider' } = props;
  const { activeSection, show, onCloseQuickViewModal } = useQuickViewSlider();

  if (type === 'normal') {
    const shouldLoad = !!activeSection?.url_key;
    return (
      <Modal size='large' open={show} onClose={onCloseQuickViewModal} title={activeSection?.name ?? 'Loading...'} noScroll>
        <SliderItem url_key={activeSection && activeSection.url_key} shouldLoad={shouldLoad} onClose={onCloseQuickViewModal} />
      </Modal>
    );
  }

  return (
    <Modal size='large' open={show} onClose={onCloseQuickViewModal} title={activeSection?.name ?? 'Loading...'} noScroll>
      <ModalContent keys={keys} onClose={onCloseQuickViewModal} onIndexChange={onIndexChange}/>
    </Modal>
  );
};

QuickViewModalSlider.propTypes = {
  keys: PropTypes.array,
  onSlideMoved: PropTypes.func,
};

export default memo(QuickViewModalSlider);
