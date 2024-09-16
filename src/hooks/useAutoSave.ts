import { useDebouncedCallback } from "@mantine/hooks";
import axios from 'axios';
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { API_URL } from "../config/api";
import useApp from "./useApp";

export default function useAutoSave<T extends (Record<string, any> & { id: number })>(
	patchURL: string,
	serverAtData: T | undefined,
) {
	const { setIsSaving } = useApp()
	const [data, setData] = useState(serverAtData);

	const savingData = async (withOutMutate?: boolean) => {
		const changedData: Partial<T> = {};

		for (const key in serverAtData) {
			if (data && serverAtData[key] !== data[key]) {
				changedData[key] = data[key];
			}
		}

		if (!Object.keys(changedData).length) return

		setIsSaving(true);
		if (!withOutMutate) {
			mutate(e => e == patchURL, (e) => ({ ...e, ...changedData }), { revalidate: false })
		}
		await axios
			.patch(API_URL + patchURL, changedData)
			.finally(() => setIsSaving(false))
	}

	const setAutoSaveData = (key: keyof T, value: T[keyof T]) => {
		setData((e) => {
			if (e) return { ...e, [key]: value };
		});
	};

	const debouncedSavingData = useDebouncedCallback(savingData, 1000);

	if (serverAtData?.id !== data?.id) {
		setData(serverAtData)
	}

	useEffect(() => { debouncedSavingData() }, [data, debouncedSavingData]);

	return {
		setData,
		autoSaveData: data,
		setAutoSaveData: serverAtData ? setAutoSaveData : undefined,
	};
}
