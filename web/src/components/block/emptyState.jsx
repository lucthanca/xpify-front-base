import { memo } from "react";

function EmptyState({heading, action, content}) {
	return (
		<EmptyState
			heading={heading}
			action={action}
			image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
		>
			{
				content &&
				<Text variant="bodyMd" as='p'>{content}</Text>
			}
		</EmptyState>
	);
}

export default memo(EmptyState);