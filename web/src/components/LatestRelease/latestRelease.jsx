import { memo, useMemo } from 'react';
import ProductCarousel from '~/components/ProductCarousel';
import { LATEST_RELEASE_QUERY, LATEST_RELEASE_QUERY_KEY } from '~/queries/section-builder/product.gql';
import { BlockStack, Box, SkeletonDisplayText } from '@shopify/polaris';
import SkeletonProduct from '~/components/block/product/skeleton';

const LatestRelease = ({ sliderConfig }) => {
  const skeleton = useMemo(() => {
    const slidePerPage = window.innerWidth < 425 ? 1 : 2;

    return (
      <BlockStack gap={200}>
        <SkeletonDisplayText size='small' />
        <Box paddingBlockStart='200'>
          <SkeletonProduct total={slidePerPage} columns={{ sm: 1, md: 2 }} />
        </Box>
      </BlockStack>
    );
  }, []);

  return (
    <ProductCarousel
      title="Latest Releases"
      //subTitle="Recently updated products"
      query={LATEST_RELEASE_QUERY}
      queryKey={LATEST_RELEASE_QUERY_KEY}
      slideOptions={sliderConfig}
      skeleton={skeleton}
    />
  );
}

export default memo(LatestRelease);
