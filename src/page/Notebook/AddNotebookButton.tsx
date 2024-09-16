import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApp from '../../hooks/useApp';
import { myAxios } from '../../lib/utils';

export default function AddNotebookButton() {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { setAplication } = useApp();

	const onClick = (e: any) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();

		setLoading(true);
		myAxios
			.post<{ id: number }>('/notebooks')
			.then(({ data }) => {
                console.log(data)
				navigate('/notebooks/' + data.id);
				setAplication('notebooks', (e) => [
					{ id: data.id, name: '', pinnedNotes: [] },
					...e,
				]);
			})
			.finally(() => setLoading(false));
	};

	return (
		<ActionIcon
			variant="default"
			size="sm"
			loading={loading}
			children={<IconPlus size="16" stroke={1.5} />}
			onClick={onClick}
		/>
	);
}
