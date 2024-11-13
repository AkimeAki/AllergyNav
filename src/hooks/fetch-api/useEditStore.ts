import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, EditStoreResponse } from "@/type";

interface ReturnType {
	editStore: (
		storeId: string,
		name: string,
		address: string,
		description: string,
		url: string,
		allergyMenuUrl: string,
		tabelogUrl: string,
		gurunaviUrl: string,
		hotpepperUrl: string
	) => void;
	editStoreResponse: NonNullable<EditStoreResponse> | undefined;
	editStoreStatus: FetchStatus;
	editStoreResponseStatus: number | undefined;
	editStoreReset: () => void;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: editStoreResponse,
		status: editStoreStatus,
		responseStatus: editStoreResponseStatus,
		reset: editStoreReset
	} = useFetchApi<EditStoreResponse>();

	const editStore = (
		storeId: string,
		name: string,
		address: string,
		description: string,
		url: string,
		allergyMenuUrl: string,
		tabelogUrl: string,
		gurunaviUrl: string,
		hotpepperUrl: string
	): void => {
		void fetchData(
			"editStore",
			{
				storeId
			},
			{
				address,
				name,
				description,
				url,
				allergyMenuUrl,
				tabelogUrl,
				gurunaviUrl,
				hotpepperUrl
			}
		);
	};

	return { editStore, editStoreResponse, editStoreStatus, editStoreResponseStatus, editStoreReset };
}
