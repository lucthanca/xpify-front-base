import { memo, useCallback, useEffect, useMemo } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import QuickViewContent from '~/components/QuickViewSectionModal/quickViewContent';
import { Modal } from '@shopify/polaris';
import { useSectionListContext } from '~/context';
import { onINP } from 'web-vitals';

const useQuickViewSlider = props => {
  return {};
};

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
    onINP(( metric ) => {
      console.log(`INPT metric của ${props.activeSection}`, metric);
    }, { reportAllChanges: true });

  }, []);

  return (
    <Splide options={sliderOpts} >
      {keys.map((k, index) => {
        const shouldLoad = index === startIndex || index === startIndex + 1 || index === startIndex - 1;
        return (
          <SplideSlide key={k}>
            <div className='px-10'>
              <QuickViewContent url_key={k} shouldLoad={shouldLoad} />
            </div>
          </SplideSlide>
        );
      })}
    </Splide>
  );
};

const QuickViewModalSlider = props => {
  const {
    keys,
  } = props;
  const [{ activeSection }, { setActiveSection, setQuickViewModalLoading }] = useSectionListContext();
  const onCloseQuickViewModal = useCallback(() => {
    setQuickViewModalLoading(false);
    setActiveSection(null);
  }, [setActiveSection]);
  const show = !!activeSection;
  const { section } = useQuickViewSlider({ key: keys });

  return (
    <Modal size='large' open={show} onClose={onCloseQuickViewModal} title={activeSection?.name ?? 'Loading...'} noScroll>
      <ModalContent keys={keys} activeSection={activeSection} />
    </Modal>
  );
};

export default memo(QuickViewModalSlider);
