import { ActionIcon, Box, Flex, Menu, Paper, Pill, PillGroup, SimpleGrid, Space, Stack, Text, ThemeIcon } from '@mantine/core'; //prettier-ignore
import { IconArchive, IconDots, IconStarFilled, IconTrash } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TagList } from '../../components/common/Badge';
import { ItemActionButton } from './NotesTable';

export function NoteCardView({ data }: { data: Note[] }) {
	return (
		<SimpleGrid className="notes-grid">
			{data.map((e) => (
				<NoteCard key={e.id} data={e} />
			))}
		</SimpleGrid>
	);
}

function NoteCard({ data }: { data: Note }) {
	const navigate = useNavigate();
	const [optionIsOpened, setOptionIsOpened] = useState(false);

	return (
		<Paper
			p="md"
			bd="1px solid gray.4"
			radius="md"
			shadow="lg"
			className={!optionIsOpened ? 'note-card' : 'note-card-force-hover'}
			onClick={() => navigate('./' + data.id)}
		>
			<Stack dir="column" gap="4" h="100%">
				<Flex justify="space-between" align="start">
					<Box>
						<Text
							c="dimmed"
							fz="sm"
							children={moment(data.updatedAt).format(
								'DD MMM YYYY HH:mm'
							)}
						/>
						<Text fz="md" fw={500} children={data.name || 'Tanpa Nama'} />
					</Box>
					{data.isPinned && <IconStarFilled size="16" color="orange" />}
				</Flex>
				<Text
					c="dimmed"
					fz="sm"
					className="preview"
					dangerouslySetInnerHTML={{
						__html: data.content || '<i>Catatan Kosong</i>',
					}}
				/>
				<Space my="6" flex="1 0 0" />
				<Flex align="end" justify="space-between">
					<TagList items={data.tags.map((e) => e.name)} />
					<ItemActionButton
						opened={optionIsOpened}
						onChange={setOptionIsOpened}
					/>
				</Flex>
			</Stack>
		</Paper>
	);
}
