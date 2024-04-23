import { memo } from 'react';
import ProductCarousel from '~/components/ProductCarousel';
import { LATEST_RELEASE_QUERY, LATEST_RELEASE_QUERY_KEY } from '~/queries/section-builder/product.gql';

const LatestRelease = ({ sliderConfig }) => {
  return (
    <ProductCarousel
      title="Latest Releases"
      subTitle="Recently updated products"
      query={LATEST_RELEASE_QUERY}
      queryKey={LATEST_RELEASE_QUERY_KEY}
      slideOptions={sliderConfig}
    />
  );
}

export default memo(LatestRelease);
