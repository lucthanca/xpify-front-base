import { Spinner } from "@shopify/polaris";
import { memo, useCallback, useState } from "react";

function LazyLoadImage({className, src, srcSet, imgSizes}) {
  const [loadingImg, setLoadingImg] = useState(true);
  const handleOnLoadImg = useCallback(() => {
    setLoadingImg(false);
  });

  return (
    <>
      <img
        className={className}
        style={loadingImg ? {opacity: '0', position: 'absolute'} : {}}
        loading="lazy"
        src={src}
        srcSet={srcSet}
        sizes={imgSizes}
        onLoad={handleOnLoadImg}
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