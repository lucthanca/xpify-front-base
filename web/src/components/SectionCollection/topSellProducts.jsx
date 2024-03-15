import { memo, useState } from 'react';
import { BlockStack, Box, Text } from '@shopify/polaris';
import ProductCarousel from '~/components/splide/product';
import SkeletonProduct from '~/components/product/skeleton';
import { useTopSellProducts } from '~/talons/section/useTopSellProducts';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
const topSellProducts = props => {
  const { products: productTopSells, loading, error, loadingWithoutData } = useTopSellProducts();
  const [productCarouselConfigSplide] = useState(() => ({
    options: {
      perPage: 5,
      gap: '1rem',
      pagination: false,
      breakpoints:{
        425: {
          perPage: 1
        },
        768: {
          perPage: 3,
          gap: '0.5rem'
        },
        2560: {
          perPage: 5
        }
      },
      autoScroll: {
        pauseOnHover: true,
        pauseOnFocus: true,
        rewind: true,
        speed: 1.5
      }
    },
    extensions: {AutoScroll}
  }))
  if (!loadingWithoutData && !productTopSells || productTopSells?.length === 0) return null;
  return <></>;
  return (
    <Box padding='600'>
      <BlockStack gap='200'>
        <Text variant="headingMd" as="h2">Top Sells</Text>
        {loadingWithoutData && <SkeletonProduct total={5} columns={{ sm: 1, md: 3, lg: 5 }} />}
        {!loadingWithoutData && (
          <ProductCarousel
            configSplide={productCarouselConfigSplide}
            breakpoints={{
              425: { perPage: 1 },
              768: { perPage: 3, gap: '0.5rem' },
              1024: { perPage: 5 },
              2560: { perPage: 6 }
            }}
            items={productTopSells}
          />
        )}
      </BlockStack>
    </Box>
  );
}

export default memo(topSellProducts);
