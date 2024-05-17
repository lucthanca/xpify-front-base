import { lazy, memo, Suspense, useEffect, useState } from 'react';
import { Scrollable } from '@shopify/polaris';
import Skeleton from './quickViewContentShimmer';
const QuickViewContent = lazy(() => import('./quickViewContent'));

const SliderItem = props => {
  const { shouldLoad } = props;
  const [delay, setDelay] = useState(true);

  useEffect(() => {
    if (!shouldLoad) return;
    const timer = setTimeout(() => {
      setDelay(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [shouldLoad]);

  if (!shouldLoad || delay)
    return (
      <Scrollable className='p-4 max-h-[calc(100vh-9rem)]'>
        <Skeleton title={props.url_key} />
      </Scrollable>
    );

  return (
    <Suspense fallback={<Skeleton title={props.url_key} />}>
      <QuickViewContent {...props} />
    </Suspense>
  );
};

export default memo(SliderItem);
