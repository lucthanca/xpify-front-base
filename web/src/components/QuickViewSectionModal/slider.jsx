import { memo, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import SliderItem from '~/components/QuickViewSectionModal/sliderItem';
import { Modal } from '@shopify/polaris';
import { onINP } from 'web-vitals';
import { useQuickViewSlider } from '~/talons/quickview/useQuickViewSlider';

const ModalContent = props => {
  const { keys, activeSection } = props;
  const startIndex = keys.indexOf(activeSection?.url_key);
  const sliderOpts = {
    perPage: 1,
    pagination: false,
    gap: '1rem',
    start: startIndex,
  };
  useEffect(() => {
    onINP(
      metric => {
        console.log(`INPT metric của ${props.activeSection}`, metric);
      },
      { reportAllChanges: true },
    );
  }, []);

  return (
    <Splide options={sliderOpts}>
      {keys.map((k, index) => {
        const shouldLoad = index === startIndex || index === startIndex + 1 || index === startIndex - 1;
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
      <ModalContent keys={keys} activeSection={activeSection} />
    </Modal>
  );
};

export default memo(QuickViewModalSlider);
