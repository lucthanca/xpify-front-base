import { Spinner } from "@shopify/polaris";
import { memo, useCallback, useState } from "react";

function LazyLoadImage({className, src, srcSet, imgSizes, shouldLazy}) {
  const [loadingImg, setLoadingImg] = useState(false);

  const imgAttr = {};
  if (shouldLazy) {
    imgAttr.loading = 'lazy';
  }

  return (
    <>
      <img
        className={className}
        style={loadingImg ? {opacity: '0', position: 'absolute'} : {}}
        src={src}
        srcSet={srcSet}
        sizes={imgSizes}
        onLoad={() => setLoadingImg(false)}
        {...imgAttr}
      />
      {loadingImg &&
        <div className='w-full h-full flex justify-center items-center'>
          <Spinner accessibilityLabel="loading" size="large" />
        </div>
      }
    </>
  );
}

export default memo(LazyLoadImage);
