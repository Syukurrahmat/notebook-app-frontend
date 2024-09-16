import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

import {
	Box,
	Button,
	ButtonProps,
	Divider,
	Flex,
	Popover,
	rem,
	Text,
} from '@mantine/core';
import { useState } from 'react';
import Emoji from '../../components/common/Emoji';

interface EmojiPicker extends ButtonProps {
	value?: string;
	emojiSize?: string;
	onChange?: (s: string) => any;
}

export default function EmojiPicker({ value, onChange, ...rest }: EmojiPicker) {
	const [content, setContent] =
		value !== undefined ? [value, onChange || (() => null)] : useState(value);

	return (
		<Popover width={200} shadow="md">
			<Popover.Target>
				<Button
					className="emoji-container"
					pos="relative"
					variant="light"
					color="gray"
					w={rem(50)}
					radius="md"
					h={rem(50)}
					style={{ userSelect: 'none' }}
					{...rest}
				>
					<Box className="emoji-bg" />
					<Emoji
						id={content}
						native={content}
						size={rem(32)}
						class="emoji-item"
					/>
				</Button>
			</Popover.Target>
			<Popover.Dropdown w="350px" px="4px" py="md">
				<Flex px="12px" pb="xs" justify="space-between" align="center">
					<Text fw="600">Pilih Emoji</Text>
				</Flex>
				<Divider
					style={{
						borderColor: 'var(--color-border, rgba(0, 0, 0, .05))',
					}}
				/>
				<Picker
					dynamicWidth
					theme="light"
					autoFocus
					previewPosition="none"
					data={data}
					skinTonePosition="none"
					onEmojiSelect={(e: any) => {
						setContent(e.id);
					}}
				/>
			</Popover.Dropdown>
		</Popover>
	);
}
