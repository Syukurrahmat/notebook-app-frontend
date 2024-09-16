import { Breadcrumbs, Button, Container, ContainerProps, Group, Loader, rem, Skeleton, Text, ThemeIcon } from '@mantine/core'; //prettier-ignore
import { IconChevronRight } from '@tabler/icons-react'; //prettier-ignore
import { useNavigate } from 'react-router-dom';
import useApp from '../../hooks/useApp';
import Emoji from '../common/Emoji';

interface Header extends ContainerProps {
	isLoading?: boolean;
	activeNotebook?: Partial<Notebook>;
	activeNote?: Note;
	children?: any;
}

export function Header({
	isLoading,
	activeNote,
	activeNotebook,
	children,
}: Header) {
	const { isSaving } = useApp();
	const navigate = useNavigate();
	return (
		<Container
			pos="sticky"
			top="0"
			bg="white"
			h="52"
			fluid
			component={Group}
			style={{
				zIndex: 100,
				justifyContent: 'space-between',
				borderBottom: '1px solid var(--app-shell-border-color)',
			}}
		>
			{!isLoading ? (
				<>
					<Group>
						<Breadcrumbs
							separatorMargin="0"
							separator={
								<ThemeIcon
									size="xs"
									variant="transparent"
									children={<IconChevronRight />}
								/>
							}
						>
							{activeNotebook && (
								<Button
									size="compact-sm"
									fw="normal"
									c="gray.8"
									variant="subtle"
									leftSection={
										<ThemeIcon
											variant="transparent"
											children={<Emoji id={activeNotebook.emoji} />}
											size="sm"
										/>
									}
									children={activeNotebook.name || 'Tanpa Nama'}
									onClick={() =>
										navigate(`/notebooks/${activeNotebook.id}`)
									}
								/>
							)}

							{activeNote && activeNotebook && (
								<Button
									size="compact-sm"
									fw="normal"
									variant="subtle"
									children={activeNote.name || 'Tanpa Nama'}
									onClick={() =>
										navigate(
											`/notebooks/${activeNotebook.id}/${activeNote.id}`
										)
									}
								/>
							)}
						</Breadcrumbs>
						{isSaving && (
							<Group gap="8">
								<Loader size="16" c="gray.5" />
								<Text fz="sm" c="gray.5">
									Menyimpan
								</Text>
							</Group>
						)}
					</Group>
					<Group gap='8'>{children}</Group>
				</>
			) : (
				<Group px="6" gap="10px">
					<Skeleton w={rem(22)} h={rem(22)} />
					<Skeleton w="100px" h={rem(16)} />
				</Group>
			)}
		</Container>
	);
}
