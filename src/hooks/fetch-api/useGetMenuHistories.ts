import useFetchApi from "@/hooks/useFetchApi";
import type { FetchStatus, GetMenuHistoryResponse } from "@/type";

interface ReturnType {
	getMenuHistories: (menuId: string) => void;
	getMenuHistoriesResponse: NonNullable<GetMenuHistoryResponse> | undefined;
	getMenuHistoriesStatus: FetchStatus;
	getMenuHistoriesResponseStatus: number | undefined;
}

export default function (): ReturnType {
	const {
		fetchData,
		response: getMenuHistoriesResponse,
		status: getMenuHistoriesStatus,
		responseStatus: getMenuHistoriesResponseStatus
	} = useFetchApi<GetMenuHistoryResponse>();

	const getMenuHistories = (menuId: string): void => {
		void fetchData(
			"getMenuHistories",
			{
				menuId
			},
			{}
		);
	};

	return { getMenuHistories, getMenuHistoriesResponse, getMenuHistoriesStatus, getMenuHistoriesResponseStatus };
}
