import { Box, Button, Collapse, NavLink, Stack, StackProps, Text, ThemeIcon } from '@mantine/core'; //prettier-ignore
import { IconNotes, IconStarFilled, IconTagFilled } from '@tabler/icons-react';

import { useDisclosure } from '@mantine/hooks';
import { useMatch, useNavigate } from 'react-router-dom';
import useApp from '../../hooks/useApp';
import Emoji from '../common/Emoji';
import AddNotebookButton from '../../page/Notebook/AddNotebookButton';

export function NavbarSearch(p: StackProps) {
	const { aplication } = useApp();

	return (
		<Stack w="100%" gap="sm" {...p}>
			<NavbarSection
				routerMaker={(e) => `/notebooks/${e.notebookId}/${e.id}`}
				title="Favorit"
				defaultIcon={<IconStarFilled color="orange" size="1.1em" />}
				list={aplication.pinnedNotes}
			/>
			<NavbarSection
				routerMaker={(e) => `/notebooks/${e.id}`}
				title="Notebook"
				defaultIcon={<IconNotes size="1.1em"  color="var(--mantine-color-blue-5)" />}
				list={aplication.notebooks}
				addButton={AddNotebookButton}
			/>
			<NavbarSection
				routerMaker={(e) => `/tags/${e.id}`}
				title="Tags"
				defaultIcon={
					<IconTagFilled
						color="var(--mantine-color-orange-5)"
						size="1.1em"
					/>
				}
				list={aplication.tags}
			/>
		</Stack>
	);
}

interface NavbarSection<T> {
	title: string;
	defaultIcon: any;
	routerMaker: (e: T) => string;
	addButton?: any;
	list: (T & {
		emoji?: string;
		name?: string;
		id?: number;
	})[];
}

function NavbarSection<T>({
	title,
	list,
	defaultIcon,
	addButton: AddButton,
	routerMaker,
}: NavbarSection<T>) {
	const match = useMatch('/*');
	const navigate = useNavigate();
	const activePath = match?.pathname;

	const [opened, { toggle }] = useDisclosure(true);

	return (
		<Box>
			<Button
				justify="space-between"
				fullWidth
				variant="subtle"
				p="6"
				size="compact-md"
				fz="sm"
				rightSection={AddButton ? <AddButton /> : null}
				onClick={toggle}
			>
				<Text c="gray.7" size="sm" fw="500">
					{title}
				</Text>
			</Button>
			<Collapse in={opened}>
				<Stack gap="4" mt="xs" style={{ flexGrow: 1 }} w="100%">
					{list.map((e, i) => (
						<NavLink
							className="myNavLink"
							style={{ borderRadius: '4px' }}
							key={e.id || i}
							p="6"
							active={activePath == routerMaker(e)}
							label={
								<Text truncate fz="sm" fw="500">
									{e.name || '(tanpa nama)'}
								</Text>
							}
							leftSection={
								<ThemeIcon variant="transparent" c="gray.6" size="sm">
									{e.emoji ? (
										<Emoji id={e.emoji} native={e.emoji} />
									) : (
										defaultIcon
									)}
								</ThemeIcon>
							}
							onClick={() => navigate(routerMaker(e))}
						/>
					))}
				</Stack>
			</Collapse>
		</Box>
	);
}
