import { AppShell, Breadcrumbs, Button, Container, ContainerProps, Divider, Group, Loader, rem, ScrollArea, Skeleton, Stack, Text, ThemeIcon, Title } from '@mantine/core'; //prettier-ignore
import { IconChevronRight, IconHome2, IconNotebook, IconSearch } from '@tabler/icons-react'; //prettier-ignore
import { Outlet, useNavigate } from 'react-router-dom';
import useApp from '../../hooks/useApp';
import Emoji from '../common/Emoji';
import { NavbarSearch } from './Navbar';
import { Children } from 'react';

const navbarTopButtonStyle = {
	justify: 'start',
	variant: 'subtle',
	size: 'compact-md',
	fz: 'sm',
};

export default function Layout() {
	const sidebarWidth = 280;

	return (
		<AppShell
			layout="alt"
			header={{ height: 0 }}
			navbar={{
				width: sidebarWidth,
				breakpoint: 'sm',
			}}
		>
			<AppShell.Navbar bg="#f7f7f5">
				<AppShell.Section p="sm">
					<Stack gap="8">
						<Group gap="xs" px="8" mb="8">
							<ThemeIcon color="blue" p="2">
								<IconNotebook />
							</ThemeIcon>
							<Title size="h3">Cathet</Title>
						</Group>
						<Button
							leftSection={<IconHome2 size="18" />}
							children="Beranda"
							{...navbarTopButtonStyle}
						/>
						<Button
							leftSection={<IconSearch size="18" />}
							children="Cari"
							{...navbarTopButtonStyle}
						/>
						<Divider />
					</Stack>
				</AppShell.Section>
				<AppShell.Section px="sm" maw="100%" grow component={ScrollArea}>
					<NavbarSearch maw={sidebarWidth - 25} />
				</AppShell.Section>
			</AppShell.Navbar>
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}

