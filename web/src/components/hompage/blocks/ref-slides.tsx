import {
  BlockStack,
  Button,
  Card,
  InlineGrid,
  InlineStack,
  Text,
  ButtonGroup,
  SkeletonDisplayText,
  SkeletonBodyText,
} from '@shopify/polaris';
import { CloseBtn } from '~/components/hompage/blocks/close-btn';
import { useRefSlides } from '~/talons/useRefSlides';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import type { RefBlockSlide } from '~/@types';
import './ref-slides.style.scss';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Options } from '@splidejs/splide';
import DismissedCard from '~/components/hompage/blocks/dismissed';
import PropTypes from 'prop-types';

// @ts-ignore
import ImagePlaceholder from '~/assets/image-placeholder.svg';

const Skeleton = () => {
  return (
    <InlineStack gap='400' blockAlign='start' wrap={false}>
      <div className='relative aspect-[16/9] rounded-[var(--p-border-radius-200)] overflow-hidden w-[45%] select-none'>
        <img src={ImagePlaceholder} alt={'loading'} className='inset-0 w-full h-full object-contain' />
      </div>
      <div className='self-stretch w-[55%]'>
        <BlockStack gap='600'>
          <div className='w-[55%]'><SkeletonDisplayText size='small' /></div>
          <BlockStack gap='600'>
            <SkeletonBodyText lines={2} />
            <SkeletonBodyText lines={3} />
            <SkeletonBodyText lines={1} />
          </BlockStack>
          <InlineStack gap='200'>
            <div className='w-28'><SkeletonDisplayText size='small' /></div>
            <div className='w-24'><SkeletonDisplayText size='small' /></div>
          </InlineStack>
        </BlockStack>
      </div>
    </InlineStack>
  );
};

const BlockContent = ({ block, useLazyImage = true }: { block: RefBlockSlide, useLazyImage?: boolean }) => {
  const shouldRenderPrimaryButton = block.primary_button_text && block.primary_button_url;
  const shouldRenderSecondaryButton = block.secondary_button_text && block.secondary_button_url;
  const hasBtn = shouldRenderPrimaryButton || shouldRenderSecondaryButton;
  const imgAttributes = useMemo(() => {
    if (!useLazyImage) return {
      src: block.image_url,
    };
    return { 'data-splide-lazy': block.image_url, src: ImagePlaceholder };
  }, [block.image_url, useLazyImage]);
  return (
    <InlineStack gap='400'>
      <div className='relative aspect-[16/9] rounded-[var(--p-border-radius-200)] overflow-hidden w-[45%] select-none'>
        <a href={block.primary_button_url} className='inset-0 absolute w-full h-full'>
          <img alt={block.title} className='inset-0 w-full h-full object-contain' {...imgAttributes}/>
        </a>
      </div>
      <BlockStack gap='200'>
        <Text as='h3' variant='headingSm'>{block.title}</Text>
        <div dangerouslySetInnerHTML={{ __html: block.description }} className='xpify_ref_slide_desc_root Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--subdued' />
        {hasBtn && (
          <ButtonGroup>
            {shouldRenderPrimaryButton && (
              <Button url={block.primary_button_url} target='_blank' variant='primary'>
                {block.primary_button_text}
              </Button>
            )}
            {shouldRenderSecondaryButton && (
              <Button url={block.secondary_button_url} target='_blank' variant='plain'>
                {block.secondary_button_text}
              </Button>
            )}
          </ButtonGroup>
        )}
      </BlockStack>
    </InlineStack>
  );
};
BlockContent.propTypes = {
  useLazyImage: PropTypes.bool,
}

const Slider = ({ items, shouldPlay }: { items: RefBlockSlide[], shouldPlay: boolean }) => {
  const [splideOpts] = useState<Options>({ reducedMotion: { interval: 3000, speed: 800 },type: 'loop', perPage: 1, rewind: true, gap: 0, pagination: false, arrows: false, interval: 3000, lazyLoad: 'nearby' });
  const splide = useRef<Splide>();
  const onLazyLoadLoaded = useCallback((_: any, imgEl: HTMLElement) => {
    imgEl.classList.remove('object-contain');
    imgEl.classList.add('object-cover');
  }, []);
  useEffect(() => {
    if (!splide.current || !splide.current.splide) return;
    if (shouldPlay && splide.current.splide.Components.Autoplay.isPaused()) {
      console.log('debug: autoplay true');
      splide.current.splide.Components.Autoplay.play();
    } else {
      if (!splide.current.splide.Components.Autoplay.isPaused()) {
        splide.current.splide.Components.Autoplay.pause();
        console.log('debug: autoplay false');
      }
    }
  }, [shouldPlay]);
  return (
    // @ts-ignore
    <Splide onLazyLoadLoaded={onLazyLoadLoaded} ref={splide} options={splideOpts}>
      {items.map(slide => (
        <SplideSlide key={slide.id}>
          <BlockContent block={slide} />
        </SplideSlide>
      ))}
    </Splide>
  );
};

export const OmniRefSlides = () => {
  const { dismiss, slides, loadingWithoutData, loadingWithoutCache, ref, inView, isDismissed, dismissTriggered, undo, intersected } = useRefSlides();
  const shouldRenderAsSlider = slides.length > 1;
  const isLoading = loadingWithoutData || loadingWithoutCache;
  const content = useMemo(() => {
    if (isLoading) return <Skeleton />;
    if (shouldRenderAsSlider) return <Slider items={slides} shouldPlay={inView} />;
    return <BlockContent block={slides?.[0] || {}} useLazyImage={false} />;
  }, [isLoading, slides, inView]);

  console.log({ inView });
  let mainContent;
  if (intersected && dismissTriggered) {
    mainContent = <DismissedCard onUndo={undo} />;
  } else if (intersected && (isDismissed || (!isLoading && slides.length === 0))) {
  } else {
    mainContent = (
      <Card roundedAbove='sm'>
        <div className='xpify_dismissible_content'>
          <BlockStack gap='400'>
            <InlineGrid columns='1fr auto'>
              <Text as='h2' variant='headingSm'>Other solutions from Omni Themes</Text>
            </InlineGrid>
            {content}
          </BlockStack>
          {!isLoading && <CloseBtn dismiss={dismiss} />}
        </div>
      </Card>
    );
  }
  return (
    <div ref={ref}>
      {mainContent}
    </div>
  );
};
