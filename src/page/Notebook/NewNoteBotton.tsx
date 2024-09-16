import { Button, ButtonProps } from '@mantine/core'; //prettier-ignore
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

interface ButtonNewNote extends ButtonProps {
	notebookId: number;
}

export default function ButtonNewNote({ notebookId, ...props }: ButtonNewNote) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const onClick = () => {
		setLoading(true);
		axios
			.post(`${API_URL}/notebooks/${notebookId}/notes`)
			.then(({ data }) => {
				const id = data.data.id;
				navigate(`./${id}`);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return <Button loading={loading} onClick={onClick} {...props} />;
}
