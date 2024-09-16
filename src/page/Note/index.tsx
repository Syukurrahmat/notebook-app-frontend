import {
	ActionIcon,
	Button,
	Container, Divider, Group, Menu, Stack,
	Text, ThemeIcon
} from '@mantine/core'; //prettier-ignore
import { notifications } from '@mantine/notifications';
import {
	IconArchive,
	IconDots,
	IconEdit,
	IconLock,
	IconLockOpen2,
	IconStar,
	IconStarFilled,
	IconTrash,
	IconViewportNarrow,
	IconViewportTall,
	IconViewportWide,
} from '@tabler/icons-react';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { TagList } from '../../components/common/Badge';
import { TitleEditable } from '../../components/common/EditableComponent'; //prettier-ignore
import { Header } from '../../components/layout/Header';
import useApp from '../../hooks/useApp';
import useAutoSave from '../../hooks/useAutoSave';
import useConfimDialog from '../../hooks/useConfirm';
import { fetcher, myAxios } from '../../lib/utils';
import { Editor } from './Editor';
import ButtonChip from '../../components/common/BottonChip';

export default function Note() {
	const { noteId, notebookId } = useParams();
	const apiURL = `/notebooks/${notebookId}/notes/${noteId}`;
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
				{data && (
					<>
						<ButtonChip
							color="yellow"
							variant="subtle"
							iconList={[
								<IconStar size="20" />,
								<IconStarFilled size="20" />,
							]}
						/>
						<ButtonChip
							color="blue"
							variant="subtle"
							iconList={[
								<IconLockOpen2 size="20" />,
								<IconLock size="20" />,
							]}
						/>
						<NoteMenuButton data={data} />
					</>
				)}
			</Header>
			{loaded ? (
				<>
					<Container size="md" mt="sm" mb="xs">
						<Group
							p="md"
							justify="space-between"
							wrap="nowrap"
							align="start"
						>
							<Stack gap="xs">
								<TitleEditable
									fw="500"
									fz="h2"
									placeholder="Tulis Judul Catatan"
									value={autoSaveData.name}
									_onChange={(e) => setAutoSaveData('name', e)}
								/>
								<Group wrap="nowrap" gap="6">
									<TagList items={data.tags.map((e) => e.name)} />
									<Button
										leftSection={<IconEdit size="16" />}
										size="compact-xs"
										variant="light"
										radius="xl"
										children="Sunting"
									/>
								</Group>
								{/* <MyTagsInput
									value={autoSaveData.tags}
									onChange={(e) => setAutoSaveData('tags', e)}
								/> */}
							</Stack>
							<Text c="dimmed" fz="sm">
								Terakhir diubah{' '}
								{moment(data.updatedAt).format('DD MMM YYYY HH:mm')}
							</Text>
						</Group>
						<Divider color="gray.1" />
					</Container>

					<Editor apiURL={apiURL} />
				</>
			) : null}
		</>
	);
}

function NoteMenuButton({ data }: { data: Note }) {
	const navigate = useNavigate();
	const { setAplication } = useApp();
	const confirmDialog = useConfimDialog();

	const onDelete = () => {
		confirmDialog({
			title: 'Hapus Catatan',
			content: 'Anda Yakin hendak menghapus catatan ini?',
			confirmText: 'Hapus',
			confirmButtonColor: 'red',
			onConfirm: async () => {
				return await myAxios
					.delete('/notes/' + data)
					.then(() => {
						navigate('..');
						notifications.show({
							title: 'Berhasil',
							message: 'Catatan berhasil dihapus',
							color: 'blue',
						});
						if (data.isPinned) {
							setAplication('pinnedNotes', (e) =>
								e.filter((f) => f.id !== data.id)
							);
						}
					})
					.catch(() => {
						notifications.show({
							title: 'Gagal',
							message: 'Ops... Ada yang salah',
							color: 'red',
						});
					});
			},
		});
	};

	return (
		<>
			<Menu shadow="md">
				<Menu.Target>
					<ActionIcon variant="subtle">
						<IconDots />
					</ActionIcon>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Item
						leftSection={
							<ThemeIcon
								size="sm"
								color="blue"
								variant="transparent"
								children={<IconViewportWide size="18" />}
							/>
						}
						children="Lebarkan"
					/>
					<Menu.Item
						leftSection={
							<ThemeIcon
								size="sm"
								color="gray"
								variant="transparent"
								children={<IconArchive size="18" />}
							/>
						}
						children="Arsipkan"
					/>
					<Menu.Item
						leftSection={
							<ThemeIcon
								size="sm"
								color="red"
								variant="transparent"
								children={<IconTrash size="18" />}
							/>
						}
						onClick={onDelete}
						children="Hapus Catatan"
					/>
				</Menu.Dropdown>
			</Menu>
		</>
	);
}
