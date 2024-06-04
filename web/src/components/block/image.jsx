import { Spinner } from "@shopify/polaris";
import { memo, useCallback, useState } from "react";

function LazyLoadImage({className, src, srcSet, imgSizes}) {
  const [loadingImg, setLoadingImg] = useState(true);
  const handleOnLoadImg = useCallback(() => {
    setLoadingImg(false);
  });

  return (
    <>
      {loadingImg &&
        <div className='w-full h-full flex justify-center items-center'>
          <Spinner accessibilityLabel="loading" size="large" />
        </div>
      }
      <img
        className={className}
        style={{height: loadingImg ? '0' : '100%'}}
        loading="lazy"
        src={src}
        srcSet={srcSet}
        sizes={imgSizes}
        onLoad={handleOnLoadImg}
      />
    </>
  );
}

export default memo(LazyLoadImage);