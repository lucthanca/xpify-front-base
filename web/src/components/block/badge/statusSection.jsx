import { memo, useMemo } from "react";
import { Badge, Text, Tooltip } from "@shopify/polaris";
import {
  LockIcon
} from '@shopify/polaris-icons';

function BadgeStatusSection({item}) {
	const owned = useMemo(() => {
    if (item?.special_status === 'coming_soon') {
			return <Badge tone='attention' size="small">
        <Text>Coming soon</Text>
      </Badge>
		}

    if (item.price <= 0) {
			return <Badge tone='info' size="small">
        <Text>Free</Text>
      </Badge>
		}

		if (!item.actions?.purchase && item.price > 0) {
			return <Badge tone='success' size="small">
        <Text>Purchased</Text>
      </Badge>
		}

    return (
      <Badge tone='critical' size="small" icon={LockIcon}>
        <Text>Lock</Text>
      </Badge>
    );
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
        return <Badge size="small" progress='complete'>
          <Text>Installed</Text>
        </Badge>;
      }
      return <Badge size="small" progress='incomplete'>
        <Text>Installed</Text>
      </Badge>;
    }
  }, [item]);

  const isConnected = useMemo(() => {
    if (item.url_key === 'instagram-feeds' && item?.installed && item.installed.length) {
      if (item.actions?.connected) {
        return <Badge tone='success' size="small" progress='complete'>
          <Text>Connected</Text>
        </Badge>
      }
      return <Badge tone='warning' size="small">
        <Text>Unconnected</Text>
      </Badge>
    }
  }, [item]);
  return <>{owned} {shouldUpdate} {isConnected}</>;
}

export default memo(BadgeStatusSection);
