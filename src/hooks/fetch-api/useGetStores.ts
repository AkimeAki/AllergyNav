import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetStoresResponse } from "@/type";

interface ReturnType {
	getStores: (
		allergens: string,
		keywords: string,
		area: string,
		coords: string,
		radius: string,
		page: number
	) => void;
	getStoresResponse: NonNullable<GetStoresResponse> | undefined;
	getStoresStatus: FetchStatus;
	getStoresResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getStoresResponse,
		status: getStoresStatus,
		responseStatus: getStoresResponseStatus
	} = useFetchApi<GetStoresResponse>();

	const getStores = (
		allergens: string,
		keywords: string,
		area: string,
		coords: string,
		radius: string,
		page: number
	): void => {
		void fetchData(
			"getStores",
			{
				allergens,
				keywords,
				area,
				coords,
				radius,
				page: String(page)
			},
			{}
		);
	};

	return { getStores, getStoresResponse, getStoresStatus, getStoresResponseStatus };
}
