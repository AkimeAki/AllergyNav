import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddStoreResponse } from "@/type";

interface ReturnType {
	addStore: (
		name: string,
		address: string,
		description: string,
		url: string,
		allergyMenuUrl: string,
		tabelogUrl: string,
		gurunaviUrl: string,
		hotpepperUrl: string
	) => void;
	addStoreResponse: NonNullable<AddStoreResponse> | undefined;
	addStoreStatus: FetchStatus;
	addStoreResponseStatus: number | undefined;
	addStoreReset: () => void;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: addStoreResponse,
		status: addStoreStatus,
		responseStatus: addStoreResponseStatus,
		reset: addStoreReset
	} = useFetchApi<AddStoreResponse>();

	const addStore = (
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
			"addStore",
			{},
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

	return { addStore, addStoreResponse, addStoreStatus, addStoreResponseStatus, addStoreReset };
}
