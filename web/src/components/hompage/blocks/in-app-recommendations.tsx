import {
  BlockStack,
  Card,
  Icon,
  InlineGrid,
  Text,
  SkeletonBodyText,
  InlineStack, Box,
  SkeletonThumbnail,
  SkeletonDisplayText,
} from '@shopify/polaris';
import { useAppRecommend } from '~/talons/useAppRecommend';
import type { AppRecommend } from '~/@types';
import DismissedCard from '~/components/hompage/blocks/dismissed';
import { CloseBtn } from '~/components/hompage/blocks/close-btn';

export type AppRecommendItemProps = {
  app: AppRecommend;
};
const AppRecommendItemSkeleton = () => {
  const maxWidth = Math.floor(Math.random() * (55 - 25 + 1)) + 25;
  const maxWithName: `${number}%` = `${maxWidth}%`;
  return (
    <InlineStack gap='300' blockAlign='start' wrap={false}>
      <div><SkeletonThumbnail size='medium'/></div>
      <div className='w-full'>
        <BlockStack gap='200'>
          <div className='w-full'><SkeletonDisplayText size='small' maxWidth={maxWithName} /></div>
          <SkeletonBodyText lines={2} />
        </BlockStack>
      </div>
    </InlineStack>
  );
};

const AppRecommendItem = (props: AppRecommendItemProps) => {
  const { app } = props;
  return (
    <InlineStack gap='300' blockAlign='start' wrap={false}>
      <a href={app.url} className='w-16 aspect-square rounded-[1.25rem] relative block overflow-hidden flex-shrink-0' target='_blank'>
        <img src={app.icon_url} alt={app.name} className='w-full h-full absolute object-cover' />
      </a>
      <BlockStack gap='200'>
        <a href={app.url} target='_blank'><Text as='h3' variant='headingXs'>{app.name}</Text></a>
        <Text as='p' variant='bodySm'>{app.description}</Text>
      </BlockStack>
    </InlineStack>
  );
};

const InAppRecommendations = () => {
  const { apps, loadingWithoutData, loadingWithoutCache, dismissTriggered, isDismissed, dismiss, undo, ref, inView, intersected } = useAppRecommend();
  const displaySkeleton = loadingWithoutCache || loadingWithoutData;

  console.log({ 'app_rcm_inview': inView });
  let content

  if (intersected && dismissTriggered) {
    content = <DismissedCard onUndo={undo} />;
  } else if (intersected && (isDismissed || (apps.length === 0 && !displaySkeleton))) {
  } else {
    content = (
      <Card roundedAbove="sm">
        <div className="xpify_dismissible_content">
          <BlockStack gap="400">
            <InlineGrid columns="1fr auto">
              <Text as="h2" variant="headingSm">More apps your store might need</Text>
            </InlineGrid>

            <InlineGrid gap="400" columns={{ xs: '1fr', md: '1fr 1fr' }}>
              {displaySkeleton && [1, 2, 3, 4, 5, 6].map((index) => <AppRecommendItemSkeleton key={index} />)}
              {!displaySkeleton && apps.map((app, index) => <AppRecommendItem key={index} app={app} />)}
            </InlineGrid>
          </BlockStack>
          {!displaySkeleton && <CloseBtn dismiss={dismiss} />}
        </div>
      </Card>
    );
  }
  return (
    <div ref={ref}>
      {content}
    </div>
  );
};

export default InAppRecommendations;
