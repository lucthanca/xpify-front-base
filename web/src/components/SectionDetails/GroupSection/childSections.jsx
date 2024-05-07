import { memo, useMemo } from 'react';
import { BlockStack, Card, Text, Box, SkeletonDisplayText } from '@shopify/polaris';
import ProductCarousel from '~/components/ProductCarousel';
import SkeletonProduct from '~/components/block/product/skeleton';
import { SECTIONS_QUERY, QUERY_SECTION_COLLECTION_KEY } from '~/queries/section-builder/product.gql';
import { useRelatedProducts } from '~/talons/relatedProducts/useRelatedProducts';

const ChildSections = props => {
  const { slideOptions, slidePerPage } = useRelatedProducts();
  const variables = {
    filter: {
      product_id: props?.childIds ?? []
    },
    pageSize: 99,
    currentPage: 1
  };
  const skeleton = useMemo(() => {
    return (
      <BlockStack gap={200}>
        <SkeletonDisplayText size='small' />
        <Box paddingBlockStart='200'>
          <SkeletonProduct total={slidePerPage} columns={{ sm: 1, md: 2 }} />
        </Box>
      </BlockStack>
    );
  }, [slidePerPage]);

  return (
    <ProductCarousel
      query={SECTIONS_QUERY}
      queryKey={QUERY_SECTION_COLLECTION_KEY}
      queryVariables={variables}
      slideOptions={slideOptions}
      skeleton={skeleton}
      title={"Sections in this group"}
    />
  );
};

export default memo(ChildSections);
