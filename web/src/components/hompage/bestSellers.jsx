import { memo, useState } from 'react';
import { BlockStack, Box } from '@shopify/polaris';
import TitleBlock from '~/components/block/title.jsx';
import BestSeller from '~/components/BestSellers/bestSellerSlider';

const BestSellersHomepage = () => {
  const [spliderConfig] = useState(() => {
    return {
      perPage: 2,
      gap: '1rem',
      pagination: false,
      breakpoints:{
        425: { perPage: 1 },
        1024: { perPage: 2, gap: '0.5rem' }
      },
    };
  });
  return (
    <BestSeller slideConfig={spliderConfig} />
  );
};

export default memo(BestSellersHomepage);
