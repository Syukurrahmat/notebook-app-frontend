import { createContext, useContext, useState } from 'react'; //prettier-ignore
import useSWR from 'swr';
import { fetcher } from '../lib/utils';
import { useLocalStorage } from '@mantine/hooks';

type ApplicationData = {
	user: {
		id: number;
		email: string;
		name: string;
		profilePicture?: string;
	};
	pinnedNotes: {
		id: number;
		name?: string;
		notebookId: number;
	}[];
	notebooks: {
		id: number;
		name?: string;
		emoji?: string;
	}[];
	tags: {
		id: number;
		name: string;
	}[];
};
export type View = 'list' | 'card';
type AppContext = {
	aplication: ApplicationData;
	setAplication: <T extends keyof ApplicationData>(
		key: T,
		func: (e: ApplicationData[T]) => ApplicationData[T]
	) => void;

	isSaving: boolean;
	setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;

	notesView: View;
	setNotesView: (val: View | ((prevState: View) => View)) => void;
};

const AppContext = createContext<AppContext>({
	aplication: {
		user: {
			id: NaN,
			email: '',
			name: '',
			profilePicture: '',
		},
		notebooks: [],
		tags: [],
		pinnedNotes: [],
	},
	setAplication: async () => undefined,
	isSaving: false,
	setIsSaving: () => undefined,
	notesView: 'card',
	setNotesView: () => undefined,
});

export default function useApp() {
	return useContext(AppContext);
}

export function AppContextProvider(props: any) {
	const [isSaving, setIsSaving] = useState(false);
	const { data: aplication, mutate } = useSWR<ApplicationData>(
		`/app`,
		fetcher
	);
	const [notesView, setNotesView] = useLocalStorage<View>({
		key: 'view',
		defaultValue: 'card',
	});

	const setAplication: AppContext['setAplication'] = (key, func) => {
		mutate((e) => (e ? { ...e, [key]: func(e[key]) } : e), {
			revalidate: false,
		});
	};

	if (!aplication) return 'loading';

	return (
		<AppContext.Provider
			value={{
				aplication,
				setAplication,
				isSaving,
				setIsSaving,
				notesView,
				setNotesView,
			}}
			children={props.children}
		/>
	);
}
