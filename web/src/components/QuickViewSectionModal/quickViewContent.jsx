import { lazy, memo, Suspense, useEffect, useState } from 'react';
import {
  Scrollable,
} from '@shopify/polaris';
import { onINP } from 'web-vitals';
import Skeleton from './quickViewContentShimmer';
const LazyQuickViewContent = lazy(() => import('./lazyQuickViewContent'));

const QuickViewContent = props => {
  const { shouldLoad } = props;
  const [hasInit, setHasInit] = useState(false);
  const [delay, setDelay] = useState(true);

  useEffect(() => {
    if (!shouldLoad) return;
    const timer = setTimeout(() => {
      setDelay(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [shouldLoad]);

  if (!shouldLoad || delay) return (
    <Scrollable className='px-2 pl-4 pb-4 max-h-[calc(100vh-9rem)]'>
      <Skeleton title={props.url_key} />
    </Scrollable>
  );

  return (
    <Suspense fallback={<Skeleton title={props.url_key} />}>
      <LazyQuickViewContent {...props} />
    </Suspense>
  );
}

export default memo(QuickViewContent);
