import React, { memo, useMemo } from 'react';
import { BlockStack, Card, Text, Box } from '@shopify/polaris';
import ProductCarousel from '~/components/ProductCarousel';
import SkeletonProduct from '~/components/product/skeleton';
import { SECTIONS_QUERY, QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';
import { useRelatedProducts } from '~/talons/relatedProducts/useRelatedProducts';

const RelatedProducts = props => {
  const { variables, extractItemList, slideOptions, slidePerPage } = useRelatedProducts();
  const skeleton = useMemo(() => {
    return (
      <Box paddingBlockStart='200'>
        <SkeletonProduct total={slidePerPage} columns={{ sm: 1, md: 2, lg: 3 }} />
      </Box>
    );
  }, [slidePerPage]);
  // should render error when error is not null
  return (
    <Card title='Related'>
      <BlockStack gap='200'>
        <Text variant='headingMd' as='h2'>
          Related sections
        </Text>

        <ProductCarousel
          query={SECTIONS_QUERY}
          queryKey={QUERY_SECTION_COLLECTION_KEY}
          queryVariables={variables}
          slideOptions={slideOptions}
          extractItems={extractItemList}
          skeleton={skeleton}
        />
      </BlockStack>
    </Card>
  );
};

export default memo(RelatedProducts);
