import { memo, useState } from 'react';
import { BlockStack, Box } from '@shopify/polaris';
import TitleBlock from '~/components/block/title';
import LatestRelease from '~/components/LatestRelease';

const LatestReleaseHomePage = () => {
  const [spliderConfig] = useState(() => {
    return {
      perPage: 2,
      gap: '1rem',
      pagination: false,
      breakpoints:{
        425: { perPage: 1 },
        768: { perPage: 2 }
      },
      autoplay: true,
      interval: 3000,
      rewind: true
    };
  });
  return (
    <LatestRelease sliderConfig={spliderConfig} />
  );
};

export default memo(LatestReleaseHomePage);
