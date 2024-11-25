import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetMenusResponse } from "@/type";

interface ReturnType {
	getMenus: (keywords: string, allergens: string, storeId: string) => void;
	getMenusResponse: NonNullable<GetMenusResponse> | undefined;
	getMenusStatus: FetchStatus;
	getMenusResponseStatus: number | undefined;
}

export default function (initStatus: FetchStatus = "yet"): ReturnType {
	const {
		fetchData,
		response: getMenusResponse,
		status: getMenusStatus,
		responseStatus: getMenusResponseStatus
	} = useFetchApi<GetMenusResponse>(initStatus);

	const getMenus = (keywords: string, allergens: string, storeId: string): void => {
		void fetchData(
			"getMenus",
			{
				keywords,
				allergens,
				storeId
			},
			{}
		);
	};

	return { getMenus, getMenusResponse, getMenusStatus, getMenusResponseStatus };
}
