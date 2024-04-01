import { memo, useState } from 'react';
import { BlockStack, Box } from '@shopify/polaris';
import TitleBlock from '~/components/block/title.jsx';
import BestSeller from '~/components/BestSellers/bestSellerSlider';

const BestSellersHomepage = () => {
  const [spliderConfig] = useState(() => {
    return {
      perPage: 3,
      gap: '1rem',
      pagination: false,
      breakpoints:{
        425: { perPage: 1 },
        768: { perPage: 3, gap: '0.5rem' },
        1200: { perPage: 3 },
        2560: { perPage: 3 }
      },
    };
  });
  return (
    <Box>
      <BlockStack gap='400'>
        <TitleBlock title='Best Seller' subTitle='See a few examples of magically adding a theme section to your store in a few clicks.' />

        <BestSeller slideConfig={spliderConfig} />
      </BlockStack>
    </Box>
  );
};

export default memo(BestSellersHomepage);
