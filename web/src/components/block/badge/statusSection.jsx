import { memo, useMemo } from "react";
import { Badge, Text } from "@shopify/polaris";

function BadgeStatusSection({item}) {
	const owned = useMemo(() => {
		if (!item.actions?.purchase && item.price > 0) {
			return <Badge tone='info'>Purchased</Badge>
		}
  }, [item]);

	const shouldUpdate = useMemo(() => {
    if (!item.actions?.install) {
			return <></>;
		}

    if (!item?.installed) {
      return <Badge tone='success' progress='incomplete'>Ready</Badge>;
    }
    const updated = item.installed.find(data => data.product_version == item.version);
    if (updated) {
      return <Badge tone='success' progress='complete'>Ready</Badge>;
    }
    return <Badge tone='success' progress={item?.child_ids ? '' : 'partiallyComplete'}>Ready</Badge>;
  }, [item]);

  return <>{owned} {shouldUpdate}</>;
}

export default memo(BadgeStatusSection);