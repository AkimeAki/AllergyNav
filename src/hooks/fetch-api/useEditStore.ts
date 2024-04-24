import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, EditStoreResponse } from "@/type";

interface ReturnType {
	editStore: (storeId: string, name: string, address: string, description: string) => void;
	editStoreResponse: NonNullable<EditStoreResponse> | undefined;
	editStoreStatus: FetchStatus;
	editStoreResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: editStoreResponse,
		status: editStoreStatus,
		responseStatus: editStoreResponseStatus
	} = useFetchApi<EditStoreResponse>();

	const editStore = (storeId: string, name: string, address: string, description: string): void => {
		void fetchData(
			"editStore",
			{
				storeId
			},
			{
				address,
				name,
				description
			}
		);
	};

	return { editStore, editStoreResponse, editStoreStatus, editStoreResponseStatus };
}
