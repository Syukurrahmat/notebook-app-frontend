import { Center, Group, Table, Text, ThemeIcon } from '@mantine/core'; //prettier-ignore
import { IconAbc, IconArrowRight, IconCalendar, IconEye, IconHash, IconSquareArrowRight, IconStarFilled } from '@tabler/icons-react'; //prettier-ignore
import moment from 'moment';
import { TagList } from '../../components/common/Badge';
import { ItemActionButton } from './NotesTable';
import { useNavigate } from 'react-router-dom';

export default function ListView({ data }: { data: Note[] }) {
	const headerTableList = [
		{ value: 'Judul Catatan', icon: <IconAbc size="24" /> },
		{ value: 'Tagar', icon: <IconHash size="18" /> },
		{ value: 'Terakhir diubah', icon: <IconCalendar size="18" /> },
	];
	return (
		<Table
			highlightOnHover
			verticalSpacing="sm"
			style={{ borderRadius: '8px', overflow: 'hidden' }}
		>
			<Table.Thead bg="gray.1">
				<Table.Tr>
					<Table.Th />
					{headerTableList.map((e, i) => (
						<Table.Th key={i}>
							<Group wrap="nowrap" gap="6">
								<ThemeIcon
									variant="transparent"
									c="gray.7"
									children={e.icon}
								/>
								<Text
									flex="1 0 200px"
									c="gray.7"
									fw="600"
									children={e.value}
								/>
							</Group>
						</Table.Th>
					))}
					<Table.Th />
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{data.map((e) => (
					<ListViewItem key={e.id} data={e} />
				))}
			</Table.Tbody>
		</Table>
	);
}

function ListViewItem({ data }: { data: Note }) {
	const navigate = useNavigate();
	return (
		<Table.Tr
			key={data.name}
			onClick={() => navigate('./' + data.id)}
			className="list-table-item"
		>
			<Table.Th px="8">
				{data.isPinned && (
					<Center>
						<IconStarFilled size="16" color="orange" />
					</Center>
				)}
			</Table.Th>
			<Table.Td>
				<Group justify="space-between">
					<Text fz="md" fw={500}>
						{data.name || 'Tanpa Nama'}
					</Text>
				</Group>
			</Table.Td>
			<Table.Td maw="300px">
				<TagList noWrap={false} items={data.tags.map((e) => e.name)} />
			</Table.Td>
			<Table.Td>
				{moment(data.updatedAt).format('DD MMM YYYY HH:mm')}
			</Table.Td>
			<Table.Td>
				<ItemActionButton />
			</Table.Td>
		</Table.Tr>
	);
}
