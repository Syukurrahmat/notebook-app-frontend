import { ActionIcon, Container, Group, Menu, rem, Skeleton, Stack, ThemeIcon } from '@mantine/core'; //prettier-ignore
import { notifications } from '@mantine/notifications';
import { IconArchive, IconDots, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { DescriptionEditable, TitleEditable } from '../../components/common/EditableComponent'; //prettier-ignore
import { Header } from '../../components/layout/Header';
import useApp from '../../hooks/useApp';
import useAutoSave from '../../hooks/useAutoSave';
import useConfimDialog from '../../hooks/useConfirm';
import { fetcher, myAxios } from '../../lib/utils';
import EmojiPicker from './EmojiPicker';
import NotesTable from './NotesTable';

export default function Notebook() {
	const { notebookId } = useParams();
	const { setAplication } = useApp();
	const apiUrl = `/notebooks/${notebookId}`;

	const { data } = useSWR<Notebook>(apiUrl, fetcher);

	const { autoSaveData, setAutoSaveData } = useAutoSave<Notebook>(
		apiUrl,
		data
	);

	useEffect(() => {
		if (data) {
			const { name, emoji } = data;
			setAplication('notebooks', (e) =>
				e.map((f) => (f.id == data.id ? { ...f, name, emoji } : f))
			);
		}
	}, [data]);

	const loaded = autoSaveData && data && setAutoSaveData;

	return (
		<>
			<Header isLoading={!autoSaveData} activeNotebook={autoSaveData}>
				{data && <NotebookMenuButton data={data} />}
			</Header>

			<Container size="md" py="16">
				{!loaded ? (
					<NotebookSkeleton />
				) : (
					<>
						<Stack gap="xs">
							<Group gap="sm">
								<EmojiPicker
									value={autoSaveData.emoji}
									onChange={(emoji) => {
										setAutoSaveData('emoji', emoji);
									}}
								/>
								<TitleEditable
									placeholder="Tulis Nama notebook"
									value={autoSaveData.name}
									_onChange={(e) => {
										setAutoSaveData('name', e);
									}}
								/>
							</Group>

							<DescriptionEditable
								placeholder="Tulis deskripsi"
								value={autoSaveData.description}
								_onChange={(e) => setAutoSaveData('description', e)}
							/>
						</Stack>
					</>
				)}
				<NotesTable mt="xs" notebookId={autoSaveData?.id} />
			</Container>
		</>
	);
}

function NotebookSkeleton() {
	return (
		<>
			<Group gap="sm">
				<Skeleton radius="md" h={rem(50)} w={rem(50)} />
				<Skeleton w="50%" radius="full" h={rem(32)} />
			</Group>
			<Skeleton mt="md" w="75%" h="lg" />
		</>
	);
}

function NotebookMenuButton({ data }: { data: Notebook }) {
	const navigate = useNavigate();
	const { setAplication } = useApp();
	const confirmDialog = useConfimDialog();

	const onDelete = () => {
		confirmDialog({
			title: 'Hapus Notebook',
			content: 'Anda Yakin hendak menghapus notebook ini?',
			confirmText: 'Hapus',
			confirmButtonColor: 'red',
			onConfirm: async () => {
				return await myAxios
					.delete('/notebooks/' + data)
					.then(() => {
						navigate('/');
						notifications.show({
							title: 'Berhasil',
							message: 'Notebook berhasil dihapus',
							color: 'blue',
						});
						setAplication('notebooks', (e) =>
							e.filter((f) => f.id !== data.id)
						);
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
								color="gray"
								variant="transparent"
								children={<IconArchive size="18" />}
							/>
						}
						children="Tampilkan Catatan Arsip"
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
						children="Hapus Notebook"
					/>
				</Menu.Dropdown>
			</Menu>
		</>
	);
}
