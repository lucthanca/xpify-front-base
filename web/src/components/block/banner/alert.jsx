import { memo, useCallback } from 'react';
import {
  Banner,
  BlockStack,
  Link,
  List,
  Text
} from "@shopify/polaris";

function BannerDefault({bannerAlert, setBannerAlert, noDismiss }) {
  console.log('re-render banner');
  const handleDismiss = useCallback(() => {
    setBannerAlert && setBannerAlert(undefined);
  }, [setBannerAlert]);
  return (
    bannerAlert &&
    <Banner {...bannerAlert} onDismiss={noDismiss ? undefined : handleDismiss}>
      {
        bannerAlert?.urlSuccessEditTheme &&
        <div>{bannerAlert.isSimple ? 'Section' : 'Group'} installed successfully. Go to <Link url={bannerAlert.urlSuccessEditTheme}>theme editor</Link> to use this {bannerAlert.isSimple ? 'section' : 'group'}.</div>
      }
      {
        bannerAlert.content &&
        <BlockStack gap={200}>
          <List>
            {
              bannerAlert.content.map((item, key) => {
                return item && (
                  <List.Item key={key}>
                    <Text variant="bodySm">{item.debugMessage ?? item.message}</Text>
                  </List.Item>
                );
              })
            }
          </List>
        </BlockStack>
      }
    </Banner>
  );
}

export default memo(BannerDefault);
