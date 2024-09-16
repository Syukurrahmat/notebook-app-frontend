import { Badge, BadgeProps, Flex, Group } from '@mantine/core';
import { IconHash, IconTag } from '@tabler/icons-react';

interface TagList {
	items: string[];
	max?: number;
	noWrap?: boolean;
}

export function TagList({ items, max, noWrap }: TagList) {
	const slicedItem = items.slice(0, max);
	const more = items.length - slicedItem.length;

	const badgeStyle: BadgeProps = {
		tt: 'initial',
		fw: '500',
		variant: 'light',
		c: 'dark',
		py: 'xs',
	};

	return (
		<Group wrap={noWrap ? 'nowrap' : 'wrap'} gap="6">
			{slicedItem.map((item, i) => (
				<Badge
					key={i}
					{...badgeStyle}
					leftSection={<IconHash size="14" />}
					children={item}
				/>
			))}
			{!!more && <Badge {...badgeStyle} children={`+${more} lainnya`} />}
		</Group>
	);
}

export function Tag({ children }: any) {
	return <Badge variant="light" children={children} />;
}
