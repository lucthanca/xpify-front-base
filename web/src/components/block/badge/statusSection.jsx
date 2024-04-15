import { memo, useMemo } from "react";
import { Badge, Text, Tooltip } from "@shopify/polaris";

function BadgeStatusSection({item}) {
	const owned = useMemo(() => {
		if (!item.actions?.purchase && item.price > 0) {
			return <Badge tone='info' size="small">
         <Tooltip content="Owned">
          <Text>Purchased</Text>
        </Tooltip>
      </Badge>
		}
  }, [item]);

	const shouldUpdate = useMemo(() => {
    if (item?.installed && item.installed.length) {
      // Group not handle check should update - optimize performance
      if (item?.child_ids) {
        return <Badge tone='success' size="small">
          <Text>Installed</Text>
        </Badge>;
      }

      const updated = item.installed.find(data => data.product_version == item.version);
      if (updated) {
        return <Badge tone='success' size="small" progress='complete'>
          <Tooltip content="Installed laster version">
            <Text>Installed</Text>
          </Tooltip>
        </Badge>;
      }
      return <Badge tone='success' size="small" progress='incomplete'>
        <Tooltip content="Should update now">
          <Text>Installed</Text>
        </Tooltip>
      </Badge>;
    }
  }, [item]);

  return <>{shouldUpdate} {owned}</>;
}

export default memo(BadgeStatusSection);