import { memo, useCallback } from 'react';
import {
  Banner,
  BlockStack,
  Link,
  List,
  Text
} from "@shopify/polaris";

function BannerDefault({bannerAlert, setBannerAlert, noDismiss }) {
  const handleDismiss = useCallback(() => {
    setBannerAlert && setBannerAlert(undefined);
  }, [setBannerAlert]);
  if (!bannerAlert) return null;
  if (bannerAlert?.embedAppUrl) {
    return (
      <Banner onDismiss={noDismiss ? undefined : handleDismiss} tone='warning'>
        <Text as={'span'}>Enable to allow OT: Theme Sections work on your theme. Go to <Link url={bannerAlert.embedAppUrl}>App Embeds</Link> then enable "Section Builder Script" and "Section Builder Style", make "Save" in your theme editor.</Text>
      </Banner>
    );
  }
  const title = bannerAlert?.title || (bannerAlert.urlSuccessEditTheme ? (bannerAlert.isSimple ? 'Section' : 'Group') + ' installed successfully.' : undefined)
  return (
    bannerAlert &&
    <Banner {...bannerAlert} onDismiss={noDismiss ? undefined : handleDismiss} title={title}>
      {
        bannerAlert?.urlSuccessEditTheme &&
        <>Go to <Link url={bannerAlert.urlSuccessEditTheme}>theme editor</Link> to use this {bannerAlert.isSimple ? 'section' : 'group'}.</>
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
