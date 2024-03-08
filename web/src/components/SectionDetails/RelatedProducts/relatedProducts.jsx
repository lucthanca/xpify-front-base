import { memo } from 'react';
import { BlockStack, Box, Card, Text } from '@shopify/polaris';
import ProductCarousel from '~/components/splide/product';
import SkeletonProduct from '~/components/product/skeleton';
import PropTypes from 'prop-types';

const RelatedProducts = props => {
  const { products, error } = props;
  // should render error when error is not null
  return (
    <Card title="Related">
      <BlockStack gap='200'>
        <Text variant="headingMd" as="h2">Related sections</Text>
        {products?.length > 0 ? (
          <Box paddingBlockStart="200">
            <ProductCarousel
              configSplide={{
                options: {
                  perPage: 3,
                  gap: '1rem',
                  pagination: false,
                  breakpoints:{
                    425: {
                      perPage: 1
                    },
                    768: {
                      perPage: 2,
                      gap: '0.5rem'
                    },
                    2560: {
                      perPage: 3
                    }
                  },
                  autoplay: true,
                  interval: 3000,
                  rewind: true
                }
              }}
              items={products}
            />
          </Box>
        ) : (
          <Box paddingBlockStart="200">
            <SkeletonProduct total={3} columns={{ sm: 1, md: 2, lg: 3 }} />
          </Box>
        )}
      </BlockStack>
    </Card>
  );
};

RelatedProducts.propTypes = {
  products: PropTypes.array,
  error: PropTypes.object
};

export default memo(RelatedProducts);
