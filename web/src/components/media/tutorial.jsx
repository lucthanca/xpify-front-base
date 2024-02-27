import { MediaCard, VideoThumbnail } from '@shopify/polaris';
import { memo } from 'react';

function MediaTutorial() {
    console.log('re-render-mediaTutorial');
    return (
        <MediaCard
            title="Quickstart with Sections"
            primaryAction={{
            content: 'Watch tutorial',
            onAction: () => {},
            }}
            description={`Sections are the most important components in a theme. With any theme, you have about 18 sections available. 18 is sometimes not enough. Puco simply helps you expand from 18 to 160+ sections. Add, customize, delete sections... directly in Theme Editor.`}
        >
            <VideoThumbnail
            videoLength={80}
            thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
            onClick={() => console.log('clicked')}
            />
        </MediaCard>
    );
};

export default memo(MediaTutorial);