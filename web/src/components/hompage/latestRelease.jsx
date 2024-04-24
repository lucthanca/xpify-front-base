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
        1024: { perPage: 2, gap: '0.5rem' }
      },
    };
  });
  return (
    <LatestRelease sliderConfig={spliderConfig} />
  );
};

export default memo(LatestReleaseHomePage);
