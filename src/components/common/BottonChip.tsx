import { ActionIcon, ActionIconProps, Center } from '@mantine/core'; //prettier-ignore
import React, { useState } from 'react';

interface ButtonChip extends ActionIconProps {
	iconList: [React.ReactNode, React.ReactNode];
	value?: boolean;
	onChange?: (e: boolean) => any;
}

export default function ButtonChip({
	iconList,
	value: controlledVal,
	onChange,
	...p
}: ButtonChip) {
	const [value, setValue] =
		controlledVal !== undefined
			? [controlledVal, onChange || (() => null)]
			: useState(false);

	return (
		<Center>
			<input
				checked={controlledVal}
				type="checkbox"
				style={{ display: 'none' }}
			/>
			<ActionIcon component="label" {...p} onClick={() => setValue(!value)}>
				{iconList[value ? 1 : 0]}
			</ActionIcon>
		</Center>
	);
}
