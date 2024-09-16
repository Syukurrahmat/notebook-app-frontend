import { ActionIcon, Center, Group, Menu, MenuProps, Pagination, rem, SegmentedControl, SimpleGrid, Skeleton, Stack, StackProps, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconArchive, IconDots, IconLayoutGrid, IconLayoutList, IconPlus, IconTrash } from '@tabler/icons-react'; //prettier-ignore
import { useState } from 'react';
import useSWR from 'swr';
import useApp, { View } from '../../hooks/useApp';
import { fetcher } from '../../lib/utils';
import ButtonNewNote from './NewNoteBotton';
import { NoteCardView } from './NoteCardView';
import ListView from './NoteListView';

interface NotesTable extends StackProps {
	notebookId?: number;
}

export default function NotesTable({ notebookId, ...p }: NotesTable) {
	const { notesView, setNotesView } = useApp();
	const apiURL = `/notebooks/${notebookId}/notes`;

	const viewInput = [
		{ value: 'card', icon: IconLayoutGrid },
		{ value: 'list', icon: IconLayoutList },
	];

	const [activePage, setPage] = useState(1);

	const { data } = useSWR<PaginationResp<Note>>(
		notebookId ? apiURL + '?page=' + activePage : null,
		fetcher
	);

	return (
		<Stack gap="md" {...p}>
			{data && notebookId ? (
				data.meta.total ? (
					<>
						<Group justify="space-between" align="end">
							<Text c="gray.7" fw="500">
								{data.meta.total} Catatan
							</Text>
							<Group>
								<SegmentedControl
									color="blue"
									value={notesView}
									onChange={(e) => setNotesView(e as View)}
									withItemsBorders={false}
									data={viewInput.map((e) => ({
										value: e.value,
										label: (
											<Center style={{ gap: 10 }}>
												<e.icon size="18" />
											</Center>
										),
									}))}
								/>

								<ButtonNewNote
									color="blue"
									leftSection={<IconPlus />}
									notebookId={notebookId}
									children="Tambah Catatan"
								/>
							</Group>
						</Group>
						{notesView == 'list' ? (
							<ListView data={data.rows} />
						) : (
							<NoteCardView data={data.rows} />
						)}
						<Pagination
							style={{ alignSelf: 'end' }}
							total={data.meta.totalPage}
							value={activePage}
							onChange={setPage}
							radius="md"
							hideWithOnePage
						/>
					</>
				) : (
					<Stack py="xl" align="center">
						<ButtonNewNote
							variant="transparent"
							size="xl"
							notebookId={notebookId}
						>
							<Stack gap="0">
								<Title size="h2" fw="600" component="p" c="gray.5">
									Belum Anda Catatan
								</Title>
								<Text c="gray.5" fz="sm">
									Klik untuk membuat Catatan
								</Text>
							</Stack>
						</ButtonNewNote>
					</Stack>
				)
			) : (
				<NotesTableSkeleton view={notesView} />
			)}
		</Stack>
	);
}

export function ItemActionButton(p: MenuProps) {
	return (
		<Menu shadow="md" position="bottom-end" {...p}>
			<Menu.Target>
				<ActionIcon
					onClick={(e) => e.stopPropagation()}
					variant="subtle"
					children={<IconDots size="18" />}
				/>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Item
					leftSection={
						<ThemeIcon
							size="sm"
							color="red"
							variant="transparent"
							children={<IconTrash size="18" />}
						/>
					}
					children="Hapus"
				/>
				<Menu.Item
					leftSection={
						<ThemeIcon
							size="sm"
							variant="transparent"
							children={<IconArchive size="18" />}
						/>
					}
					children="Arsipkan"
				/>
			</Menu.Dropdown>
		</Menu>
	);
}

function NotesTableSkeleton({ view }: { view: View }) {
	return (
		<>
			<Group h={rem(36)}></Group>
			{view == 'list' ? (
				<Stack gap="4px">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={i} w="100%" h={rem(48)} radius="4px" />
					))}
				</Stack>
			) : (
				<SimpleGrid className="notes-grid">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={i} radius="md" h={rem(150)} />
					))}
				</SimpleGrid>
			)}
		</>
	);
}
