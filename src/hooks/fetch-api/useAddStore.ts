import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, AddStoreResponse } from "@/type";

interface ReturnType {
	addStore: (name: string, address: string, description: string) => void;
	addStoreResponse: NonNullable<AddStoreResponse> | undefined;
	addStoreStatus: FetchStatus;
	addStoreResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: addStoreResponse,
		status: addStoreStatus,
		responseStatus: addStoreResponseStatus
	} = useFetchApi<AddStoreResponse>();

	const addStore = (name: string, address: string, description: string): void => {
		void fetchData(
			"addStore",
			{},
			{
				address,
				name,
				description
			}
		);
	};

	return { addStore, addStoreResponse, addStoreStatus, addStoreResponseStatus };
}
