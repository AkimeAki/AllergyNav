import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetStoreResponse } from "@/type";

interface ReturnType {
	getStore: (menuId: string) => void;
	getStoreResponse: NonNullable<GetStoreResponse> | undefined;
	getStoreStatus: FetchStatus;
	getStoreResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getStoreResponse,
		status: getStoreStatus,
		responseStatus: getStoreResponseStatus
	} = useFetchApi<GetStoreResponse>();

	const getStore = (storeId: string): void => {
		void fetchData(
			"getStore",
			{
				storeId
			},
			{}
		);
	};

	return { getStore, getStoreResponse, getStoreStatus, getStoreResponseStatus };
}
