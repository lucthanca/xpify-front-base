import { MediaCard, VideoThumbnail } from '@shopify/polaris';
import { memo } from 'react';

function MediaTutorial({mediaCard}) {
  console.log('re-render-mediaTutorial');
  return (
    <MediaCard style={{'margin': 0}} {...mediaCard} >
      <VideoThumbnail
        videoLength={80}
        thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1250"
        onClick={() => console.log('clicked')}
      />
    </MediaCard>
  );
};

export default memo(MediaTutorial);