import { ActionIcon, Container, Stack } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { TitleEditable } from '../../components/common/EditableComponent';
import { Header } from '../../components/layout/Header';
import useAutoSave from '../../hooks/useAutoSave';
import { fetcher } from '../../lib/utils';

export default function Tags() {
	const { tagId } = useParams();
	const apiURL = `/tags/${tagId}/notes`;
	const { data } = useSWR<Note>(apiURL, fetcher);

	const { autoSaveData, setAutoSaveData } = useAutoSave<Note>(apiURL, data);

	const loaded =
		data && autoSaveData && setAutoSaveData && autoSaveData.id === data.id;

	return (
		<>
			<Header
				isLoading={!data}
				activeNote={data}
				activeNotebook={data?.Notebook}
			>
				<ActionIcon variant="subtle">
					<IconDots />
				</ActionIcon>
			</Header>
			{loaded ? (
				<>
					<Container size="sm" py="sm">
						<Stack gap="xs" px="md" py="sm">
							<TitleEditable
								fw="600"
								fz="h2"
								placeholder="Tulis Judul Catatan"
								value={autoSaveData.name}
								_onChange={(e) => setAutoSaveData('name', e)}
							/>

							{/* <MyTagsInput
								value={autoSaveData.tags}
								onChange={(e) => setAutoSaveData('tags', e)}
							/> */}
						</Stack>
					</Container>

				</>
			) : null}
		</>
	);
}
 