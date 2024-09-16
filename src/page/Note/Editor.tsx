import { Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

import { Box, Container } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import axios from 'axios';
import { diffChars } from 'diff';
import useSWR from 'swr';
import { API_URL } from '../../config/api';
import useApp from '../../hooks/useApp';
import { fetcher } from '../../lib/utils';

interface MyEditor {
	apiURL: string;
}

export function Editor({ apiURL }: MyEditor) {
	const [initialText, setInitialText] = useState('');
	const { setIsSaving } = useApp();

	const contentApiUrl = apiURL + '/content';
	const { data } = useSWR<Content>(contentApiUrl, fetcher, {
		revalidateIfStale: false,
	});

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link,
			Superscript,
			SubScript,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			Placeholder.configure({ placeholder: 'Tulis catatanmu disini' }),
		],
		content: data?.content,
		onUpdate: () => savingData(),
	});

	useEffect(() => {
		if (data) {
			setInitialText(data.content);
			editor?.commands.setContent(data.content);
		}
	}, [data]);

	const savingData = useDebouncedCallback(async () => {
		const currentText = editor?.getHTML();
		if (!currentText) return;

		const updatedContent = contentDiffGenerator(
			initialText || '',
			currentText
		);
		setIsSaving(true);
		axios
			.patch(API_URL + contentApiUrl, { updatedContent })
			.then(() => setInitialText(currentText))
			.finally(() => setIsSaving(false));
	}, 5000);

	return (
		<Container size="sm">
			<RichTextEditor editor={editor} bd="none">
				<RichTextEditor.Content px="0" />
			</RichTextEditor>
		</Container>
	);
}

function RichTextEditorToolbar() {
	return (
		<RichTextEditor.Toolbar
			p="0"
			bd="none"
			style={{ display: 'flex', justifyContent: 'center' }}
		>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Undo />
				<RichTextEditor.Redo />
			</RichTextEditor.ControlsGroup>
			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Bold />
				<RichTextEditor.Italic />
				<RichTextEditor.Underline />
				<RichTextEditor.Strikethrough />
				<RichTextEditor.ClearFormatting />
				<RichTextEditor.Highlight />
				<RichTextEditor.Code />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.H1 />
				<RichTextEditor.H2 />
				<RichTextEditor.H3 />
				<RichTextEditor.H4 />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Blockquote />
				<RichTextEditor.Hr />
				<RichTextEditor.BulletList />
				<RichTextEditor.OrderedList />
				<RichTextEditor.Subscript />
				<RichTextEditor.Superscript />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.Link />
				<RichTextEditor.Unlink />
			</RichTextEditor.ControlsGroup>

			<RichTextEditor.ControlsGroup>
				<RichTextEditor.AlignLeft />
				<RichTextEditor.AlignCenter />
				<RichTextEditor.AlignJustify />
				<RichTextEditor.AlignRight />
			</RichTextEditor.ControlsGroup>
		</RichTextEditor.Toolbar>
	);
}

type Difference = {
	index: number;
	value?: string;
	count?: number;
	added?: boolean;
	removed?: boolean;
};

function contentDiffGenerator(initial: string, current: string): Difference[] {
	let index = 1;
	return diffChars(initial, current)
		.map((e) => {
			const result = {
				...e,
				index,
				value: e.added ? e.value : undefined,
			};
			if (!e.added) index += e.count!;
			return result;
		})
		.filter((e) => e.removed || e.added);
}
