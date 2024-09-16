import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout';
import Note from './page/Note';
import Notebook from './page/Notebook';


export default createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{ path: 'notebooks/:notebookId', element: <Notebook /> },
			{ path: 'notebooks/:notebookId/:noteId', element: <Note /> },
			{ path: 'tags/:tagId', element: <Note /> },
		],
	},
]);
