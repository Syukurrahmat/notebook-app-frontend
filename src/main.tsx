import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import emojiData from '@emoji-mart/data';
import { createTheme, MantineProvider } from '@mantine/core';
import { init as initEmojiData } from 'emoji-mart';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AppContextProvider } from './hooks/useApp';
import './index.css';
import router from './router';
import { ConfirmDialogProvider } from './hooks/useConfirm';

initEmojiData({ data: emojiData });

const theme = createTheme({
	primaryColor: 'gray',
	fontFamily: 'Inter, sans-serif',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<MantineProvider theme={theme}>
			<Notifications position="top-right" transitionDuration={500} />
			<AppContextProvider>
				<ConfirmDialogProvider>
					<RouterProvider router={router} />
				</ConfirmDialogProvider>
			</AppContextProvider>
		</MantineProvider>
	</React.StrictMode>
);
