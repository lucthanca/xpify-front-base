import { memo, useState } from 'react';
import { BlockStack, Box } from '@shopify/polaris';
import TitleBlock from '~/components/block/title';
import LatestRelease from '~/components/LatestRelease';

const LatestReleaseHomePage = () => {
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
        <TitleBlock title='Latest Releases' subTitle='See a few examples of magically adding a theme section to your store in a few clicks.' />

        <LatestRelease sliderConfig={spliderConfig} />
      </BlockStack>
    </Box>
  );
};

export default memo(LatestReleaseHomePage);
