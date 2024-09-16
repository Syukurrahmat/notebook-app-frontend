import { Text, TextProps, Title, TitleProps } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import useApp from '../../hooks/useApp';

interface Editable {
	placeholder?: string;
	value?: string;
	_onChange?: (e: string) => any;
}

export function TitleEditable(props: Editable & TitleProps) {
	const {
		placeholder,
		value,
		_onChange: onChange = () => null,
		...rest
	} = props;

	const { isSaving } = useApp()
	const [content, setContent] =
		value === undefined ? useState('') : [value, onChange];
	const contentEditableRef = useRef<any>();

	const onInput = (event: React.FormEvent<HTMLHeadingElement>) => {
		const target = event.target as any;
		if (!target.textContent.trim().length) {
			target.textContent = '';
			setContent('');
		} else {
			setContent(target.textContent);
		}
	};

	const keyPressEvent = (e: any) => {
		if (e.keyCode == 13) e.preventDefault();
	};

	useEffect(() => {
		if (!isSaving && contentEditableRef.current.textContent !== content) {
			contentEditableRef.current.textContent = content;
		}
	}, [content, value]);

	return (
		<Title
			spellCheck={false}
			maw="100%"
			textWrap="wrap"
			ref={contentEditableRef}
			order={1}
			data-placeholder={placeholder}
			contentEditable="plaintext-only"
			onInput={onInput}
			onKeyDown={keyPressEvent}
			{...rest}
		/>
	);
}

export function DescriptionEditable(props: Editable & TextProps) {
	const {
		placeholder,
		value,
		_onChange: onChange = () => null,
		...rest
	} = props;
	const { isSaving } = useApp()

	const [content, setContent] =
		value === undefined ? useState('') : [value, onChange];
	const contentEditableRef = useRef<any>();

	const onInput = (event: React.FormEvent<HTMLHeadingElement>) => {
		const target = event.target as any;
		if (!target.textContent.trim().length) {
			target.textContent = '';
			setContent('');
		} else {
			setContent(target.textContent);
		}
	};

	useEffect(() => {
		if (!isSaving && contentEditableRef.current.textContent !== content) {
			contentEditableRef.current.textContent = content;
		}
	}, [content, value]);

	return (
		<Text
			spellCheck={false}
			maw="100%"
			c="gray.8"
			ref={contentEditableRef}
			data-placeholder={placeholder}
			contentEditable
			onInput={onInput}
			{...rest}
		/>
	);
}
