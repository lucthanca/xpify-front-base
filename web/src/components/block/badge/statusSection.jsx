import { memo, useMemo } from "react";
import { Badge, Text, Tooltip } from "@shopify/polaris";

function BadgeStatusSection({item}) {
	const owned = useMemo(() => {
		if (!item.actions?.purchase && item.price > 0) {
			return <Badge tone='info' size="small">
         <Tooltip content="Owned forever">
          <Text>Purchased</Text>
        </Tooltip>
      </Badge>
		}
  }, [item]);

	const shouldUpdate = useMemo(() => {
    if (!item.actions?.install) {
			return <></>;
		}

    if (!item?.installed) {
      return <Badge tone='success' size="small" progress='incomplete'>
        <Tooltip content="Not installed yet">
          <Text>Ready</Text>
        </Tooltip>
      </Badge>;
    }
    const updated = item.installed.find(data => data.product_version == item.version);
    if (updated || item?.child_ids) {
      return <Badge tone='success' size="small" progress='complete'>
        <Tooltip content="Installed laster version">
          <Text>Ready</Text>
        </Tooltip>
      </Badge>;
    }
    return <Badge tone='success' size="small" progress={'partiallyComplete'}>
      <Tooltip content="Should update now">
        <Text>Ready</Text>
      </Tooltip>
    </Badge>;
  }, [item]);

  return <>{shouldUpdate} {owned}</>;
}

export default memo(BadgeStatusSection);