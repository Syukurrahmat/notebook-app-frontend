import { Button, Group, Modal, Title } from '@mantine/core'; //prettier-ignore
import { useDisclosure } from '@mantine/hooks';
import React, { createContext, useContext, useState } from 'react';

type ConfirmData = {
	confirmText?: string;
	confirmButtonColor?: string;
	onConfirm?: () => Promise<any>;
	title?: string;
	content?: React.ReactNode;
};

type ConfirmDialogContext = (v: ConfirmData) => void;
const ConfirmDialogContext = createContext<ConfirmDialogContext>(() => null);

export default function useConfimDialog() {
	return useContext(ConfirmDialogContext);
}

export function ConfirmDialogProvider(props: any) {
	const [opened, { close, open }] = useDisclosure(false, {
		onClose: () => setData(null),
	});
	const [isLoading, setIsloading] = useState(false);
	const [data, setData] = useState<ConfirmData | null>(null);

	const confimDialog: ConfirmDialogContext = (v) => {
		open();
		setData(v);
	};

	return (
		<ConfirmDialogContext.Provider value={confimDialog}>
			{props.children}

			<Modal
				opened={opened}
				onClose={close}
				title={
					<Title
						size="h4"
						fw="600"
						children={data?.title || 'Konfirmasi'}
					/>
				}
			>
				{data?.content}
				<Group mt="lg" justify="end" gap="xs">
					<Button
						variant="light"
						style={{ order: 1 }}
						onClick={close}
						children="Batal"
					/>
					<Button
						color={data?.confirmButtonColor || 'blue'}
						style={{ order: 0 }}
						onClick={() => {
							if (data && data.onConfirm) {
								setIsloading(true);
								data.onConfirm().finally(() => {
									setIsloading(false)
									close()
								});
							}
						}}
						loading={isLoading}
						children={data?.confirmText || 'Konfirmasi'}
					/>
				</Group>
			</Modal>
		</ConfirmDialogContext.Provider>
	);
}
